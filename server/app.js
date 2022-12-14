let express = require("express");
let path = require("path");
let cookieParser = require("cookie-parser");
let logger = require("morgan");

let indexRouter = require("./routes/index");
let customerRouter = require("./routes/customer");
let vendorRouter = require("./routes/vendor");
let itemRouter = require("./routes/items");
let orderRouter = require("./routes/orders");

let app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/customer", customerRouter);
app.use("/vendor", vendorRouter);
app.use("/items", itemRouter);
app.use("/orders", orderRouter);

module.exports = app;
