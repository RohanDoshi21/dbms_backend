const client = require("../db/connect");
const bcrypt = require("bcryptjs");
const generateUserToken = require("../utils/userToken");
const customerRouter = require("express").Router();

const {
    validateUserData,
    isAuthenticated,
} = require("../middlewares/customerMiddleware.js");

customerRouter.post("/signup", validateUserData, async (req, res) => {
    text =
        "insert INTO Customers(full_name, username, email, mobile_number, password, latitude, longitude, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id, full_name, username, email, mobile_number, created_at, updated_at";
    const timestamp = new Date();
    const encryptedPassword = await bcrypt.hash(req.body.password, 10);
    latitude = 0.0;
    longitude = 0.0;
    values = [
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
    text = "select * from Customers where email = $1";
    values = [req.body?.email?.toLowerCase()];
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

customerRouter.get("/me", isAuthenticated, (req, res) => {
    res.send({ user: req.user });
});

module.exports = customerRouter;
