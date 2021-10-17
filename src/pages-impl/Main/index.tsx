import {useState, useEffect, useRef} from 'react';
import type {MouseEvent, FC, VFC} from 'react';

import {createTodo, editTodo, deleteTodo} from '@/services/todos';
import {Todo} from '@/domain/todo';

import css from './styles.module.css';

const Pending: FC<{pending: boolean}> = ({children, pending}) => (
    <div className={pending ? css.pendingContainer : ''}>
        <div aria-disabled={true} className={css.pendingContent}>
            {children}
        </div>
        {pending && <div aria-hidden={true} className={css.spinner}></div>}
    </div>
);

export type TodoItemProps = {
    id: string;
    task: string;
    completed: boolean;
    onRename: (id: string, name: string) => void;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
};
const TodoItem: VFC<TodoItemProps> = ({task, id, completed, onDelete, onToggle, onRename}) => {
    const [currentVal, setCurrentVal] = useState(task);
    const [editable, setEditable] = useState(false);

    const inputRef = useRef<null | HTMLInputElement>(null);

    useEffect(() => {
        setCurrentVal(task);
    }, [task]);

    const handleToggle = (e: MouseEvent) => {
        e.stopPropagation();
        onToggle(id);
    };
    const handleDelete = (e: MouseEvent) => {
        e.stopPropagation();
        onDelete(id);
    };
    const handleNameBlur = () => {
        setEditable(false);

        if (currentVal !== task) {
            onRename(id, currentVal);
        }
    };
    const handleEditClick = () => {
        setEditable(true);

        setTimeout(() => {
            if (inputRef.current) inputRef.current.focus();
        }, 0);
    };

    return (
        <li style={{textDecoration: completed ? 'line-through' : undefined}}>
            {!editable && <span onClick={handleToggle}>{task}</span>}

            <input
                ref={inputRef}
                hidden={!editable}
                value={currentVal}
                onBlur={handleNameBlur}
                onChange={e => setCurrentVal(e.currentTarget.value)}
            />

            <button style={{color: 'red', cursor: 'pointer'}} onClick={handleDelete}>
                x
            </button>
            {!editable && (
                <button style={{color: 'green', cursor: 'pointer'}} onClick={handleEditClick}>
                    e
                </button>
            )}
        </li>
    );
};

export type MainPageProps = {
    initialTodos: Todo[];
};

function Main(props: MainPageProps) {
    const [todos, setTodos] = useState<Todo[]>(props.initialTodos);
    const [todo, setTodo] = useState('');
    const [pending, setPending] = useState(false);

    const createTodoHandler = async (e: MouseEvent) => {
        e.preventDefault();

        if (!todo) {
            alert('Введите имя в поле');
            return;
        }
        if (todos.some(({task}) => task === todo)) {
            alert(`${todo} уже существует`);
            return;
        }

        setPending(true);
        const newTodoRes = await createTodo({task: todo});

        if (newTodoRes.ok) setTodos([...todos, newTodoRes.data.todo]);
        setPending(false);
    };

    const deleteTodoHandler = async (deletedId: string) => {
        setPending(true);

        await deleteTodo(deletedId);

        setTodos(todos.filter(({id}) => id !== deletedId));
        setPending(false);
    };

    const toggleTodo = async (id: string) => {
        setPending(true);

        const payload = {completed: !todos.find(todo => todo.id === id)?.completed ?? false, id};

        const updatedTodo = await editTodo(payload);

        setTodos(todos.map(todo => (todo.id === id ? (updatedTodo.ok ? updatedTodo.data.todo : todo) : todo)));
        setPending(false);
    };

    const renameTodo = async (id: string, name: string) => {
        setPending(true);

        const updatedTodo = await editTodo({task: name, id});

        setTodos(todos.map(todo => (todo.id === id ? (updatedTodo.ok ? updatedTodo.data.todo : todo) : todo)));
        setPending(false);
    };

    return (
        <Pending pending={pending}>
            <div>
                <input
                    type="text"
                    value={todo}
                    onChange={({target}) => setTodo(target.value)}
                    placeholder="Enter a todo"
                />
                <button type="button" onClick={createTodoHandler}>
                    Add
                </button>
            </div>

            <ul>
                {todos.length ? (
                    todos.map(({id, task, completed}, i) => (
                        <TodoItem
                            key={id}
                            id={id}
                            task={task}
                            completed={completed}
                            onToggle={toggleTodo}
                            onRename={renameTodo}
                            onDelete={deleteTodoHandler}
                        />
                    ))
                ) : (
                    <p>No Todos Yet :(</p>
                )}
            </ul>
        </Pending>
    );
}

export default Main;
