const express = require('express');
const { body } = require('express-validator/check');

const taskController = require('../controllers/task');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// GET /task/get
router.get('/get', isAuth,taskController.getTask);


// POST /task/post
router.post('/post',isAuth,
  [
    body('taskTitle')
      .trim(),
    body('date')
      .trim(),
    body('status')
    .trim()
  ],
  taskController.createTask
);

// GET /task/get/taskID
router.get('/get/:taskId',isAuth, taskController.getTasks);


// PATCH /task/patch/taskID
router.patch(
  '/patch/:taskId',
  isAuth,
  [
    body('taskTitle')
      .trim()
      .isLength({ min: 5 }),
    body('date')
      .trim(),
    body('status')
    .trim()
  ],
  taskController.updateTask
);

router.delete('/delete/:taskId', isAuth,taskController.deleteTask);



module.exports = router;
