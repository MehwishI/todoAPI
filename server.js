
const express = require('express');
const morgan = require('morgan');
const {uid} = require('uid');

const PORT = 8080;

const todoList = [{
  id: '1',
  task: "Buy groceries",
  completed: false
},
{
  id: '2',
  task: "Doing Laundry",
  completed: true
},
{
  id: '3',
  task: "Preparing Reports",
  completed: false
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
        todoList: todoList,
        statusCode: 200
    };
     if (todoList.length === 0) {
        return res.status(404).send("Todo List not available!")
    }
    
    res.status(200).render('todos', templateVars);
});

app.get('/api/todo/form', (req, res) => {
    res.status(200).render('new-todo');
});

app.get('/api/todo/:id', (req, res) => {
    const todoId = req.params.id;
    const foundTodo = todoList.find((todo) => {
        if(todo.id === todoId){
            return todoId;
        }
    });
    const templateVars = {
        todo : foundTodo,
        issue: false,
        
    }
    if(!foundTodo){
        return res.status(404).send('Todo not found!, Please try again.');
    }
  
    res.status(200).render('todo-detail', templateVars);
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
    if (!foundTodo) {
          return res.status(404).send('Task not found!, Please try again.');
        
    }
    res.status(200).render('edit-todo', templateVars);
});

app.post('/api/todo/new', (req, res) => {
   
    const { task, completed } = req.body; 
    if (!task || !completed) {
        return res.status(400).send("Please enter all task details to add a new todo !");
    }
    const newTodo = req.body;
    newTodo.id = uid(3);
  
    todoList.push(newTodo);
    res.status(201).redirect('/api/todos');
});

app.post('/api/edit/todo/:id', (req, res) => {
    const todoId = req.params.id;
    const { task, completed } = req.body; 
    if (!task || !completed) {
        return res.status(400).send("Task details missing. Please enter all task details to save!");
    }
    for(let i = 0; i < todoList.length; i ++){
        if(todoList[i].id === todoId){
            todoList[i].task = task || todoList[i].task;
            todoList[i].completed = completed || todoList[i].completed;
        }
    }
    res.status(201).redirect(`/api/todo/${todoId}`);
});

app.post('/api/delete/todo/:id', (req, res) => {
    const todoId = req.params.id;
    //finding index of the task
    const todoIndex = todoList.findIndex((todo) => {
        if (todoId === todo.id) {
            return todo;
        }
         
    });
    if (todoIndex === -1) {
        return res.status(404).send("Task not found!")
    }
   todoList.splice(todoIndex, 1); //deleting the task from the array
    res.status(201).redirect('/api/todos');
});

app.listen(PORT, () => {
    console.log(`This server is running in port ${PORT}.`);
});

