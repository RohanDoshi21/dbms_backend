const client = require("../db/connect");
const bcrypt = require("bcryptjs");
const generateUserToken = require("../utils/userToken");
const customerRouter = require("express").Router();

const {
  validateUserData,
  isAuthenticated,
} = require("../middlewares/customerMiddleware.js");
const e = require("express");

customerRouter.post("/address", isAuthenticated, async (req, res) => {
  let text =
    "insert into Address(line_1,line_2,city,user_state,postal_code) values($1,$2,$3,$4,$5) returning *";
  let values = [
    req.body.line_1,
    req.body.line_2,
    req.body.city,
    req.body.user_state,
    req.body.postal_code,
  ];
  try {
    const data = await client.query(text, values);
    let text2 =
      "insert into Customer_Address(customer_id,address_id,created_at,updated_at) values($1,$2,$3,$4) returning *";
    const timestamp = new Date();
    let values2 = [req.user.id, data.rows[0].id, timestamp, timestamp];

    const data2 = await client.query(text2, values2);
    console.log(data2.rows);
    res.json({
      cust_addr: { ...data2.rows[0] },
      address_from_address: { ...data.rows[0] },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

customerRouter.post("/signup", validateUserData, async (req, res) => {
  let text =
    "insert INTO Customers(full_name, username, email, mobile_number, password, latitude, longitude, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id, full_name, username, email, mobile_number, created_at, updated_at";
  const timestamp = new Date();
  const encryptedPassword = await bcrypt.hash(req.body.password, 10);
  let latitude = 0.0;
  let longitude = 0.0;
  let values = [
    req.body.full_name,
    req.body.username,
    req.body.email.toLowerCase(),
    req.body.mobile_number,
    encryptedPassword,
    latitude,
    longitude,
    timestamp,
    timestamp,
  ];
  try {
    const data = await client.query(text, values);
    const token = await generateUserToken(data.rows[0].id);
    res.json({ token: token, user: { ...data.rows[0] } });
  } catch (err) {
    console.log(err);
    const duplicateError = err.message.split(" ").pop().replaceAll('"', "");
    if (duplicateError === "customers_email_key") {
      res.status(409).json({
        error: "User with this email already exists",
      });
    } else if (duplicateError === "customers_mobile_number_key") {
      res.status(409).json({
        error: "User with this mobile_number already exists",
      });
    } else if (duplicateError === "customers_username_key") {
      res.status(409).json({
        error: "User with this username already exists",
      });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

customerRouter.post("/login", async (req, res) => {
  let text = "select * from Customers where email = $1";
  let values = [req.body?.email?.toLowerCase()];
  try {
    const data = await client.query(text, values);
    if (data.rowCount === 1) {
      const auth = await bcrypt.compare(
        req.body.password,
        data.rows[0].password
      );
      if (auth) {
        const token = await generateUserToken(data.rows[0].id);
        const user = data.rows[0];
        delete user.password;
        return res.json({
          token,
          user,
        });
      } else {
        return res
          .status(403)
          .json({ error: "email and password does not match" });
      }
    } else {
      return res.status(404).json({ error: "No user Found" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error." });
  }
});

customerRouter.get("/myorder", isAuthenticated, async (req, res) => {
  let query =
    "Select Customer_Order.order_id,Customer_Order.total,Customer_Order.delivery_charges,Customer_Order.taxes,Customer_Order.grand_total,Cart.fk_item,Cart.quantity from Customer_Order inner join Cart on Customer_Order.order_id = Cart.fk_order where Customer_Order.fk_customer=$1 and Cart.fk_order=$2 and Cart.status = 'Bought'";
  let values = [req.user.id, req.body.orderId];
  try {
    const data = await client.query(query, values);
    res.json({ order: { ...data.rows[0] } });
  } catch (error) {
    res.send(error);
  }
});

customerRouter.get("/me", isAuthenticated, (req, res) => {
  res.send({ user: req.user });
});

customerRouter.get("/getItems", isAuthenticated, async (req, res) => {
  let text = "select * from items";

  let search = req.query.name;

  let search_q = "select * from items where items.name like $1";

  console.log(search);

  try {
    if (search) {
      const dataq = await client.query(search_q, ["%" + req.query.name + "%"]);
      res.json(dataq);
    } else {
      const data = await client.query(text);
      res.json(data);
    }

    // res.send("asd");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

module.exports = customerRouter;
