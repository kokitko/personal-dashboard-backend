const Todo = require('./database/todo');

const addTodo = async (req, res) => {
    try {
        console.log("INFO: Add Todo endpoint called by user id =", req.user.id);
        const { text } = req.body;
        const userId = req.user.id;
        const newTodo = new Todo({
            text: text,
            completed: false,
            userId: userId
        });
        const savedTodo = await newTodo.save();
        console.log("INFO: Todo added successfully, id =", savedTodo._id);
        return res.status(201).json(savedTodo);
    } catch (error) {
        console.error('Error adding todo:', error);
        return res.status(500).json({ error: error.message });
    }
};

const getTodos = async (req, res) => {
    try {
        console.log("INFO: Get Todos endpoint called by user id =", req.user.id);
        const userId = req.user.id;
        const todos = await Todo.find({ userId: userId });
        console.log("INFO: Retrieved", todos.length, "todos for user id =", userId);
        return res.status(200).json(todos);
    } catch (error) {
        console.error('Error retrieving todos:', error);
        return res.status(500).json({ error: error.message });
    }
};

const toggleCompleteTodo = async (req, res) => {
    try {
        console.log("INFO: Toggle Complete Todo endpoint called by user id =", req.user.id);
        const { id } = req.params;
        const todo = await Todo.findOne({ _id: id, userId: req.user.id });
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        todo.completed = !todo.completed;
        const updatedTodo = await todo.save();
        console.log("INFO: Todo 'completed' toggled successfully, id =", updatedTodo._id);
        return res.status(200).json(updatedTodo);
    } catch (error) {
        console.error('Error toggling todo completion:', error);
        return res.status(500).json({ error: error.message });
    }
};

const deleteTodo = async (req, res) => {
    try {
        console.log("INFO: Delete Todo endpoint called by user id =", req.user.id);
        const { id } = req.params;
        const todo = await Todo.findOneAndDelete({ _id: id, userId: req.user.id });
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        console.log("INFO: Todo deleted successfully, id =", todo._id);
        return res.status(200).json({ message: 'Todo deleted successfully' });
    } catch (error) {
        console.error('Error deleting todo:', error);
        return res.status(500).json({ error: error.message });
    }
};

module.exports = {
    addTodo,
    getTodos,
    toggleCompleteTodo,
    deleteTodo
};