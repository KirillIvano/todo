import type {NextApiHandler} from 'next';
import NextCors from 'nextjs-cors';

import {todoDB} from '@/persistance';
import type {ITodoDatabase} from '@/persistance/out';

const initHandler = (db: ITodoDatabase) => {
    const deleteHandler: NextApiHandler = async (req, res) => {
        try {
            await db.deleteTodo(req.query.id as string);
            res.status(200).send({});
        } catch (err) {
            res.status(400).json({error: 'createFailed'});
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

        if (method === 'DELETE') {
            return deleteHandler(req, res);
        }

        res.status(404).send({});
    };

    return handler;
};

export default initHandler(todoDB);
