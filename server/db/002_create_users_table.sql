CREATE TABLE users (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    password VARCHAR,
    email VARCHAR,
    firstname VARCHAR(50),
    lastName VARCHAR(50),
    created DATE,
    modified DATE
);