var express = require('express');
var router = express.Router();
var mysql = require('mysql');

//Connect to mysql
var connection = mysql.createConnection({
  host    : 'localhost',
  user    : 'root',
  password: '',
  database: 'portfolio'
});

connection.connect();

/* GET home page Backend */
router.get('/', function(req, res) {
  connection.query('SELECT * FROM projects', function(err, rows, fields) {
    if(err) throw err;
    res.render('dashboard', {
      'rows': rows,
      layout : 'layout2'
    });
  });
});

// Add New Project
router.get('/new', function(req, res, next) {
  res.render('new');
});

router.post('/new', function(req, res, next) {
  // Get Fields
  var title = req.body.title;
  var description = req.body.description;
  var service = req.body.service;
  var client = req.body.client;
  var projectdate = req.body.projectdate;

  // Check Image Field
  if(req.file && req.file.projectimage) {
    var projectImageName = req.file.projectimage.name;
  } else {
    var projectImageName = 'noimage.jpg';
  }

  //Check for Validation
  req.checkBody('title', "Title Field is required").notEmpty();
  req.checkBody('service', "Service Field is required").notEmpty();

  //Check for Error
  var errors = req.validationErrors();

  if(errors) {
    res.render('new', {
      errors : errors,
      title : title,
      description : description,
      service :service,
      client : client
    });
  } else {
      var project = {
      title : title,
      description : description,
      service :service,
      client : client,
      date: projectdate,
      image : projectImageName
      }
  };

  var query = connection.query('INSERT INTO projects SET ?', project, function(err, result) {
    //Inserted into Database
  });
  req.flash('success', "Project Added");
  res.location('/admin');
  res.redirect('/admin');
});

module.exports = router;