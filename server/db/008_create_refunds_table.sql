CREATE TABLE refunds (
  id SERIAL PRIMARY KEY,
  order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  square_refund_id VARCHAR(255) UNIQUE, -- Unique ID returned by Square Refunds API
  square_payment_id VARCHAR(255),        -- Square payment ID associated with the order
  amount NUMERIC(10, 2) NOT NULL,        -- Amount refunded
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(50) NOT NULL,            -- e.g., 'PENDING', 'COMPLETED', 'FAILED'
  reason VARCHAR(255),                   -- Reason for refund
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);