import express from 'express'
import * as controller from '../controllers/queryController.js';
const router = express.Router();

// === Simple SQL Queries (GET) ===
router.get('/cashflow', controller.cashFlow);
router.get('/negative-cashflow', controller.negativeCashFlow);
router.get('/roe', controller.roe);
router.get('/growth', controller.marketGrowth);
router.get('/undervalued-properties/', controller.undervaluedProperties);
router.get('/projected-value/', controller.projection);
router.get('/active-leases/', controller.activeLeases);
router.get('/above-market-rent', controller.aboveMarketRent);
router.get('/top-investors', controller.topInvestors);
router.get('/average-expense', controller.averageExpense);
router.get('/outlier-transactions/', controller.outliers);
router.get('/no-rental-high-expense', controller.noRentalHighExpense);
router.get('/monthly-expense', controller.monthlyExpense);
router.get('/top-months', controller.topMonths);
router.get('/cashflow-monthly/', controller.cashflowMonthlyCursor);
router.get('/show-users', controller.showUsers);
router.get('/show-properties', controller.showProperties);
router.get('/show-rentals', controller.showRentals);
router.get('/show-expenses', controller.showExpenses);
router.get('/show-transactions', controller.showTransactions);
router.get('/show-market-trends', controller.showMarket);

// === PL/SQL Procedures / Functions (POST) ===
router.post('/calculate-roi', controller.calculateROI);
router.post('/days-to-lease-end', controller.daysToLeaseEnd);

export default router;
