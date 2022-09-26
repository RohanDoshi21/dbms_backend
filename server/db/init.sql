CREATE TABLE users (
	id INT GENERATED ALWAYS AS IDENTITY UNIQUE,
	first_name VARCHAR(255) NOT NULL,
	last_name VARCHAR(255) NOT NULL,
	email VARCHAR(255) NOT NULL UNIQUE,
	mobile_number VARCHAR(100) NOT NULL UNIQUE,
	password VARCHAR(255) NOT NULL,
	created_at TIMESTAMP NOT NULL,
	updated_at TIMESTAMP NOT NULL
);

CREATE TABLE Customers (
  id SERIAL PRIMARY KEY,
  full_name varchar,
  username varchar UNIQUE,
  email varchar UNIQUE,
  mobile_number varchar UNIQUE,
  password varchar,
  latitude float,
  longitude float,
  created_At timestamp,
  updated_at timestamp
);

CREATE TABLE customer_token (
	id INT GENERATED ALWAYS AS IDENTITY UNIQUE,
	token VARCHAR(255) NOT NULL,
	is_valid BOOLEAN NOT NULL,
	created_at TIMESTAMP NOT NULL,
	updated_at TIMESTAMP NOT NULL,
	fk_customer INT,
	CONSTRAINT fk_customer FOREIGN KEY(fk_customer) REFERENCES Customers(id) ON DELETE CASCADE
);

CREATE TABLE Vendors (
  id SERIAL PRIMARY KEY,
  username varchar UNIQUE,
  email varchar UNIQUE,
  mobile_number varchar UNIQUE,
  password varchar,
  latitude float,
  longitude float,
  created_At timestamp,
  updated_at timestamp,
  delivery_distance float,
  rating float,
  rating_count int
);

CREATE TABLE vendor_token (
	id INT GENERATED ALWAYS AS IDENTITY UNIQUE,
	token VARCHAR(255) NOT NULL,
	is_valid BOOLEAN NOT NULL,
	created_at TIMESTAMP NOT NULL,
	updated_at TIMESTAMP NOT NULL,
	fk_vendor INT,
	CONSTRAINT fk_vendor FOREIGN KEY(fk_vendor) REFERENCES Vendors(id) ON DELETE CASCADE
);

CREATE TABLE Orders (
  id SERIAL PRIMARY KEY,
  fk_customer int,
  fk_item int,
  quantity int,
  status varchar,
  delivery_charges float,
  package_charges float,
  taxes float,
  total_amount float,
  created_At timestamp
);

CREATE TABLE Items (
  id SERIAL PRIMARY KEY,
  name varchar,
  selling_price float,
  mrp float,
  fk_vendor int,
  quantity int
);

ALTER TABLE Orders ADD FOREIGN KEY (fk_customer) REFERENCES Customers(id);

ALTER TABLE Orders ADD FOREIGN KEY (fk_item) REFERENCES Items(id);

ALTER TABLE Items ADD FOREIGN KEY (fk_vendor) REFERENCES Vendors(id);