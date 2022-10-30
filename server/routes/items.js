const client = require("../db/connect");
const itemRouter = require("express").Router();

const { isAuthenticated } = require("../middlewares/vendorMiddleware.js");

itemRouter.post("/addItem", isAuthenticated, async (req, res) => {
  let text =
    "insert INTO Items(name, selling_price, mrp, fk_vendor, quantity) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, selling_price, mrp, quantity";

  let values = [
    req.body.name,
    req.body.selling_price,
    req.body.mrp,
    req.user["id"],
    req.body.quantity,
  ];

  try {
    const data = await client.query(text, values);
    res.json(data.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

itemRouter.patch("/updateQuantity", isAuthenticated, async (req, res) => {
  let text =
    "update Items set quantity = quantity + $1 where fk_vendor = $2 and id = $3 RETURNING name, selling_price, mrp, quantity";
  let values = [req.body.quantity, req.user["id"], req.body.itemId];

  try {
    const data = await client.query(text, values);
    if (data.rowCount === 1) {
      res.json(data.rows[0]);
    } else {
      res.status(404).json({ error: "No Product found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

itemRouter.patch("/updateSellingPrice", isAuthenticated, async (req, res) => {
  let text =
    "update Items set selling_price = $1 where fk_vendor = $2 and id = $3 RETURNING name, selling_price, mrp, quantity";
  let values = [req.body.selling_price, req.user["id"], req.body.itemId];

  try {
    const data = await client.query(text, values);
    if (data.rowCount === 1) {
      res.json(data.rows[0]);
    } else {
      res.status(404).json({ error: "No Product found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

module.exports = itemRouter;
