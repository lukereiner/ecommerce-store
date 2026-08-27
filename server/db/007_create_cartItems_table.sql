CREATE TABLE cart_items (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    created DATE,
    modified DATE,
    cartId INTEGER REFERENCES carts(id),
    productId INTEGER REFERENCES products(id)
);