import { useEffect, useState } from "react";
import axios from "axios";
import dotenv from "dotenv";

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
  const [formValue, setFormValue] = useState<string>("");

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

  const createTodo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await axios
      .post(`${process.env.REACT_APP_PROD_API_URL}todos`, {
        text: formValue,
      })
      .then(function (response) {
        todoData.push(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
    setFormValue("");
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

  return (
    <>
      <h1>This is a title</h1>
      <ul>
        {todoData.map((todo) => (
          <li key={todo.id}>
            {todo.text}
            <button>Edit</button>
            <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <section>
        <h3>Create new todo:</h3>
        <form onSubmit={createTodo}>
          <input
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
            placeholder="Write your todo..."
          />
          <button type="submit">Create</button>
        </form>
      </section>
    </>
  );
}
