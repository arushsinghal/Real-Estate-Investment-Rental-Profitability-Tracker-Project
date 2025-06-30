import OracleDB from 'oracledb';
import getConnection from '../db/connectDB.js';
import loadQuery from '../utils/queryLoader.js';
import camelcaseKeys from 'camelcase-keys';

// === Reusable GET Query Runner ===
// async function runSimpleQuery(fileName, res) {
//   try {
//     const sql = loadQuery(fileName);
//     const conn = await getConnection();
//     const result = await conn.execute(sql, [], { outFormat: 4002 });
//     await conn.close();

//     const camelCasedRows = result.rows.map(row => camelcaseKeys(row));
//     res.json(camelCasedRows);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// }

async function runSimpleQuery(fileName, res) {
  try {
    const sql = loadQuery(fileName);
    const conn = await getConnection();
    const result = await conn.execute(sql, [], { outFormat: 4002 });
    await conn.close();

    const camelCasedRows = result.rows.map(row =>
      camelcaseKeys(
        Object.fromEntries(
          Object.entries(row).map(([key, value]) => [key.toLowerCase(), value])
        )
      )
    );

    res.json(camelCasedRows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


// === Simple SQL Queries (GET) ===
export const cashFlow = (req, res) => runSimpleQuery('cashflow.sql', res);
export const negativeCashFlow = (req, res) => runSimpleQuery('negative_cashflow.sql', res);
export const roe = (req, res) => runSimpleQuery('roe.sql', res);
export const marketGrowth = (req, res) => runSimpleQuery('growth.sql', res);
export const undervaluedProperties = (req, res) => runSimpleQuery('undervalued.sql', res);
export const projection = (req, res) => runSimpleQuery('projection.sql', res);
export const activeLeases = (req, res) => runSimpleQuery('active_leases.sql', res);
export const aboveMarketRent = (req, res) => runSimpleQuery('above_market.sql', res);
export const topInvestors = (req, res) => runSimpleQuery('top_investors.sql', res);
export const averageExpense = (req, res) => runSimpleQuery('average_expense.sql', res);
export const outliers = (req, res) => runSimpleQuery('outliers.sql', res);
export const noRentalHighExpense = (req, res) => runSimpleQuery('no_rental_high_expense.sql', res);
export const monthlyExpense = (req, res) => runSimpleQuery('monthly_expense.sql', res);
export const topMonths = (req, res) => runSimpleQuery('top_months.sql', res);
export const cashflowMonthlyCursor = (req, res) => runSimpleQuery('cashflow_monthly_cursor.sql', res);
export const showUsers = (req, res) => runSimpleQuery('show_users.sql', res);
export const showProperties = (req, res) => runSimpleQuery('show_properties.sql', res);
export const showRentals = (req, res) => runSimpleQuery('show_rentals.sql', res);
export const showExpenses = (req, res) => runSimpleQuery('show_expenses.sql', res);
export const showTransactions = (req, res) => runSimpleQuery('show_transactions.sql', res);
export const showMarket = (req, res) => runSimpleQuery('show_market_trends.sql', res);

// === PL/SQL Procedure Call: POST /calculate-roi
export async function calculateROI(req, res) {
  const { propertyId } = req.body;
  if (!propertyId) return res.status(400).json({ error: 'propertyId required' });

  try {
    const conn = await getConnection();
    const result = await conn.execute(
      `BEGIN calculate_property_roi(:id, :roi); END;`,
      {
        id: propertyId,
        roi: { dir: OracleDB.BIND_OUT, type: OracleDB.NUMBER }
      }
    );
    await conn.close();
    res.json({ propertyId, roi: result.outBinds.roi });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// === Function Call: POST /days-to-lease-end
// export async function daysToLeaseEnd(req, res) {
//   const { rentalId } = req.body;
//   if (!rentalId) return res.status(400).json({ error: 'rentalId required' });

//   try {
//     const conn = await getConnection();
//     const result = await conn.execute(
//       `SELECT days_to_lease_end(:rentalId) AS days FROM dual`,
//       { rentalId }
//     );
//     await conn.close();
//     res.json({ rentalId, daysRemaining: result.rows[0]?.DAYS });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// }
 // your own connection file

export async function daysToLeaseEnd(req, res) {
  const { rentalId } = req.body;
  if (!rentalId) return res.status(400).json({ error: 'rentalId required' });

  try {
    const conn = await getConnection();
    const result = await conn.execute(
      `SELECT days_to_lease_end(:rentalId) AS DAYS FROM dual`,
      { rentalId },
      { outFormat: OracleDB.OUT_FORMAT_OBJECT } 
    );
    await conn.close();

    const daysRemaining = result.rows[0]?.DAYS;

    if (daysRemaining === null || daysRemaining === undefined) {
      return res.status(404).json({ error: 'Rental ID not found' });
    }

    res.json({ rentalId, daysRemaining });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

