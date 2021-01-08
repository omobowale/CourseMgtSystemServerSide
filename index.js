var express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
var db = require("./database.js");

var app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Server port
var HTTP_PORT = 8080;

// Start server
app.listen(HTTP_PORT, () => {
  console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT));
});

// Root endpoint
app.get("/", (req, res, next) => {
  res.json({ message: "Ok" });
});

// list all books
app.get("/books", (req, res, next) => {
  let sql = `SELECT Name name FROM book ORDER BY name`;
  var params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: rows,
    });
  });
});

// list all students
app.get("/students", (req, res, next) => {
  let sql = `SELECT firstname firstname, lastname lastname, registration_number FROM student ORDER BY lastname`;
  var params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: rows,
    });
  });
});

// list all admins
app.get("/admin", (req, res, next) => {
  let sql = `SELECT * FROM admin`;
  var params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: rows,
    });
  });
});


// get a single student
app.post("/students/:reg", (req, res, next) => {
    var sql = "select * from student where registration_number = ?";
    var params = [req.params.reg];
    db.get(sql, params, (err, row) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }

      if(row === undefined){
        res.json({
            message: "Not found",
            regNo: req.params.reg
        });
      }

      else if(row.firstname === req.body.firstname && row.lastname === req.body.lastname && row.registration_number === req.body.registration_number){
        res.json({
            message: "found",
            data: row,
            regNo: req.params.reg + " : " + req.body.lastname + " : " + req.body.registration_number
        });
          
      }

      
    });
  });


// get an admin
app.post("/admin", (req, res, next) => {
    var sql = "select * from admin WHERE username=? and password=?";
    var params = [req.body.username, req.body.password];
    db.get(sql, params, (err, row) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }

      if(row === undefined){
        res.json({
            message: "Not found",
        });
      }

      else{
        res.json({
            message: "found",
            data: row,
            another: req.body.username
        });
          
      }

      
    });
  });

// list all departments
app.get("/departments", (req, res, next) => {
  let sql = `SELECT name name FROM department ORDER BY name`;
  var params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: rows,
    });
  });
});

// list all enrollments
app.get("/enrollment", (req, res, next) => {
  let sql = `SELECT * FROM enrollment`;
  var params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: rows,
    });
  });
});

// list all courses
app.get("/courses", (req, res, next) => {
  let sql = `SELECT id id, course_name name, course_code code, course_prerequisite prereq, course_department department FROM course`;
  var params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: rows,
    });
  });
});

// list all modules
app.get("/modules", (req, res, next) => {
  let sql = `SELECT id, module_name module_name, module_code module_code, course_name module_course_name, start_date module_start_date, end_date module_end_date, module_level_type module_level_type FROM module ORDER BY id`;
  var params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: rows,
    });
  });
});

// Get a single book by name
app.get("/books/:name", (req, res, next) => {
  var sql = "select * from book where name = ?";
  var params = [req.params.name];
  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: row,
    });
  });
});


//get all requests
app.get("/enroll-request", (req, res, next) => {
    let sql = `SELECT * FROM enrollRequest`;
    var params = [];
    db.all(sql, params, (err, rows) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        message: "success",
        data: rows,
      });
    });
  });
  

// Create a new enrollRequest
app.post("/enroll-request", (req, res, next) => {
    var errors = [];
    if (!req.body.course_code) {
      errors.push("Code for course not specified");
    }
    if (!req.body.registration_number) {
      errors.push("Registration number missing");
    }
    if (errors.length) {
      res.status(400).json({ error: errors.join(",") });
      return;
    }
  
    var data = {
      course_code: req.body.course_code,
      registration_number: req.body.registration_number,
      status: "pending",
    };

    var sql =
      "INSERT INTO enrollRequest(course_code, registration_number, status) VALUES(?, ?, ?)";
    var params = [
      data.course_code,
      data.registration_number,
      data.status
    ];
    db.run(sql, params, function (err, result) {
      if (err) {
        // res.status(400).json({"error": err.message})
        res.json({ error: err.message });
        return;
      }
      res.json({
        message: "success",
        data: data,
        id: this.lastID,
      });
    });
  });
  

