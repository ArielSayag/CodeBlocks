

const mongoose = require('mongoose')
const dotenv = require('dotenv')
const chalk = require('chalk')
const path = require('path');

const {populateDatabase} = require('./populate')
const envFile = `.env.${process.env.NODE_ENV || 'development'}`;

dotenv.config({
  path: path.resolve(__dirname, '..', envFile)
});

mongoose.connect(process.env.DB_URI).then(async () => {
  console.log(chalk.bold.green("Connected to database."))
  await populateDatabase()
  console.log(chalk.yellow("Database populated (:."))
}).catch(err => {
  console.error(chalk.red(`Error Connecting to database. ${err.message}`))
})