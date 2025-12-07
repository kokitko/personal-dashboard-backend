const Todo = require('./database/todo');

const addTodo = () => async (req, res) => {
    try {
        const { title } = req.body;
        const userId = req.user.id;
        const newTodo = new Todo({
            title: { text: title },
            completed: false,
            userId: userId
        });
        const savedTodo = await newTodo.save();
        return res.status(201).json(savedTodo);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const getTodos = () => async (req, res) => {
    try {
        const userId = req.user.id;
        const todos = await Todo.find({ userId: userId });
        return res.status(200).json(todos);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const toggleCompleteTodo = () => async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await Todo.findOne({ _id: id, userId: req.user.id });
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        todo.completed = !todo.completed;
        const updatedTodo = await todo.save();
        return res.status(200).json(updatedTodo);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const deleteTodo = () => async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await Todo.findOneAndDelete({ _id: id, userId: req.user.id });
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        return res.status(200).json({ message: 'Todo deleted successfully' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.export = {
    addTodo,
    getTodos,
    toggleCompleteTodo,
    deleteTodo
}