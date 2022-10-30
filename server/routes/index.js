let express = require("express");
let router = express.Router();
const client = require("../db/connect");

/* GET home page. */
router.get("/ping", (req, res, next) => {
  console.log("Hello User");
  res.send("pong");
});

router.get("/insert", async (req, res, next) => {
  console.log("Test Inserting into table");

  const query =
    "insert into users(first_name, last_name, email, mobile_number, password, created_at, updated_at) values('Rohan', 'Doshi', 'rohandoshi@gmail.com', '9325712554', 'rohandoshi21', '2022-06-21 19:10:25-07', '2022-06-21 19:10:25-07') returning *";

  console.log(query);
  try {
    const result = await client.query(query, []);
    res.send(result.rows);
  } catch (err) {
    console.log("Error");
    console.log(err);
    res.status(500).send("Error");
  }
});

router.get("/testGetUsers", async (req, res, next) => {
  console.log("Getting users from table");

  const query = "select * from users";

  console.log(query);
  try {
    const result = await client.query(query, []);
    res.send(result.rows);
  } catch (err) {
    console.log("Error");
    console.log(err);
    res.status(500).send("Error");
  }
});

router.get("/getCustomers", async (req, res, next) => {
  console.log("Getting customers from table");

  const query = "select * from Customers";

  console.log(query);
  try {
    const result = await client.query(query, []);
    res.send(result.rows);
  } catch (err) {
    console.log("Error");
    console.log(err);
    res.status(500).send("Error");
  }
});

router.get("/getVendors", async (req, res, next) => {
  console.log("Getting vendors from table");

  const query = "select * from Vendors";

  console.log(query);
  try {
    const result = await client.query(query, []);
    res.send(result.rows);
  } catch (err) {
    console.log("Error");
    console.log(err);
    res.status(500).send("Error");
  }
});

router.get("/getItems", async (req, res, next) => {
  console.log("Getting items from table");

  const query = "select * from Items";

  console.log(query);
  try {
    const result = await client.query(query, []);
    res.send(result.rows);
  } catch (err) {
    console.log("Error");
    console.log(err);
    res.status(500).send("Error");
  }
});

router.get("/users", (req, res, next) => {
  res.send("NO User");
});

module.exports = router;
