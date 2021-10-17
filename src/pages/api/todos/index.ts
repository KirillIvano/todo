import type {NextApiHandler} from 'next';
import NextCors from 'nextjs-cors';

import {todoDB} from '@/persistance';
import type {ITodoDatabase} from '@/persistance/out';
import type {GetTodosDto} from '@/services/todos/dto';
import type {Todo} from '@/domain/todo';
import type {ApiResponse} from '@/types/api';

const initHandler = (db: ITodoDatabase) => {
    const getAllHandler: NextApiHandler<ApiResponse<{todos: GetTodosDto}>> = async (req, res) => {
        try {
            const todos = await db.getTodos();
            res.status(200).json({todos});
        } catch (err) {
            res.status(400).json({error: 'createFailed'});
        }
    };

    const createHandler: NextApiHandler<ApiResponse<{todo: Todo}>> = async (req, res) => {
        try {
            const todo = await db.createTodo(req.body.todo);
            res.status(200).json({todo});
        } catch (err) {
            res.status(400).json({error: 'createFailed'});
        }
    };

    const editHandler: NextApiHandler<ApiResponse<{todo: Todo}>> = async (req, res) => {
        try {
            const todo = await db.updateTodo(req.body.todo);
            res.status(200).json({todo});
        } catch (err) {
            res.status(400).json({error: 'updateFailed'});
        }
    };

    const handler: NextApiHandler = async (req, res) => {
        await db.init();

        await NextCors(req, res, {
            methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
            origin: '*',
            optionsSuccessStatus: 200,
        });

        const {method} = req;

        if (method === 'POST') {
            return createHandler(req, res);
        } else if (method === 'GET') {
            return getAllHandler(req, res);
        } else if (method === 'PUT') {
            return editHandler(req, res);
        }

        res.status(404);
    };

    return handler;
};

export default initHandler(todoDB);
