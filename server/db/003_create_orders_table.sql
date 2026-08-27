CREATE TABLE orders (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    created DATE,
    modified DATE,
    total DECIMAL,
    status VARCHAR(20),
    userId INTEGER REFERENCES users(id)
);