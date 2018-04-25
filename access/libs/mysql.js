const mysql = require("mysql");

const config = require('../config');
const mysqlconfig = config.mysql || {};

const client = mysql.createConnection(mysqlconfig)

module.exports = client;
