import { useState } from "react";
import axios from "axios";
import { ITodo } from "../utils/interfaces";
import { API_BASE } from "../utils/APIFragments";

interface NewTodoFormProps {
  updateTodosAfterCreation: (newTodo: ITodo) => void;
}

export default function NewTodoForm(props: NewTodoFormProps): JSX.Element {
  const [newTodoValue, setNewTodoValue] = useState<string>("");

  const handleCreateTodo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await axios
      .post(`${API_BASE}todos`, {
        text: newTodoValue,
        createdAt: Date.now(),
      })
      .then(function (response) {
        props.updateTodosAfterCreation(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
    setNewTodoValue("");
  };

  return (
    <section>
      <form onSubmit={handleCreateTodo}>
        <label>Create a new todo: </label>
        <input
          value={newTodoValue}
          onChange={(e) => setNewTodoValue(e.target.value)}
          placeholder="Write your todo..."
        />
        <button type="submit">Create</button>
      </form>
    </section>
  );
}
