import mongoose from 'mongoose';

import type {Todo} from '@/domain/todo';

import type {ITodoDatabase} from './out';

const connection = mongoose.connect(process.env.MONGO_URL as string, {
    keepAlive: true,
});

mongoose.set('debug', true);
mongoose.Promise = Promise;

type TodoModel = {
    task: string;
    completed: boolean;
};

const todoSchema = new mongoose.Schema<TodoModel>({
    task: {
        type: String,
        unique: true,
        required: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
});

const todoModel = (mongoose.models.Task ?? mongoose.model('Task', todoSchema)) as mongoose.Model<TodoModel>;

const extractTodo = (data: (TodoModel & {_id: any}) | null): Todo => {
    const {_id, task, completed} = data!;

    return {task, completed, id: _id.toString()};
};

export const todoDB: ITodoDatabase = {
    init: async () => {
        await connection;
    },
    createTodo: dto => todoModel.create(dto).then(extractTodo),
    updateTodo: async ({id, ...todo}) =>
        todoModel
            .findByIdAndUpdate(id, todo)
            .then(() => todoModel.findById(id))
            .then(extractTodo),
    deleteTodo: async id => {
        await todoModel.findByIdAndDelete(id);
    },
    getTodos: () => todoModel.find().then(todos => todos.map(extractTodo)),
};
