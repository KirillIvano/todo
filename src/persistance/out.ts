import {Todo} from '@/domain/todo';
import {CreateTodoDto, EditTodoDto} from '@/services/todos/dto';

export type ITodoDatabase = {
    init: () => Promise<void>;

    createTodo: (todo: CreateTodoDto) => Promise<Todo>;
    updateTodo: (todo: EditTodoDto) => Promise<Todo>;
    deleteTodo: (id: string) => Promise<void>;
    getTodos: () => Promise<Todo[]>;
};
