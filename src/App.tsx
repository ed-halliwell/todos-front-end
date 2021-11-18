import { useEffect, useState } from "react";
import axios from "axios";
import dotenv from "dotenv";

import Todo from "./components/Todo";
import { ITodo } from "./utils/interfaces";
import NewTodoForm from "./components/NewTodoForm";

dotenv.config();

export default function App(): JSX.Element {
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  // const [message, setMessage] = useState<string>();
  const [todoData, setTodoData] = useState<ITodo[]>([]);

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

  const handleUpdateTodosAfterCreation = (newTodo: ITodo): void => {
    setTodoData([...todoData, newTodo]);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (isFirstLoad) {
      loadDataFromEndpoint("todos");
      setIsFirstLoad(false);
    }
  });

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

  const handleEditTodo = async (todoId: number) => {
    await axios
      .patch(`${process.env.REACT_APP_PROD_API_URL}todos/${todoId}`, {
        text: "An edited todo",
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <>
      <h1>Todo List</h1>
      <NewTodoForm updateTodosAfterCreation={handleUpdateTodosAfterCreation} />
      <hr />
      <ul>
        {todoData
          .sort((a, b) => b.createdAt - a.createdAt)
          .map((todo) => (
            <Todo
              key={todo.id}
              todo={todo}
              handleEditTodo={handleEditTodo}
              handleDeleteTodo={handleDeleteTodo}
              handleIsCompleteToggle={handleIsCompleteToggle}
            />
          ))}
      </ul>
    </>
  );
}
