const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const compression = require('compression');

const taskRoutes = require('./routes/task');
const authRoutes = require('./routes/auth');

const app = express();
 
app.use(bodyParser.urlencoded()); 
app.use(bodyParser.json()); 
app.use(compression());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/task', taskRoutes);
app.use('/auth', authRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

const PORT = process.env.PORT || 8080;
mongoose
  .connect(
    'mongodb+srv://NehaSingh:mongodb@cluster0.eicjg.mongodb.net/task?retryWrites=true'
  )
  .then(result => {
    app.listen(PORT);
  })
  .catch(err => console.log(err));
