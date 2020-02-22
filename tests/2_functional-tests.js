/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

const chaiHttp = require("chai-http")
const chai = require("chai")
const assert = chai.assert
const server = require("../server")

chai.use(chaiHttp)

suite("Functional Tests", () => {
  // Need to track the _id for later test (update, delete)
  let _id = ""
  
    suite("POST /api/issues/{project} => object with issue data", () => {
      
      test("Every field filled in", done => {
        chai.request(server)
        .post("/api/issues/test")
        .send({
          issue_title: "Title",
          issue_text: "text",
          created_by: "Functional Test - Every field filled in",
          assigned_to: "Chai and Mocha",
          status_text: "In QA"
        })
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.equal(res.body.project, "test")
          assert.equal(res.body.title, "Title")
          assert.equal(res.body.text, "text")
          assert.equal(res.body.createdBy, "Functional Test - Every field filled in")
          assert.equal(res.body.assignTo, "Chai and Mocha")
          assert.equal(res.body.status, "In QA")
          _id = res.body._id
          done()
        })
      })

      test("Required fields filled in", done => {
        chai.request(server)
          .post("/api/issues/test")
          .send({
          issue_title: "Title",
          issue_text: "text",
          created_by: "Functional Test - Every field filled in"
        })
        .end((err, res) => {
          assert.equal(res.body.title, "Title")
          assert.equal(res.body.text, "text")
          assert.equal(res.body.createdBy, "Functional Test - Every field filled in")
          done()          
        })    
      })
      
      test("Missing required fields", done => {

       chai.request(server)
        .post("/api/issues/test")
        .send({
          issue_title: "Title",
          issue_text: "",
          created_by: ""
        })
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.equal(res.body, "Missing required fields")
          done()
        })     
      })
    })
    
  
    suite("PUT /api/issues/{project} => text", () => {
      
      test("No body", done => {
        chai.request(server)
         .put("/api/issues/test")
         .send({})
         .end((err, res) => {
           assert.equal(res.body, "no updated field sent")
           done()
         })    
      })
      
      test("One field to update", done => {
        chai.request(server)
         .put("/api/issues/test")
         .send({
           _id: _id,
           issue_title: "Title"          
         })
         .end((err, res) => {
           assert.equal(res.body, "successfully updated")
           done()
         })            
      })
      
      test("Multiple fields to update", done => {
        chai.request(server)
         .put("/api/issues/test")
         .send({
           _id: _id,
           issue_title: "Title",
           issue_text: "text",
           created_by: "Functional Test - Every field filled in",
           assigned_to: "Chai and Mocha"
         })
         .end((err, res) => {
           assert.equal(res.body, "successfully updated")
           done()
         })           
      })
      
    })
  
    
    suite("GET /api/issues/{project} => Array of objects with issue data", () => {
      
      test("No filter", done => {
        chai.request(server)
        .get("/api/issues/test")
        .query({})
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.isArray(res.body)
          assert.property(res.body[0], "title")
          assert.property(res.body[0], "text")
          assert.property(res.body[0], "createdOn")
          assert.property(res.body[0], "updatedOn")
          assert.property(res.body[0], "createdBy")
          assert.property(res.body[0], "assignTo")
          assert.property(res.body[0], "open")
          assert.property(res.body[0], "status")
          assert.property(res.body[0], "_id")
          done()
        })
      })
      
      test("One filter", done => {
        chai.request(server)
        .get("/api/issues/test")
        .query({
          assignTo: "Chai and Mocha"          
        })
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.isArray(res.body)
          assert.property(res.body[0], "title")
          assert.property(res.body[0], "text")
          assert.property(res.body[0], "createdOn")
          assert.property(res.body[0], "updatedOn")
          assert.property(res.body[0], "createdBy")
          assert.property(res.body[0], "assignTo")
          assert.property(res.body[0], "open")
          assert.property(res.body[0], "status")
          assert.property(res.body[0], "_id")
          done()
        })        
      })
      
      test("Multiple filters (test for multiple fields you know will be in the db for a return)", done => {
        chai.request(server)
        .get("/api/issues/test")
        .query({
          title: "Title",
          text: "text",          
          assignTo: "Chai and Mocha"          
        })
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.isArray(res.body)
          assert.property(res.body[0], "title")
          assert.property(res.body[0], "text")
          assert.property(res.body[0], "createdOn")
          assert.property(res.body[0], "updatedOn")
          assert.property(res.body[0], "createdBy")
          assert.property(res.body[0], "assignTo")
          assert.property(res.body[0], "open")
          assert.property(res.body[0], "status")
          assert.property(res.body[0], "_id")
          done()
        })              
      })
    })
    
  
    suite("DELETE /api/issues/{project} => text", () => {
      
      test("No _id", done => {
        chai.request(server)
        .delete("/api/issues/test")
        .send({})
        .end((err, res) => {
          assert.equal(res.body, "_id error")
          done()
        })
      })
      
      test("Valid _id", done => {
        chai.request(server)
        .delete("/api/issues/test")
        .send({_id: _id})
        .end((err, res) => {
          assert.equal(res.body, `deleted ${_id}`)
          done()
        })
      })
    })
})
