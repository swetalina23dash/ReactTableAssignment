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
 


app.get('/api/employees', cors(corsOptions), (req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  let sql="Select * from Employee";
  let employeeJson=[];
  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    rows.forEach((row) => {
      employeeJson.push({"id":row.id,
                        "name": row.name,
                        "code": row.code,
                        "profession": row.profession,
                        "color": row.color,
                        "city": row.city,
                        "branch": row.branch,
                        "assigned": row.assigned
    });
      
    });
  });
 
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
  });
    res.status(200);
    res.send(JSON.stringify(employeeJson, null, 2));
})

app.post('/api/addEmployees', cors(corsOptions), (req, res, next) => {
   res.setHeader('Content-Type', 'application/json');
   db.serialize(() => { 
   db.run("CREATE TABLE if not exists Employee (id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT,code TEXT,profession TEXT,color TEXT,city TEXT,branch TEXT,assigned TEXT)")
     .run('INSERT INTO Employee (name, code, profession, color,city,branch,assigned) VALUES (?, ?, ?, ?,?,?,?)', [req.name,req.code,req.profession,req.color,req.city,req.branch,req.assigned], function(err) {
      if (err) {
        return console.log(err.message);
      }
      console.log(`A row has been inserted with rowid ${this.lastID}`);
    });
  });
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
  });
  res.status(200);
  res.send(JSON.stringify(employees, null, 2));
})

app.delete('/api/deleteEmployees', cors(corsOptions), (req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  
  let id = 1;
  // delete a row based on id
  db.run('DELETE FROM Employee WHERE rowid=?', id, function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log('Row(s) deleted ${this.changes}');
  });

  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
  });
  res.status(200);
  res.send(JSON.stringify(employees, null, 2));
})

app.put('/api/updateEmployees', cors(corsOptions), (req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  let data = ['Kyle Lowry1', 'Kyle Lowry'];
  let sql = `UPDATE Employee
              SET name = ?
              WHERE name = ?`;
   
  db.run(sql, data, function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`Row(s) updated: ${this.changes}`);
   
  });
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
  });
  res.status(200);
  res.send(JSON.stringify(employees, null, 2));
})


app.listen(8080, () => console.log('Job Dispatch API running on port 8080!'))