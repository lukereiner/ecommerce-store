CREATE TABLE order_items (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    quantity INTEGER,
    created DATE,
    modified DATE,
    price DECIMAL,
    orderId INTEGER REFERENCES orders(id),
    productId INTEGER REFERENCES products(id)
);