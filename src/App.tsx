import { useEffect, useState } from "react";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
console.log(process.env.REACT_APP_PROD_API_URL);
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
    console.log("Creating todo...", formValue);
    await axios
      .post("/todos", {
        text: formValue,
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
    setFormValue("");
  };

  return (
    <>
      <h1>This is a title</h1>
      <ul>
        {todoData.map((todo) => (
          <li key={todo.id}>
            {todo.text}
            <button>Edit</button>
            <button>Delete</button>
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
