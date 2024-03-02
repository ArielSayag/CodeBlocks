
const mongoose = require('mongoose')

const CodeSolutionSchema = new mongoose.Schema({
  // userId: { type: String, required: true },
  question: { type: mongoose.Schema.Types.ObjectId, ref: "CodeQuestions"},
  solutionSet: [{type:String, required:true}],
  finalSolution: {type:String, require:true}
},{
  versionKey: false
})


const CodeSolution = mongoose.model("CodeSolutions", CodeSolutionSchema)

module.exports = CodeSolution