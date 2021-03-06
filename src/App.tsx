import { useEffect, useState } from "react";
import React from "react";
import axios from "axios";
import dotenv from "dotenv";
import "./styles/App.css";

import { API_BASE } from "./utils/APIFragments";
import { ITodo } from "./utils/interfaces";

import Todo from "./components/Todo";
import NewTodoForm from "./components/NewTodoForm";
import Header from "./components/Header";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import Container from "@mui/material/Container";

dotenv.config();

export default function App(): JSX.Element {
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [todoData, setTodoData] = useState<ITodo[]>([]);

  const loadDataFromEndpoint = async (endpoint: string) => {
    try {
      const res = await axios.get(`${API_BASE}${endpoint}`);
      setTodoData(res.data.todos);
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

  const handleUpdateTodosAfterCreation = (newTodo: ITodo): void => {
    setTodoData([...todoData, newTodo]);
  };

  const handleUpdateTodosAfterEditing = (updatedTodo: ITodo): void => {
    const updatedTodos = todoData.map((todo) =>
      todo.id === updatedTodo.id ? { ...updatedTodo } : todo
    );
    setTodoData(updatedTodos);
  };

  const handleDeleteTodo = async (todoId: number) => {
    await axios
      .delete(`${API_BASE}todos/${todoId}`)
      .then(() => {
        setTodoData(todoData.filter((todo) => todo.id !== todoId));
      })
      .catch((error) => console.log(error));
  };

  const handleIsCompleteToggle = async (
    todoId: number,
    currentCompletedValue: boolean
  ) => {
    await axios
      .patch(`${API_BASE}todos/${todoId}`, {
        completed: !currentCompletedValue,
      })
      .then((res) => handleUpdateTodosAfterEditing(res.data.data.todo))
      .catch((error) => console.log(error));
  };

  return (
    <>
      <Header />
      <Container maxWidth="xs" sx={{ border: "none" }}>
        <NewTodoForm
          updateTodosAfterCreation={handleUpdateTodosAfterCreation}
        />
        <Divider />
        <List
          sx={{
            width: "100%",
            maxWidth: 360,
            bgcolor: "background.paper",
            margin: "auto",
          }}
        >
          {todoData
            .sort((a, b) => b.createdat - a.createdat)
            .map((todo) => (
              <React.Fragment key={todo.id}>
                <ListItem key={todo.id} disablePadding>
                  <Todo
                    todo={todo}
                    updateTodosAfterEditing={handleUpdateTodosAfterEditing}
                    handleDeleteTodo={handleDeleteTodo}
                    handleIsCompleteToggle={handleIsCompleteToggle}
                  />
                </ListItem>
                <Divider light />
              </React.Fragment>
            ))}
        </List>
      </Container>
    </>
  );
}
