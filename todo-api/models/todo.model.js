const mongodb = require('mongodb');

const db = require('../data/database');

class Todo {
  constructor(text, id) {
    this.text = text; // this "text" key of Todo js obj will store the parameter passed text
    this.id = id;
  }

  static async getAllTodos() {
    const todoDocuments = await db.getDb().collection('todos').find().toArray(); // all mongo documents inserted as array objs

    return todoDocuments.map(function (todoDocument) { // called map() on each document(element) of the todoDocuments array
      return new Todo(todoDocument.text, todoDocument._id); // the new array will have elements in js object format and not mongo document format 
    });
  }

  save() {
    if (this.id) { // if this.id is undefined
      const todoId = new mongodb.ObjectId(this.id); // this.id is converted into mongoDb id format
      return db
        .getDb()
        .collection('todos')
        .updateOne(
          { _id: todoId }, // the document to be updated
          {
            $set: { text: this.text }, // setting the document key as "text" and it will hold "this.text" value
          }
        );
    } else {
      return db.getDb().collection('todos').insertOne({ text: this.text });
    }
  }

  delete() {
    if (!this.id) {
      throw new Error('Trying to delete todo without id!');
    }
    const todoId = new mongodb.ObjectId(this.id);

    return db.getDb().collection('todos').deleteOne({ _id: todoId });
  }
}

module.exports = Todo;