//update an enrollment request
app.put("/enroll-request/:status", (req, res, next) => {
  var errors = [];
  if (!req.body.course_code) {
    errors.push("Code for course not specified");
  }
  if (!req.body.registration_number) {
    errors.push("Registration number not specified");
  }
  if (errors.length) {
    res.status(400).json({ error: errors.join(",") });
    return;
  }

  var data = {
    course_code: req.body.course_code,
    registration_number : req.body.registration_number,
  };

  var student_id = "";

  if(req.params.status == "approve"){
    status = "approved";
    student_id = data.registration_number + data.course_code;
  }
  else{
    status = "pending";
    student_id = "";
  }

  var sql = `UPDATE enrollRequest
            SET status = ?, student_id = ?
            WHERE registration_number = ? AND course_code = ?`;
  var params = [
    status,
    student_id,
    data.registration_number,
    data.course_code,
  ];

  db.run(sql, params, function (err, result) {
    if (err) {
      // res.status(400).json({"error": err.message})
      res.json({ error: err.message });
      return;
    }

    res.json({
      message: "success",
      data: data,
      id: this.lastID,
    });





  });
});


// Create a new course
app.post("/courses", (req, res, next) => {
  var errors = [];
  if (!req.body.course_name) {
    errors.push("Name for course not specified");
  }
  if (!req.body.course_code) {
    errors.push("Code for course not specified");
  }
  if (!req.body.course_prerequisite) {
    errors.push("Pre-requisite for course not specified");
  }
  if (!req.body.course_department) {
    errors.push("Department for course not specified");
  }
  if (errors.length) {
    res.status(400).json({ error: errors.join(",") });
    return;
  }

  var data = {
    course_name: req.body.course_name,
    course_code: req.body.course_code,
    course_prerequisite: req.body.course_prerequisite,
    course_department: req.body.course_department,
  };
  var sql =
    "INSERT INTO course(course_name, course_prerequisite, course_code, course_department) VALUES(?, ?, ?, ?)";
  var params = [
    data.course_name,
    data.course_prerequisite,
    data.course_code,
    data.course_department,
  ];
  db.run(sql, params, function (err, result) {
    if (err) {
      // res.status(400).json({"error": err.message})
      res.json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: data,
      id: this.lastID,
    });
  });
});


//update a course
app.put("/courses/:id", (req, res, next) => {
  var errors = [];
  if (!req.body.course_name) {
    errors.push("Name for course not specified");
  }
  if (!req.body.course_code) {
    errors.push("Code for course not specified");
  }
  if (!req.body.course_prerequisite) {
    errors.push("Pre-requisite for course not specified");
  }
  if (!req.body.course_department) {
    errors.push("Department for course not specified");
  }
  if (errors.length) {
    res.status(400).json({ error: errors.join(",") });
    return;
  }

  var data = {
    course_name: req.body.course_name,
    course_code: req.body.course_code,
    course_prerequisite: req.body.course_prerequisite,
    course_department: req.body.course_department,
  };
  var sql = `UPDATE course
            SET course_name = ?, course_prerequisite = ?, course_code = ?, course_department = ?
            WHERE id = ?`;
  var params = [
    data.course_name,
    data.course_prerequisite,
    data.course_code,
    data.course_department,
    req.params.id,
  ];
  db.run(sql, params, function (err, result) {
    if (err) {
      // res.status(400).json({"error": err.message})
      res.json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: data,
      check: req.params.id,
    });
  });
});

//Delete a course by id
app.delete("/courses/:id", (req, res, next) => {
  let sql = `SELECT course_name name FROM course WHERE id = ? LIMIT 1`;
  let course_name = "";
  var params = [req.params.id];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    course_name = rows[0].name;

    sql = "DELETE FROM course WHERE id=?";
    //var params =[req.params.id]

    db.run(sql, params, function (err, result) {
      if (err) {
        // res.status(400).json({"error": err.message})
        res.json({ error: err.message });
        return;
      }
      //delete all associated modules
      deleteModules(course_name, res);
    });

  });

});

