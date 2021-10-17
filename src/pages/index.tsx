import {GetServerSideProps} from 'next';

import {MainPageProps} from '@/pages-impl/Main';
import {getTodos} from '@/services/todos';
import {MainPage} from '@/pages-impl';
import {todoDB} from '@/persistance';

export const getServerSideProps: GetServerSideProps<MainPageProps> = async () => {
    await todoDB.init();
    const todos = await todoDB.getTodos();

    return {props: {initialTodos: todos}};
};

export default MainPage;
