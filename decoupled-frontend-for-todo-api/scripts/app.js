// this TodosApp will be mounted on the ancestor/parent element whose entire enclosed will be manipulated

const TodosApp = {
  data() {
    // data is a function that returns an object (standardized in vue)

    return {
      // this object is the data object, again return is standardized here
      todos: [],
      enteredTodoText: "", // this is the input field
      editedTodoId: null, // this is the id of the todo that is being edited
      isLoading: false, // this is the loading indicator will be used in created() lifecycle hook
    };
  },

  // methods is standarized property of vue
  methods: {
    async saveTodo(event) {
      event.preventDefault(); // prevents page reload on form submit

      if (this.editedTodoId) {
        // if currently the editedTodoId is not null that is some existing todo's text was placed in input
        // updating...
        const todoId = this.editedTodoId; // getting the id of the todo that is being edited
        const todoIndex = this.todos.findIndex(function (todoItem) {
          // returns the index of matched id element in the array
          return todoItem.id === todoId;
        });

        const updatedTodoItem = {
          // creating a new obj with updated data that will replace the existing value
          text: this.enteredTodoText, // due to double binding whatever new text is being written in input field will be available in this.enteredTodoText
          id: this.todos[todoIndex].id, // this is the id of the todo that is being edited
        };

        this.todos[todoIndex] = updatedTodoItem; // updating the todoItem in the array
        this.editedTodoId = null; // resetting the editedTodoId to null so that everything falls back to original

        // we update the DOM before we send the ajax req to backend for updating the todoItem in the database

        let response;

        try {
          response = await fetch("http://localhost:3000/todos/" + todoId, {
            method: "PATCH",
            body: JSON.stringify({
              newText: this.enteredTodoText,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          });
        } catch (error) {
          alert("Something went wrong!");
          return;
        }

        if (!response.ok) {
          alert("Something went wrong!");
          return;
        }
      } else {
        //creating
        let response;

        try {
          response = await fetch("http://localhost:3000/todos", {
            // ajax req
            method: "POST",
            body: JSON.stringify({
              text: this.enteredTodoText,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          });
        } catch (error) {
          alert("Something went wrong!");
          return;
        }

        if (!response.ok) {
          alert("Something went wrong!");
          return;
        }

        const responseData = await response.json();

        // this is the object that will be pushed to the array
        const newTodo = {
          text: this.enteredTodoText,
          id: responseData.createdTodo.id,
        };

        this.todos.push(newTodo);
      }

      this.enteredTodoText = ""; // resets the input field, bc by default it keeps the input value
    },

    startEditTodo(todoId) {
      this.editedTodoId = todoId;
      const matchedTodo = this.todos.find(function (todoItem) {
        // will return the todoItem that matches the id of the one whose edit btn was clicked
        return todoItem.id === todoId;
      });
      this.enteredTodoText = matchedTodo.text; // filling the input element field with matched todoItem text
    },

    async deleteTodo(todoId) {
      this.todos = this.todos.filter(function (todoItem) {
        // will create a new array with all the elements that return true for below condition, so only todo whose btn was clicked will be excluded
        return todoItem.id !== todoId;
      });
      let response;

      try {
        response = await fetch("http://localhost:3000/todos/" + todoId, {
          method: "DELETE",
        });
      } catch (error) {
        alert("Something went wrong!");
        return;
      }

      if (!response.ok) {
        alert("Something went wrong!");
        return;
      }
    },
  },

  // lifecycle hook, created() is a standardized method which will be invoked as soon as our website is up and running(before the component instance here TodosApp is mounted)
  // this is the place where we will fetch the data from the server and then set the data to the todos array
  // since created() doesnt wait for the promise to resolve so theres a very small time gap when the response is not presented we use isLoading
  async created() {
    let response;
    this.isLoading = true; // no response
    try {
      response = await fetch("http://localhost:3000/todos");
    } catch (error) {
      alert("Something went wrong!");
      this.isLoading = false; // we got some response
      return;
    }

    this.isLoading = false; // got response

    if (!response.ok) {
      alert("Something went wrong!");
      return;
    }

    const responseData = await response.json();
    this.todos = responseData.todos; // setting the data to the todos array
  },
};

// Vue is an obj accesble thru the CDN script, createApp is used to create an obj which then will be mounted on the id selector element in mount()
Vue.createApp(TodosApp).mount("#todos-app");

//   this.newTodo = this.enteredTodoText; // methods wires up "this.newTodo" prop here to the "entereTodoText" prop of above returned data obj

// find(), filter(), findIndex() are all js array inbuilt methods...
