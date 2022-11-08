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
    full_name varchar NOT NULL,
    username varchar UNIQUE NOT NULL,
    email varchar UNIQUE NOT NULL,
    mobile_number varchar UNIQUE NOT NULL,
    password varchar NOT NULL,
    latitude float NOT NULL,
    longitude float NOT NULL,
    created_At timestamp,
    updated_at timestamp
);

CREATE TABLE Address (
    id SERIAL PRIMARY KEY,
    line_1 varchar NOT NULL,
    line_2 varchar,
    city varchar NOT NULL,
    user_state varchar NOT NULL,
    postal_code int NOT NULL
);

CREATE TABLE Customer_Address (
    customer_id int,
    address_id int,
    created_at timestamp,
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
    full_name varchar NOT NULL,
    username varchar UNIQUE NOT NULL,
    email varchar UNIQUE NOT NULL,
    mobile_number varchar UNIQUE NOT NULL,
    password varchar NOT NULL,
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

CREATE TABLE Items (
    id SERIAL PRIMARY KEY,
    name varchar NOT NULL,
    selling_price float NOT NULL check (selling_price >= 0),
    mrp float NOT NULL check (mrp >= 0),
    fk_vendor int NOT NULL,
    quantity int NOT NULL check (quantity >= 0),
    check (selling_price <= mrp)
);

CREATE TABLE Customer_Order (
    fk_customer int NOT NULL,
    order_id SERIAL PRIMARY KEY,
    total float check (total >= 0),
    status varchar NOT NULL,
    -- CREATED or CONFIRMED
    delivery_charges float  check (delivery_charges >= 0),
    taxes float  check (taxes >= 0),
    grand_total float  check (grand_total >= 0),
    check (grand_total = total + delivery_charges + taxes),
    check (status = 'CREATED' or status = 'CONFIRMED')
);

CREATE TABLE Cart (
    fk_order int NOT NULL,
    fk_item int NOT NULL,
    quantity int NOT NULL check (quantity >= 0),
    total float NOT NULL check (total >= 0),
    package_charges float NOT NULL check (package_charges >= 0),
    status varchar NOT NULL check (status = 'BOUGHT' or status = 'DELIVERED'),
    -- BOUGHT or DELIVERED
    PRIMARY KEY(fk_order, fk_item)
);

ALTER TABLE
    Customer_Order
ADD
    FOREIGN KEY (fk_customer) REFERENCES Customers(id);

ALTER TABLE
    Cart
ADD
    FOREIGN KEY (fk_order) REFERENCES Customer_Order(order_id);

ALTER TABLE
    Cart
ADD
    FOREIGN KEY (fk_item) REFERENCES Items (id);

-- CREATE TABLE Orders (
--     id SERIAL PRIMARY KEY,
--     fk_customer int,
--     fk_item int,
--     quantity int,
--     status varchar,
--     delivery_charges float,
--     package_charges float,
--     taxes float,
--     total_amount float,
--     created_At timestamp
-- );
-- ALTER TABLE
--     Orders
-- ADD
--     FOREIGN KEY (fk_customer) REFERENCES Customers(id);
-- ALTER TABLE
--     Orders
-- ADD
--     FOREIGN KEY (fk_item) REFERENCES Items(id);
ALTER TABLE
    Items
ADD
    FOREIGN KEY (fk_vendor) REFERENCES Vendors(id);

ALTER TABLE
    Customer_Address
ADD
    FOREIGN KEY (customer_id) REFERENCES Customers(id);

ALTER TABLE
    Customer_Address
ADD
    FOREIGN KEY (address_id) REFERENCES Address(id);