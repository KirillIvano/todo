import {Todo} from '@/domain/todo';
import {getApiUrl} from '@/utils/getApiUrl';
import {request, Result} from '@/utils/request';
import {CreateTodoDto, EditTodoDto, GetTodosDto} from './dto';

export const getTodos = (): Promise<Result<{todos: GetTodosDto}>> => request(getApiUrl('/api/todos'));

export const createTodo = (dto: CreateTodoDto): Promise<Result<{todo: Todo}>> =>
    request(getApiUrl('/api/todos'), {
        method: 'POST',
        body: JSON.stringify({todo: dto}),
        headers: {
            'Content-Type': 'application/json',
        },
    });

export const editTodo = (dto: EditTodoDto): Promise<Result<{todo: Todo}>> =>
    request(getApiUrl('/api/todos'), {
        method: 'PUT',
        body: JSON.stringify({todo: dto}),
        headers: {
            'Content-Type': 'application/json',
        },
    });

export const deleteTodo = (id: string) => request(getApiUrl(`/api/todos/${id}`), {method: 'DELETE'});
