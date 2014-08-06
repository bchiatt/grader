'use strict';

var Student = require('../models/student');

exports.initstudent = function(req, res){
    res.render('students/initstudent');
};

exports.index = function(req, res){
    res.render('students/');
};

exports.create = function(req, res){
    res.redirect('/students');
};

exports.inittest = function(req, res){
    res.render('students/inittest');
};

exports.addtest = function(req, res){
    res.redirect('/students/show');
};

exports.show = function(req, res){
    res.render('students/show');
};
