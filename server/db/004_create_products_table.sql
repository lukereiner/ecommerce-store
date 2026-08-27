CREATE TABLE products (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(255),
    price DECIMAL,
    description VARCHAR,
    created DATE,
    modified DATE
);