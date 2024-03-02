

const mongoose = require('mongoose')
const dotenv = require('dotenv')
const chalk = require('chalk')

const {populateDatabase} = require('./populate')
dotenv.config()

mongoose.connect(process.env.DB_URI).then(async () => {
  console.log(chalk.bold.green("Connected to database."))
  await populateDatabase()
  console.log(chalk.yellow("Database populated (:."))
}).catch(err => {
  console.error(chalk.red(`Error Connecting to database. ${err.message}`))
})