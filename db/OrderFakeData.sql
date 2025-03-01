use orderService;

INSERT INTO jhi_order (id, user_id_1, total_price, order_status, payment_status, created_date) VALUES
(1, 8620, 31152.13, 'luck encouragement strait', 'nor phooey', '2025-02-11 05:02:26'),
(2, 32308, 7542.14, 'consequently thrifty', 'upright', '2025-02-10 14:30:21');

INSERT INTO order_item (id, product_id, quantity, price, order_id) VALUES
(1, 1, 9401, 21244.65, 1),
(2, 2, 13504, 789.87, 1),
(3, 2, 18590, 6303.01, 2),
(4, 1, 10737, 21916.71, 2);

INSERT INTO payment (id, payment_method, transaction_id, payment_status, payment_date, order_id) VALUES
(1, 'reorient voluntarily', 'interestingly eek readily', 'gah drat apropos', '2025-02-11 00:13:49', 1),
(2, 'than massage', 'manner', 'junior provision impossible', '2025-02-10 23:34:14', 2);
