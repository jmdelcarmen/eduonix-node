'use strict';

const cassandra = require('cassandra-driver');
const client = new cassandra.Client({contactPoints: ['127.0.0.1']});
client.connect(function (err, result) {
  console.log('Cassandra is connected');
});



exports.displayIndex = (req, res) => {
  res.render('index');
}

exports.displayDoctors = (req, res) => {
  if (req.query.state) {
    let query = "SELECT * FROM findadoc.doctors WHERE state = ?";
    client.execute(query, [req.query.state], function (err, data) {
      if (err) {
        res.status(404).send({msg: err})
      }
      else {
        // console.log(data.rows);
        res.render('doctors', {doctors: data.rows});
      }
    });
  } else {
    let query = "SELECT * FROM findadoc.doctors";
    client.execute(query, [], function (err, data) {
      if (err) {
        res.status(404).send({msg: err})
      }
      else {
        // console.log(data.rows);
        res.render('doctors', {doctors: data.rows});
      }
    });
  }
}

exports.displayDoctorDetails = (req, res) => {
  let query = "SELECT * FROM findadoc.doctors WHERE doc_id = ?";
  client.execute(query, [req.params.id], function (err, data) {
    if (err) {
      res.status(404).send({msg: err})
    }
    else {
      // console.log(data.rows[0]);
      res.render('details', {doctor: data.rows[0]});
    }
  });
}


exports.displayDoctorsByCategory = (req, res) => {
  let query = "SELECT * FROM findadoc.doctors WHERE category = ?";
  client.execute(query, [req.params.name], (err, data) => {
    if (err) {
      res.status(404).send({msg: err});
    } else {
      res.render('doctors', {doctors: data.rows});
    }
  });
}

exports.displayAddDoctors = (req, res) => {
  res.render('add-doctors');
}

exports.addDoctor = (req, res) => {
  let doc_id = cassandra.types.uuid();
  let query = "INSERT INTO findadoc.doctors(doc_id, full_name, category, new_patients, graduation_year, practice_name, street_address, city, state)VALUES(?,?,?,?,?,?,?,?,?)";
    client.execute(query,
       [doc_id,
       req.body.full_name,
       req.body.category,
       req.body.new_patients,
       req.body.graduation_year,
       req.body.practice_name,
       req.body.street_address,
       req.body.city,
       req.body.state,
     ], {prepare: true}, (err, data) => {
         if (err) {
           res.status(404).send({msg: err})
         } else {
          //  req.flash('success', 'Doctor Added');
           res.redirect('/doctors');
         }
       }
     );
}
