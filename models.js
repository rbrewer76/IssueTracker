const mongoose = require("mongoose")

const issueSchema = new mongoose.Schema({
  project: {
    required: true,
    type: String, 
    trim: true  
  },
  title: {
    required: true,
    type: String, 
    trim: true,
    min: 1,
    max: 100
  },
  text: {
    required: true,
    type: String, 
    trim: true,
    min: 1,
    max:500
  },
  assignTo: {
    type: String, 
    trim: true,
    min: 1,
    max: 50    
  },
  status: {
    type: String, 
    trim: true,
    min: 1,
    max: 500    
  },
  open: {
    type: Boolean,
    default: true
  },
  createdBy: {
    required: true,
    type: String, 
    trim: true,
    min: 1,
    max: 50    
  },
  createdOn: {
    type: Date    
  },
  updatedOn: {
    type: Date
  }
})

const projectSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String, 
    trim: true     
  }
})

const Issue = mongoose.model("issue", issueSchema)
const Project = mongoose.model("project", projectSchema)

module.exports = {Issue, Project}