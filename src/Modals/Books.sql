CREATE TABLE Books(
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(89) NOT NULL UNIQUE,
  isbn VARCHAR(89) NOT NULL UNIQUE,
  issuedate DATE NOT NULL,
  author VARCHAR(89) NOT NULL
);
