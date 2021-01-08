var sqlite3 = require('sqlite3').verbose()

var tables = ['book', 'student', 'module', 'department', 'course', 'admin', 'enrollRequest', 'enrollment'];

// open the database
let db = new sqlite3.Database('coursemgtsystem.db', (err) => {
    if (err) {
      console.error(err.message);
      throw err
    }
    console.log('Connected to the course management system database.');
  });

    var sql = '';

  //drop all tables (For debugging purposes)
  // tables.forEach(table => {
  //     sql = 'DROP TABLE ' + table + '';
  //     db.run(sql, (err) => {
  //       if(err)
  //           console.log('No such table ' + table);
  //       else {
  //           console.log("dropped " + table);
  //       }
        
  //     });
  // });


  // create table 'student'
  sql='CREATE TABLE student(firstname TEXT, lastname TEXT, registration_number TEXT, UNIQUE(registration_number))';
  db.run(sql, (err) => {
    if (err) {
        // Table already created
        console.log('Table student already created.' + err);
    }else{
      console.log('Table student created.');
      
      // First time Table created, insert some rows
      console.log('First time Table student created, creating some rows.');
      
      var insert = 'INSERT INTO student(firstname, lastname, registration_number) VALUES(?, ?, ?)';
      db.run(insert, ['Omobowale', 'Otuyiga', 'UWC1001']);
      db.run(insert, ['Olajumoke', 'Abimbola', 'UWC1002']);
    }
  });


  // create table 'admin'
  sql='CREATE TABLE admin(id INTEGER PRIMARY KEY, username TEXT, password TEXT, UNIQUE(username))';
  db.run(sql, (err) => {
    if (err) {
        // Table already created
        console.log('Table admin already created.');
    }else{
      console.log('Table admin created.');
      
      // First time Table created, insert some rows
      console.log('First time Table admin created, creating some rows.');
      
      var insert = 'INSERT INTO admin(username, password) VALUES(?, ?)';
      db.run(insert, ['Omobowale', '1234567']);
      db.run(insert, ['Olajumoke', '1234567']);
    }
  });


  // create table 'enrollRequest'
  sql='CREATE TABLE enrollRequest(id INTEGER PRIMARY KEY, registration_number TEXT, student_id TEXT NULL, course_code TEXT, status TEXT, UNIQUE(registration_number, course_code))';
  db.run(sql, (err) => {
    if (err) {
        // Table already created
        console.log('Table enrollRequest already created.');
    }else{
      console.log('Table enrollRequest created.');
      
      // First time Table created, insert some rows
      console.log('First time Table enrollRequest created, creating some rows.');
      
      var insert = 'INSERT INTO enrollRequest(registration_number, course_code, status, student_id) VALUES(?, ?, ?, ?)';
      db.run(insert, ['UWC1001', 'CP4004', 'pending', 'RQ10001']);
      db.run(insert, ['UWC1002', 'CB4004', "approved", 'RQ10002']);
    }
  });


  // create table 'enrollment'
  sql='CREATE TABLE enrollment(id INTEGER PRIMARY KEY, registration_number TEXT, student_id TEXT, course_code TEXT, UNIQUE(registration_number, course_code))';
  db.run(sql, (err) => {
    if (err) {
        // Table already created
        console.log('Table enrollment already created.' + err);
    }else{
      console.log('Table enrollment created.');
      
      // First time Table created, insert some rows
      console.log('First time Table enrollment created, creating some rows.');
      
      var insert = 'INSERT INTO enrollment(registration_number, course_code, student_id) VALUES(?, ?, ?)';
      db.run(insert, ['UWC1001', 'CP4005', 'RQ10001']);
    }
  });


  // create table 'department'
  sql='CREATE TABLE department(id INTEGER PRIMARY KEY, name TEXT)';
  db.run(sql, (err) => {
    if (err) {
        // Table already created
        console.log('Table department already created.');
    }else{
      console.log('Table department created.');
      
      // First time Table created, insert some rows
      console.log('First time Table deparment created, creating some rows.');
      
      var insert = 'INSERT INTO department(name) VALUES(?)';
      db.run(insert, ['Computer Engineering']);
      db.run(insert, ['Law']);
    }
  });


  // create table 'course'
  sql='CREATE TABLE course(id INTEGER PRIMARY KEY, course_name TEXT, course_prerequisite TEXT, course_code TEXT UNIQUE, course_department TEXT)';
  db.run(sql, (err) => {
    if (err) {
        // Table already created
        console.log('Table course already created.');
    }else{
      console.log('Table course created.');
      
      // First time Table created, insert some rows
      console.log('First time Table course created, creating some rows.');
      
      var insert = 'INSERT INTO course(course_name, course_prerequisite, course_code, course_department) VALUES(?, ?, ?, ?)';
      db.run(insert, ['IT', 'You must have passed a certain course', 'CP4004', 'Computer Engineering']);
      db.run(insert, ['Business', 'You must have A in a certain course', 'CB4004', 'Law']);
    }
  });


  // create table 'module'
  sql='CREATE TABLE module(id INTEGER PRIMARY KEY, module_name TEXT, module_code TEXT, start_date TEXT, end_date TEXT, course_name TEXT, module_level_type TEXT)';
  db.run(sql, (err) => {
    if (err) {
        // Table already created
        console.log('Table module already created.');
    }else{
      console.log('Table module created.');
      
      // First time Table created, insert some rows
      console.log('First time Table module created, creating some rows.');
      
      var insert = 'INSERT INTO module(module_name, module_code, start_date, end_date, course_name, module_level_type) VALUES(?, ?, ?, ?, ?, ?)';
      db.run(insert, ['Programming', 'CP4004AB', '2020-10-05', '2021-01-22', 'IT', 'Undergraduate']);
      db.run(insert, ['Administration', 'CB4004AB', '2020-10-06', '2021-01-10', 'Business', 'Postgraduate']);
      db.run(insert, ['Business Strategies', 'CB4004AB', '2020-10-06', '2021-01-10', 'Business', 'Undergraduate']);
    }
  });


// export as module, called db
module.exports = db

