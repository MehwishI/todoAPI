
const express = require('express');
const morgan = require('morgan');
const {uid} = require('uid');

const PORT = 8080;
//{"task": "Buy groceries", "completed": false}
const todoList = [{
  id: '1',
  task: "Buy groceries",
  completed: false
},
{
  id: '2',
  task: "Doing Laundry",
  completed: true
}];
const app = express();
app.set('view engine', 'ejs');
app.use(morgan('dev'));
app.use(express.urlencoded({extended : true}));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/api/todos', (req, res) => {
    const templateVars = {
        todoList: todoList
        statusCode: 200;
    };
    res.render('todos', templateVars);
});

app.get('/api/todo/form', (req, res) => {
    res.render('new-todo');
});

app.get('/api/todos/:id', (req, res) => {
    const todoId = req.params.id;
    const foundTodo = todoList.find((todo) => {
        if(todo.id === id){
            return todoId;
        }
    });
    const templateVars = {
        todo : foundTodo,
        issue: false,
        statusCode: null
    }
    if(!foundTodo){
        templateVars.issue = "This task doesn't exists!";
        templateVars.statusCode = 500;
    }
    console.log(templateVars );
    res.render('todo-detail', templateVars);
});

app.get('/api/todo/edit/:Id', (req, res) => {
    const todoId = req.params.Id;
    const foundTodo = todoList.find((todo) => {
        if(todo.id === todoId){
            return todoId;
        }
    });
    const templateVars = {
        todo : foundTodo
    }
    res.render('edit-todo', templateVars);
});

app.post('/api/todo/new', (req, res) => {
    if (req.body.task === null || req.body.completed === null) {
        return new Error("Task details not entered!")
    }
    const newTodo = req.body;
    newTodo.id = uid(3);
  
    todoList.push(newTodo);
    res.redirect('/api/todos');
});

app.post('/api/edit/todo/:id', (req, res) => {
    const todoId = req.params.id;
     if (req.body.task === null || req.body.completed === null) {
        return new Error("Task details not entered!")
    }
    for(let i = 0; i < todoList.length; i ++){
        if(todoList[i].id === id){
            todoList[i].task = req.body.task;
            todoList[i].completed = req.body.completed;
        }
    }
    res.redirect(`/api/todos/${todoId}`);
});

app.post('/api/delete/todo/:id', (req, res) => {
    const todoId = req.params.id;
    const todoIndex = todoList.findIndex((todo) => {
        if(todoId === todo.id){
            return todo;
        }
    });
   todoList.splice(todoIndex, 1);
    res.redirect('/api/todos');
});

app.listen(PORT, () => {
    console.log(`This server is running in port ${PORT}.`);
});

// http://localhost:8080/
