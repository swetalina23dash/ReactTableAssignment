const express = require('express')
const cors = require('cors')
const app = express()
const employees = require('./data/employees.json');

var sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('employee.db');

var corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200
}

var bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
 
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.get('/api/employees', cors(corsOptions), (req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  let sql="Select * from Employee";
  let params=[];
 
db.serialize(() => {
db.all(sql, params, (err, rows) => {
  if (err) {
    res.status(400).json({"error":err.message});
    return;
  }
  res.status(200);
  res.json({
      "message":"success",
      "data":rows
  });
});
}); 
})

app.post('/api/addEmployees',  (req, res, next) => {
   res.setHeader('Content-Type', 'application/json');
  
   db.serialize(() => { 
   db.run("CREATE TABLE if not exists Employee (id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT,code TEXT,profession TEXT,color TEXT,city TEXT,branch TEXT,assigned TEXT)")
     .run('INSERT INTO Employee (name, code, profession, color,city,branch,assigned) VALUES (?, ?, ?, ?,?,?,?)', [req.body.name,req.body.code,req.body.profession,req.body.color,req.body.city,req.body.branch,req.body.assigned], function(err) {
      if (err) {
        res.status(400).json({"error":err.message});
        return;
      }
      console.log(`A row has been inserted with rowid ${this.lastID}`);
      res.status(200);
      res.json({
          "message":"success",
          "id":`${this.lastID}`
      });
    });
  });
  
  
})

app.get('/api/deleteEmployees/:id', cors(corsOptions), (req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  
  let id = req.params.id;
  // delete a row based on id
  db.serialize(() => { 
  db.run('DELETE FROM Employee WHERE rowid=?', id, function(err) {
    if (err) {
      res.status(400).json({"error":err.message});
      return;
    }
    res.status(200);
    res.json({
        "message":"success"
    });
    console.log(`Row(s) deleted ${this.changes}`);
  });
});
})

app.post('/api/updateEmployees', (req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  let data = [req.body.name, req.body.code, req.body.profession, req.body.color,req.body.city,req.body.branch,req.body.assigned,req.body.id];
  let sql = `UPDATE Employee
              SET name = ?,code= ?, profession= ?, color= ?,city= ?,branch= ?,assigned= ?
              WHERE id = ?`;
  db.serialize(() => {  
  db.run(sql, data, function(err) {
    if (err) {
      res.status(400).json({"error":err.message});
      return;
    }
    console.log(`Row(s) updated: ${this.changes}`);
    res.status(200);
    res.json({
        "message":"success"
    });
  });
});
})


app.listen(8080, () => console.log('Job Dispatch API running on port 8080!'))