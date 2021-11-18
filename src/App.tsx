import { useEffect, useState } from "react";
import axios from "axios";
import dotenv from "dotenv";
import moment from "moment";

dotenv.config();

interface Todo {
  id: number;
  text: string;
  createdAt: number;
  completed: boolean;
}

export default function App(): JSX.Element {
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  // const [message, setMessage] = useState<string>();
  const [todoData, setTodoData] = useState<Todo[]>([]);
  const [newTodoValue, setNewTodoValue] = useState<string>("");

  const loadDataFromEndpoint = async (endpoint: string) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_PROD_API_URL}${endpoint}`
      );
      setTodoData(res.data);
    } catch (err) {
      if (err instanceof Error) {
        console.log(`${err.name}: ${err.message}`);
      }
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (isFirstLoad) {
      loadDataFromEndpoint("todos");
      setIsFirstLoad(false);
    }
  });

  const handleCreateTodo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await axios
      .post(`${process.env.REACT_APP_PROD_API_URL}todos`, {
        text: newTodoValue,
        createdAt: Date.now(),
      })
      .then(function (response) {
        todoData.push(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
    setNewTodoValue("");
  };

  const handleDeleteTodo = async (todoId: number) => {
    await axios
      .delete(`${process.env.REACT_APP_PROD_API_URL}todos/${todoId}`)
      .then(function (response) {
        console.log(response);
        setTodoData(todoData.filter((todo) => todo.id !== todoId));
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleIsCompleteToggle = async (
    todoId: number,
    currentCompletedValue: boolean
  ) => {
    await axios
      .patch(`${process.env.REACT_APP_PROD_API_URL}todos/${todoId}`, {
        completed: !currentCompletedValue,
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const timestampConverter = (unixTimestamp: number): string => {
    const array = moment(unixTimestamp).toArray(); // [2013, 1, 4, 14, 40, 16, 154];
    const outputString = moment([
      array[0],
      array[1],
      array[2],
      array[3],
      array[4],
    ]).fromNow();
    return outputString;
  };

  return (
    <>
      <h1>Todo List</h1>
      <section>
        <h3>Create a new todo:</h3>
        <form onSubmit={handleCreateTodo}>
          <input
            value={newTodoValue}
            onChange={(e) => setNewTodoValue(e.target.value)}
            placeholder="Write your todo..."
          />
          <button type="submit">Create</button>
        </form>
      </section>
      <hr />
      <ul>
        {todoData.map((todo) => (
          <li key={todo.id}>
            {todo.text} - {timestampConverter(todo.createdAt)}
            <button>Edit</button>
            <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
            <label>
              <input
                type="checkbox"
                name="isComplete"
                defaultChecked={todo.completed}
                onChange={() => handleIsCompleteToggle(todo.id, todo.completed)}
              />
              Completed?
            </label>
          </li>
        ))}
      </ul>
    </>
  );
}