// Create a new module
app.post("/modules", (req, res, next) => {
  var errors = [];
  if (!req.body.module_name) {
    errors.push("Name for module not specified");
  }
  if (!req.body.module_code) {
    errors.push("Code for module not specified");
  }
  if (!req.body.module_course_name) {
    errors.push("Course name for module not specified");
  }
  if (!req.body.module_level_type) {
    errors.push("Course name for module not specified");
  }
  if (!req.body.module_start_date) {
    errors.push("Start date for module not specified");
  }
  if (!req.body.module_end_date) {
    errors.push("End date for module not specified");
  }
  if (errors.length) {
    res.status(400).json({ error: errors.join(",") });
    return;
  }

  var data = {
    module_name: req.body.module_name,
    module_code: req.body.module_code,
    module_level_type: req.body.module_level_type,
    module_course_name: req.body.module_course_name,
    module_start_date: req.body.module_start_date,
    module_end_date: req.body.module_end_date,
  };

  var sql =
    "INSERT INTO module(module_name, module_code, start_date, end_date, course_name, module_level_type) VALUES(?, ?, ?, ?, ?, ?)";
  var params = [
    data.module_name,
    data.module_code,
    data.module_start_date,
    data.module_end_date,
    data.module_course_name,
    data.module_level_type,
  ];
  db.run(sql, params, function (err, result) {
    if (err) {
      // res.status(400).json({"error": err.message})
      res.json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: data,
      id: this.lastID,
    });
  });
});

// Update a module
app.put("/modules/:id", (req, res, next) => {
  var errors = [];
  if (!req.body.module_name) {
    errors.push("Name for module not specified");
  }
  if (!req.body.module_code) {
    errors.push("Code for module not specified");
  }
  if (!req.body.module_course_name) {
    errors.push("Course name for module not specified");
  }
  if (!req.body.module_level_type) {
    errors.push("Course name for module not specified");
  }
  if (!req.body.module_start_date) {
    errors.push("Start date for module not specified");
  }
  if (!req.body.module_end_date) {
    errors.push("End date for module not specified");
  }
  if (errors.length) {
    res.status(400).json({ error: errors.join(",") });
    return;
  }

  var data = {
    module_name: req.body.module_name,
    module_code: req.body.module_code,
    module_level_type: req.body.module_level_type,
    module_course_name: req.body.module_course_name,
    module_start_date: req.body.module_start_date,
    module_end_date: req.body.module_end_date,
  };

  var sql = `UPDATE module
            SET module_name = ?, module_code = ?, start_date = ?, end_date = ?, course_name = ?, module_level_type = ?
            WHERE id = ?`;
  var params = [
    data.module_name,
    data.module_code,
    data.module_start_date,
    data.module_end_date,
    data.module_course_name,
    data.module_level_type,
    req.params.id,
  ];
  db.run(sql, params, function (err, result) {
    if (err) {
      // res.status(400).json({"error": err.message})
      res.json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: data,
      check: req.params.id,
    });
  });
});

//Delete a module by id
app.delete("/modules/:id", (req, res, next) => {
  var sql = "DELETE FROM module WHERE id=?";
  var params = [req.params.id];

  db.run(sql, params, function (err, result) {
    if (err) {
      // res.status(400).json({"error": err.message})
      res.json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
    });
  });
});

//function to delete module when a course is deleted
function deleteModules(course_name, res) {

  var sql = "DELETE FROM module WHERE course_name=?";
  var params = [course_name];

  db.run(sql, params, function (err, result) {
    if (err) {
      // res.status(400).json({"error": err.message})
      res.json({ error: err.message });
      return;
    }
    res.json({
      message: "Associated modules have been deleted too"
    });
  });
}

// Create a new book
app.post("/book/", (req, res, next) => {
  var errors = [];
  if (!req.body.name) {
    errors.push("Name for book not specified");
  }
  if (errors.length) {
    res.status(400).json({ error: errors.join(",") });
    return;
  }

  var data = {
    name: req.body.name,
  };
  var sql = "INSERT INTO book (name) VALUES (?)";
  var params = [data.name];
  db.run(sql, params, function (err, result) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: data,
      id: this.lastID,
    });
  });
});

// Default response for any other request
app.use(function (req, res) {
  res.status(404);
});
