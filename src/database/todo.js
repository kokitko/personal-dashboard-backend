const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const todoSchema = new Schema({
    text: { type: String, required: true },
    completed: { type: Boolean, default: false, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

const Todo = mongoose.model('Todo', todoSchema);
module.exports = Todo;