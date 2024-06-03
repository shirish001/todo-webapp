const Todo = require('../models/todo.model');

async function getAllTodos(req, res, next) {
  let todos;
  try {
    todos = await Todo.getAllTodos(); // returns array of js objects
  } catch (error) {
    return next(error);
  }

  res.json({
    todos: todos, // array of js objects
  });
}

async function addTodo(req, res, next) {
  const todoText = req.body.text;

  const todo = new Todo(todoText); // creating a new todo object

  let insertedId; // id of the inserted document will be assigned to this variable
  try {
    const result = await todo.save();
    insertedId = result.insertedId; // result.insertedId is a mongoDb id assigned to the above initialized variable
  } catch (error) {
    return next(error);
  }

  todo.id = insertedId.toString(); // converting the mongoDb id into string and storing it in an additional "id" property assigned to todo obj after it was saved as document

  res.json({ message: 'Added todo successfully!', createdTodo: todo }); // returning the created todo object which now also has id property to it
}

async function updateTodo(req, res, next) {
  const todoId = req.params.id;
  const newTodoText = req.body.newText; // new text of the todo

  const todo = new Todo(newTodoText, todoId);

  try {
    await todo.save();
  } catch (error) {
    return next(error);
  }

  res.json({ message: 'Todo updated', updatedTodo: todo });
}

async function deleteTodo(req, res, next) {
  const todoId = req.params.id;

  const todo = new Todo(null, todoId); // null is the text of the todo

  try {
    await todo.delete();
  } catch (error) {
    return next(error);
  }

  res.json({ message: 'Todo deleted' });
}

module.exports = {
  getAllTodos: getAllTodos,
  addTodo: addTodo,
  updateTodo: updateTodo,
  deleteTodo: deleteTodo,
};
