CREATE TABLE Admin(
  id BIGSERIAL PRIMARY KEY,
  firstname VARCHAR(89) NOT NULL,
  surname VARCHAR(89) NOT NULL,
  phonenumber VARCHAR(89) NOT NULL,
  role ROLE NOT NULL,
  password VARCHAR(150) NOT NULL
);

CREATE TYPE ROLE AS ENUM(
    'superAdmin',
    'admin'
);