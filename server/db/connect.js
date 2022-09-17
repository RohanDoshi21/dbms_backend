const { Client } = require("pg");

const configDev = {
	host: process.env.POSTGRES_HOST,
	user: process.env.POSTGRES_USER,
	port: process.env.POSTGRES_PORT,
	password: process.env.POSTGRES_PASSWORD,
	database: process.env.POSTGRES_DB,
};

const client = new Client(configDev);

client.connect(function (err) {
	if (err) throw err;
	console.log("Connected!");
});

module.exports = client;
