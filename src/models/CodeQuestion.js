





const mongoose = require('mongoose')


const CodeQuestionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  code: {type: String, required:true},
  solution: {type:String, required:true}
}, {
  versionKey: false
})


const CodeQuestion = mongoose.model("CodeQuestions", CodeQuestionSchema)

module.exports = CodeQuestion