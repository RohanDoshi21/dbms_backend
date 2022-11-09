const client = require("../db/connect");
const orderRouter = require("express").Router();

const { isAuthenticated } = require("../middlewares/customerMiddleware.js");

orderRouter.post("/createOrder", isAuthenticated, async (req, res) => {

    let checkIfPreviousOrderExists = "select * from Customer_Order where fk_customer = $1 and status = 'CREATED'";


  let query =
    "Insert into Customer_Order(fk_customer, status) values ($1, 'CREATED') RETURNING order_id";
  let values = [req.user["id"]];

  try {
    let result = await client.query(checkIfPreviousOrderExists, values);
    if (result.rows.length > 0) {
        res.status(400).json({ error: "Previous order exists" });
    } else {
        const data = await client.query(query, values);
        res.json(data.rows[0]);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

orderRouter.post("/addItemToOrder", isAuthenticated, async (req, res) => {
  let getSellingPrice = "select selling_price from Items where id = $1";

  try {
    let data = await client.query(getSellingPrice, [req.body.itemId]);

    // Generating selling_price and total_price
    let selling_price = data.rows[0]["selling_price"];
    let total_price = selling_price * req.body.quantity;
    let packaging_charge = 0.05 * total_price;

    let getOrderNo = "select order_id from Customer_Order where fk_customer = $1 and status = 'CREATED'";

    data = await client.query(getOrderNo, [req.user.id]);

    let order_id = data.rows[0]["order_id"];

    // Insert into Cart
    let cartQuery =
      "Insert into Cart(fk_order, fk_item, quantity, total, package_charges, status) values ($1, $2, $3, $4, $5, 'BOUGHT') RETURNING *";
    let cartValues = [
      order_id,
      req.body.itemId,
      req.body.quantity,
      total_price,
      packaging_charge,
    ];

    data = await client.query(cartQuery, cartValues);
    if (data.rowCount === 1) {
      res.json(data.rows[0]);
    } else {
      res.status(404).json({ error: "Error adding product to cart" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

orderRouter.post("/confirmOrder", isAuthenticated, async (req, res) => {
  try {
    let getOrderNo = "select order_id from Customer_Order where fk_customer = $1 and status = 'CREATED'";
    let data = await client.query(getOrderNo, [req.user.id]);
    let order_id = data.rows[0]["order_id"];

    let totalCostQuery =
      'select sum(total + package_charges) as "Total Cost" from Cart where fk_order = $1';

    data = await client.query(totalCostQuery, [order_id]);

    // Calculating total cost and Grand Cost
    let totalCost = data.rows[0]["Total Cost"];
    let tax = 0.09 * totalCost;
    let deliveryCharge = totalCost + tax > 1000 ? 0 : 25;
    let Grand_Total = totalCost + tax + deliveryCharge;

    // Updating Order
    let query =
      "update Customer_Order set status = 'CONFIRMED', total = $1, delivery_charges = $2, taxes = $3, grand_total = $4 where order_id = $5";
    let values = [
      totalCost,
      deliveryCharge,
      tax,
      Grand_Total,
      order_id
    ];

    data = await client.query(query, values);
    if (data.rowCount === 1) {
      res.json({ msg: "Order confirmed" });
    } else {
      res.status(404).json({ error: "Order Failed" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = orderRouter;
