CREATE TABLE IF NOT EXISTS myList(
    id SERIAL PRIMARY KEY NOT NULL,
    title VARCHAR(255),
    company VARCHAR(255),
    location VARCHAR(255),
    url VARCHAR(500),
)