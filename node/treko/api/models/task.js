import mongoose from 'mongoose';

let Task = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Título é obrigatório!'],
        unique: true
    },
    owner: {
        type: String,
        required: [true, 'Dono da tarefa é obrigatório!']
    },
    done: Boolean
});

export default mongoose.model('Task', Task);