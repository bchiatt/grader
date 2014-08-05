'use strict';

var _ = require('lodash');
var Mongo = require('mongodb');

function Student(o){
  this.name         = o.name;
  this.color        = o.color;

  this.gpa          = 0;
  this.isSuspended  = false;
  this.isHonorRoll  = false;
  this.tests        = [];
  this.failed       = 0;
}

Object.defineProperty(Student, 'collection', {
  get: function(){
    return global.mongodb.collection('students');
  }
});

Student.prototype.addTest = function(grade){
  var color, gpa, letter;
  var test = parseFloat(grade);
  var id = Mongo.ObjectID(this._id);

  if(test >= 90){
    color = 'green';
    gpa   = 4;
    letter= 'A';
  }
  else if(test <= 89 && test >= 80){
    color = 'blue';
    gpa   = 3;
    letter= 'B';
  }
  else if(test <= 79 && test >= 70){
    color = 'orange';
    gpa   = 2;
    letter= 'C';
  }
  else if(test <= 69 && test >= 60){
    color = 'red';
    gpa   = 1;
    letter= 'D';
  }
  else {
    color = 'white';
    gpa   = 0;
    letter= 'F';
    this.failTest();
  }
  this.tests.push({grade: test, color: color, gpa: gpa, letter: letter});

  Student.collection.update({_id:id.toString()},{$set:{tests:this.tests}});
};


//Will needed to update the database in the same call
//db.collection.update()
Student.prototype.failTest = function(){
  this.failed++;
  var id = Mongo.ObjectID(this._id);
  if(this.failed >= 3){
    this.isSuspended = true;
    Student.collection.update({_id:id.toString()},{$set:{isSuspended:true}});
  }
  

};

Student.prototype.calcAvg = function(){
  var sum = 0;
  for(var i = 0; i < this.tests.length; i++){
    sum += this.tests[i].grade;
  }
  return Math.round(sum / this.tests.length);
};



Student.prototype.save = function(cb){
  Student.collection.save(this, cb);
};


Student.all = function(cb){
  Student.collection.find({}).toArray(function(err, object){
    var students = object.map(function(o){
      return changeProto(o);
    });

    cb(students);
  });
};

Student.findByID = function(query, cb){
  query = Mongo.ObjectID(query);
  Student.collection.findOne({_id: query}, function(err, object){
    var student = changeProto(object);
    cb(student);
  });
};


Student.deleteByID = function(query, cb){
  query = Mongo.ObjectID(query);
  Student.collection.remove({_id: query}, function(){
    cb();
  });
};






// HELPER FUNCTIONS
function changeProto(obj){
  var student = _.create(Student.prototype, obj);

  return student;
}



module.exports = Student;
