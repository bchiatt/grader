/* global describe, it, before, beforeEach */
/* jshint expr:true*/

'use strict';

var expect = require('chai').expect;
var Student   = require('../../app/models/student');
var connection = require('../../app/lib/mongodb');
var Mongo  = require('mongodb');

var bill;

describe('Student', function() {
  before(function(done){
    connection('students', function(){
      done();
    });
  });

  beforeEach(function(done){
    Student.collection.remove(function(){
      bill = new Student({name:'Bill Walton', color:'pink'});
      bill.save(function(){
      done();
     });
    });
  });

  describe('constructor', function() {
    it('should create a new instance of Student', function(){
      expect(bill).to.be.instanceof(Student);
      expect(bill.name).to.equal('Bill Walton');
      expect(bill.color).to.equal('pink');
      expect(bill.isSuspended).to.be.false;
      expect(bill.isHonorRoll).to.be.false;
      expect(bill.failed).to.equal(0);
      expect(bill.tests).to.have.length(0);
    });
  });
 describe('#addTest', function() {
    it('should push a new test object A into the tests array', function(){
      bill.addTest('98.2');
      bill.addTest('82.9');
      bill.addTest('76.1');
      bill.addTest('63.7');
      bill.addTest('41.0');

      expect(bill.tests).to.have.length(5);
      expect(bill.tests[0].color).to.equal('green');
      expect(bill.tests[0].grade).to.equal(98.2);
      expect(bill.tests[0].letter).to.equal('A');
      expect(bill.tests[1].color).to.equal('blue');
      expect(bill.tests[1].grade).to.equal(82.9);
      expect(bill.tests[1].letter).to.equal('B');
      expect(bill.tests[2].color).to.equal('orange');
      expect(bill.tests[2].grade).to.equal(76.1);
      expect(bill.tests[2].letter).to.equal('C');
      expect(bill.tests[3].color).to.equal('red');
      expect(bill.tests[3].grade).to.equal(63.7);
      expect(bill.tests[3].letter).to.equal('D');
      expect(bill.tests[4].color).to.equal('white');
      expect(bill.tests[4].grade).to.equal(41.0);
      expect(bill.tests[4].letter).to.equal('F');
    });
    it('should suspend a student if three failed tests', function(){
      bill.failed = 2;
      bill.addTest('41.0');

      expect(bill.failed).to.have.equal(3);
      expect(bill.isSuspended).to.be.true;
    });
  });
 describe('#calcAvg', function() {
    it('should calculate the student\'s test score average', function(){
      bill.addTest('98.2');
      bill.addTest('82.9');
      bill.addTest('76.1');
      bill.addTest('63.7');

      var grade = bill.calcAvg();

      expect(grade).to.be.closeTo(80, 1);
    });
  });
  describe('#save', function() {
    it('should save a student to the students collection', function(done){
      bill.save(function(){
        expect(bill._id).to.be.instanceof(Mongo.ObjectID);
        done();
      });
    });
  });
  describe('.all', function(){
    it('should display all students in the database', function(done) {
      Student.all(function(student){
        expect(student).to.have.length(1);
        expect(student[0].name).to.equal('Bill Walton');
        done();
      });
    });
  });
  describe('.findByID', function(){
    it('should find a specific student by his/her ID', function(done){
      var id = bill._id;

      Student.findByID(id, function(student){
        expect(student.name).to.equal('Bill Walton');
        done();
      });
    });
  });
  describe('.deleteByID', function(){
    it('should delete a specific student by his/her id', function(done){
      var id = bill._id;

      Student.deleteByID(id, function(){
        Student.all(function(students){
          expect(students).to.have.length(0);
          done();
        });
      });
    });
  });
});
