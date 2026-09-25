CREATE TABLE refund_items (
  id SERIAL PRIMARY KEY,
  refund_id INT NOT NULL REFERENCES refunds(id) ON DELETE CASCADE,
  order_item_id INT NOT NULL REFERENCES order_items(id),
  quantity INT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL
);