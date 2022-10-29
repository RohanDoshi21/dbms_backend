const client = require("../db/connect");
const itemRouter = require("express").Router();

const { isAuthenticated } = require("../middlewares/vendorMiddleware.js");

itemRouter.post("/addItem", isAuthenticated, async (req, res) => {
	let text =
		"insert INTO Items(name, selling_price, mrp, fk_vendor, quantity) VALUES ($1, $2, $3, $4, $5) RETURNING name, selling_price, mrp, quantity";

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

module.exports = itemRouter;
