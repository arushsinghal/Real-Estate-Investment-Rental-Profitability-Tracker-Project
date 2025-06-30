-- SELECT
--     p.property_id, p.address,
--     ((COALESCE(SUM(r.monthly_rent) * 12, 0) - COALESCE(SUM(e.amount), 0)) / t.amount) * 100 AS ROE
-- FROM Properties p
-- JOIN Transactions t ON p.property_id = t.property_id AND t.type = 'purchase'
-- LEFT JOIN Rentals r ON p.property_id = r.property_id
-- LEFT JOIN Expenses e ON p.property_id = e.property_id
-- GROUP BY p.property_id, p.address, t.amount

-- SELECT
--     p.property_id,
--     p.address,
--     ROUND(
--         (
--             COALESCE(r.total_rent, 0) * 12 - COALESCE(e.total_expense, 0)
--         ) / t.amount * 100, 2
--     ) AS ROE
-- FROM Properties p
-- JOIN Transactions t ON p.property_id = t.property_id AND t.type = 'purchase'
-- LEFT JOIN (
--     SELECT property_id, SUM(monthly_rent) AS total_rent
--     FROM Rentals
--     GROUP BY property_id
-- ) r ON p.property_id = r.property_id
-- LEFT JOIN (
--     SELECT property_id, SUM(amount) AS total_expense
--     FROM Expenses
--     GROUP BY property_id
-- ) e ON p.property_id = e.property_id

SELECT
    p.property_id,
    p.address,
    ROUND(((COALESCE(r.total_rent, 0) * 12 - COALESCE(e.total_expense, 0)) / 
           NULLIF(p.current_value, 0)) * 100, 2) AS ROE
FROM Properties p
LEFT JOIN (
    SELECT property_id, SUM(monthly_rent) AS total_rent
    FROM Rentals
    GROUP BY property_id
) r ON p.property_id = r.property_id
LEFT JOIN (
    SELECT property_id, SUM(amount) AS total_expense
    FROM Expenses
    GROUP BY property_id
) e ON p.property_id = e.property_id
