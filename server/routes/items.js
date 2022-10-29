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
		res.status(500).json({ error: "Internal Server Error" });
	}
});

itemRouter.patch("/updateQuantity", isAuthenticated, async (req, res) => {
	let text =
		"update Items set quantity = quantity + $1 where name = $2 and fk_vendor = $3 and id = $4 RETURNING name, selling_price, mrp, quantity";
	let values = [
		req.body.quantity,
		req.body.name,
		req.user["id"],
		req.body.id,
	];

	try {
		const data = await client.query(text, values);
		res.json(data.rows[0]);
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

module.exports = itemRouter;
