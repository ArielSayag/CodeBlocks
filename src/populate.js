const CodeQuestion = require("./models/CodeQuestion")
const CodeSolution = require("./models/CodeSolution")

const initialData = [
  {
    "title": "Async case",
    "code": "async function example() {\n  return fetchData();\n}",
    "solution": "async function example() {\n  return await fetchData();\n}"
  },
  {
    "title": "Array Map",
    "code": "const numbers = [1, 2, 3, 4, 5]\nconst doubledNumbers = numbers.map(num => num + 2)\nconsole.log(doubledNumbers)",
    "solution": "const numbers = [1, 2, 3, 4, 5];\nconst doubledNumbers = numbers.map(num => num * 2);\nconsole.log(doubledNumbers);"
  },
  {
    "title": "Array Filter",
    "code": "const numbers = [1, 2, 3, 4, 5];\nconst evenNumbers = numbers.filter(num => num % 2 === 0);\nconsole.log(evenNumbers)",
    "solution": "const numbers = [1, 2, 3, 4, 5];\nconst evenNumbers = numbers.filter(num => num % 2 === 0);\nconsole.log(evenNumbers);"
  },
  {
    "title": "Set Timeout",
    "code": "console.log('Start')\nsetTimeout(() => console.log('Delayed log'), 2000)\nconsole.log('End')",
    "solution": "console.log('Start');\nsetTimeout(() => console.log('Delayed log'), 2000);\nconsole.log('End');"
  }
]

async function populateDatabase() {

  await CodeQuestion.deleteMany({})
  await CodeSolution.deleteMany({})

  const models = []
  for(var questionData of initialData) {
    models.push( new CodeQuestion(questionData))
  }
  await CodeQuestion.bulkSave(models)
}

module.exports = {
  populateDatabase
}