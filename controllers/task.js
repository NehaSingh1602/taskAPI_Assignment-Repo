const fs = require('fs');
const path = require('path');

const { validationResult } = require('express-validator/check');

const Task = require('../models/task');

exports.getTask = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 20;
  let totalItems;
  Task.find()
    .countDocuments()
    .then(count => {
      totalItems = count;
      return Task.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then(tasks => {
      res
        .status(200)
        .json({
          message: 'Fetched tasks successfully.',
          tasks: tasks,
          totalItems: totalItems
        });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.createTask = (req, res, next) => {
  //console.log("enter task");
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   const error = new Error('Validation failed, entered data is incorrect.');
  //   error.statusCode = 422;
  //   throw error;
  // }
  
  console.log(req.body);
  const taskTitle = req.body.taskTitle;
  console.log(taskTitle);
  const date = req.body.date;
  console.log(date);
  const status = req.body.status;
  console.log(status);

  const array = json2array(req.body);
  const validArray = ["taskTitle","date","status"];

  validArray.forEach(function(key){
    var myIndex = array.indexOf(key);
    if (myIndex !== -1) {
      array.splice(myIndex, 1);
    }
  });
  console.log(array);
  if(array.length > 0)
  {
        const error = new Error('Invalid JSON schema');
        error.statusCode = 401;
        throw error;
  }
  
  //console.log(array);

    if(status != "Completed" && status != "Incomplete")
      {
        const error = new Error('Status should be Completed or Incomplete');
        error.statusCode = 401;
        throw error;
      }
  const tasks = new Task({
    taskTitle: taskTitle,
    date: date,
    status: status,
  });
  console.log(tasks);
  tasks
    .save()
    .then(result => {
      res.status(201).json({
        message: 'Task created successfully!',
        post: result
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

function json2array(json){
  var result = [];
  var keys = Object.keys(json);
  keys.forEach(function(key){
      result.push(key);
  });
  return result;
}

exports.getTasks = (req, res, next) => {
  const taskId = req.params.taskId;
  Task.findById(taskId)
    .then(tasks => {
      if (!tasks) {
        const error = new Error('Could not find task.');
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: 'Task fetched.', post: tasks });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updateTask = (req, res, next) => {
  const taskId = req.params.taskId;
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   const error = new Error('Validation failed, entered data is incorrect.');
  //   error.statusCode = 422;
  //   throw error;
  // }
  let task = null;
  let date= null;
  let status= null;
  if(req.body.taskTitle)
     task = req.body.taskTitle;
  if(req.body.date)
     date = req.body.date;
  if(req.body.status){
     status = req.body.status;

   console.log(status);
     if(status != "Completed" && status != "Incomplete")
     {
       const error = new Error('Status should be Completed or Incomplete');
       error.statusCode = 401;
       throw error;
     }
    }

  Task.findById(taskId)
    .then(tasks => {
      if (!tasks) {
        const error = new Error('Could not find task.');
        error.statusCode = 404;
        throw error;
      }
      if(task)
        tasks.taskTitle = task;
      if(date)
        tasks.date = date;
      if(status)
        tasks.status = status;
      
      return tasks.save();
    })
    .then(result => {
      res.status(200).json({ message: 'Task updated!', post: result });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
    
    const array = json2array(req.body);
    const validArray = ["taskTitle","date","status"];
  
    validArray.forEach(function(key){
      var myIndex = array.indexOf(key);
      if (myIndex !== -1) {
        array.splice(myIndex, 1);
      }
    });
    console.log(array);
    if(array.length > 0)
    {
          const error = new Error('Invalid JSON schema');
          error.statusCode = 401;
          throw error;
    }  
};

exports.deleteTask = (req, res, next) => {
  const taskId = req.params.taskId;
  Task.findById(taskId)
    .then(tasks => {
      if (!tasks) {
        const error = new Error('Could not find Task.');
        error.statusCode = 404;
        throw error;
      }
      return Task.findByIdAndRemove(taskId);
    })
    .then(result => {
      console.log(result);
      res.status(200).json({ message: 'Task Deleted' });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
