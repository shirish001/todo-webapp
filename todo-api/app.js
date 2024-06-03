const express = require('express');

const db = require('./data/database');
const todosRoutes = require('./routes/todos.routes');
const enableCors = require('./middlewares/cors');

const app = express();

app.use(enableCors); // middleware for enabling cors
app.use(express.json()); // middleware for parsing json data in incoming req and coverting it into js obj and attach it to req.body

app.use('/todos', todosRoutes);

app.use(function (error, req, res, next) {
  res.status(500).json({
    message: 'Something went wrong!',
  });
});

db.initDb()
  .then(function () {
    app.listen(3000);
  })
  .catch(function (error) {
    console.log('Connecting to the database failed!');
  });
