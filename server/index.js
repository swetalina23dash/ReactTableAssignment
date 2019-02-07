const express = require('express')
const cors = require('cors')
const app = express()
const employees = require('./data/employees.json');

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');

var corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200
}

var bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
 


app.get('/api/employees', cors(corsOptions), (req, res, next) => {
  console.log('/api/employees');
  res.setHeader('Content-Type', 'application/json');
  
 
  db.serialize(function() {
    db.run("CREATE TABLE if not exist mytable (info TEXT)");
   
    var stmt = db.prepare("INSERT INTO mytable VALUES (?)");
    for (var i = 0; i < 10; i++) {
        stmt.run("Ipsum " + i);
    }
    stmt.finalize();
   
    db.each("SELECT rowid AS id, info FROM mytable", function(err, row) {
        console.log(row.id + ": " + row.info);
    });
  });
   
  
  res.status(200);
  res.send(JSON.stringify(employees, null, 2));
})

app.get('/api/addEmployees', cors(corsOptions), (req, res, next) => {
  console.log('/api/addEmployees');
  res.setHeader('Content-Type', 'application/json');
  res.status(200);
  res.send(JSON.stringify(employees, null, 2));
})

app.get('/api/deleteEmployees', cors(corsOptions), (req, res, next) => {
  console.log('/api/deleteEmployees');
  res.setHeader('Content-Type', 'application/json');
  res.status(200);
  res.send(JSON.stringify(employees, null, 2));
})

app.get('/api/updateEmployees', cors(corsOptions), (req, res, next) => {
  console.log('/api/updateEmployees');
  res.setHeader('Content-Type', 'application/json');
  res.status(200);
  res.send(JSON.stringify(employees, null, 2));
})

app.listen(8080, () => console.log('Job Dispatch API running on port 8080!'))