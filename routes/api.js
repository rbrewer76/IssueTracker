/*
*
*
*       Complete the API routing below
*
*
*/

"use strict"

const expect = require("chai").expect
const MongoClient = require("mongodb")

const {Issue, Project} = require("../models")

module.exports = app => {

  app.route("/api/project/")
    .post((req, res) => {
      const project = req.body.project
      console.log("posting a new Project: " + project)              

      Project.findOne({name: project}).then(data => {
        if (data === null) {
          const newProject = new Project({name: project})
          newProject.save().then(data => res.json(data)).catch((err) => res.json({error: err}))
        }
      })
    })
  
  
  app.route("/api/projects/")
    // get all projects
    .get((req, res) => {
      Project.find({}).then(data => res.json(data))
    })
    
  
  app.route("/api/issues/")
    // get all issues
    .get((req, res) => {
      Issue.find({}).then(data => res.json(data))
    })
  

  app.route("/api/issues/:project")
  
    .get((req, res) => {
      const project = req.params.project
      let param = req.query      
      param.project = project

      Issue.find(param).then(data => res.json(data))
    })
  
  
    .post((req, res) => {
      const project = req.params.project
      const {issue_title, issue_text, created_by, assigned_to, status_text} = req.body

      if (issue_title === "" || issue_text === "" || created_by === "")
        return res.json("Missing required fields")
        
      Project.findOne({name: project}).then(data => {
        if (data === null) {
          const newProject = new Project({name: project})

          newProject.save().then(data => res.json(data)).catch((err) => res.json({error: err}))
        }

        const newIssue = new Issue({
          project: project,
          title: issue_title, 
          text: issue_text, 
          createdBy: created_by, 
          assignTo: assigned_to, 
          status: status_text,
          open: true,
          createdOn: new Date(),
          updatedOn: new Date()
        })
        newIssue.save().then(data => res.json(data)).catch((err) => res.json({error: err}))
      }).catch(err => res.json({error: err}))
    })
    
  
    .put((req, res) => {
      const project = req.params.project
      const {_id, issue_title, issue_text, created_by, assigned_to, status_text, open} = req.body      

      const update = {
        title: issue_title, 
        text: issue_text, 
        createdBy: created_by, 
        assignTo: assigned_to, 
        status: status_text,
        open: open
      }
  
      if (Object.keys(update).length === 0 || _id === undefined) 
        return res.json("no updated field sent")
    
      update.updatedOn = new Date()
    
      const updateReduced = Object.keys(update).reduce((newKey, key) => {
        if (update[key] !== "" && key !== "_id")       
          newKey[key] = update[key]
        return newKey
      }, {})

      Issue.findByIdAndUpdate(_id, updateReduced).then(data => res.json("successfully updated"))
        .catch((err) => res.json(`could not update ${_id}`))
    })
    
  
    .delete((req, res) => {
      const project = req.params.project
      const _id = req.body._id

      if (_id) {
        Issue.findByIdAndDelete(_id)
        .then(data => res.json(`deleted ${_id}`))
        .catch((err) => res.json(`could not delete ${_id}`))
      } 
      else 
        return res.json("_id error")
    })
    
}
