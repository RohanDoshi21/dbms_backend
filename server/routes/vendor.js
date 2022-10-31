const client = require("../db/connect");
const bcrypt = require("bcryptjs");
const generateVendorToken = require("../utils/vendorToken");
const vendorRouter = require("express").Router();

const {
  validateUserData,
  isAuthenticated,
} = require("../middlewares/vendorMiddleware.js");

vendorRouter.post("/signup", validateUserData, async (req, res) => {
  let text =
    "insert INTO Vendors(full_name, username, email, mobile_number, password, latitude, longitude, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id, full_name, username, email, mobile_number, created_at, updated_at";
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
    const token = await generateVendorToken(data.rows[0].id);
    res.json({ token: token, user: { ...data.rows[0] } });
  } catch (err) {
    console.log(err);
    const duplicateError = err.message.split(" ").pop().replaceAll('"', "");
    if (duplicateError === "vendors_email_key") {
      res.status(409).json({
        error: "User with this email already exists",
      });
    } else if (duplicateError === "vendors_mobile_number_key") {
      res.status(409).json({
        error: "User with this mobile_number already exists",
      });
    } else if (duplicateError === "vendors_username_key") {
      res.status(409).json({
        error: "User with this username already exists",
      });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

vendorRouter.post("/login", async (req, res) => {
  let text = "select * from Vendors where email = $1";
  let values = [req.body?.email?.toLowerCase()];
  try {
    const data = await client.query(text, values);
    if (data.rowCount === 1) {
      const auth = await bcrypt.compare(
        req.body.password,
        data.rows[0].password
      );
      if (auth) {
        const token = await generateVendorToken(data.rows[0].id);
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

vendorRouter.get("/me", isAuthenticated, (req, res) => {
  res.send({ user: req.user });
});

vendorRouter.get("/myOrders", isAuthenticated, async (req, res) => {
  let text =
    "select Cart.quantity, Items.name, Items.selling_price, Items.mrp, Customers.full_name, Customers.mobile_number, Customers.email, CONCAT(Address.line_1, ' ', Address.line_2, ' ', Address.city, ' ', Address.user_state, ' ', Address.postal_code) as Address from Cart inner join Customer_Order on Cart.fk_order=Customer_Order.order_id inner join Customers on Customer_Order.fk_customer = Customers.id inner join Items on Cart.fk_item=Items.id inner join Customer_Address on Customers.id=Customer_Address.customer_id inner join Address on Customer_Address.address_id=Address.id where Items.fk_vendor=$1 and Customer_Order.status='CONFIRMED'";
  let values = [req.user.id];
  try {
    const data = await client.query(text, values);
    if (data.rowCount === 0) {
      return res.status(404).json({ error: "No orders Found" });
    } else {
      return res.json({ orders: data.rows });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error." });
  }
});

module.exports = vendorRouter;
