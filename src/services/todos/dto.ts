import {Todo} from '@/domain/todo';

export type CreateTodoDto = {
    task: string;
    completed?: boolean;
};

export type EditTodoDto = {task?: string; completed?: boolean; id: string};
export type GetTodosDto = Todo[];
