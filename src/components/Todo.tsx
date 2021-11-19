import { useState } from "react";
import { ITodo } from "../utils/interfaces";
import timestampConverter from "../utils/timestampConverter";
import axios from "axios";
import { API_BASE } from "../utils/APIFragments";

interface TodoProps {
  todo: ITodo;
  updateTodosAfterEditing: (updatedTodo: ITodo) => void;
  handleDeleteTodo: (todoId: number) => void;
  handleIsCompleteToggle: (todoId: number, currentState: boolean) => void;
}

export default function Todo(props: TodoProps): JSX.Element {
  const { text, id, createdAt, completed } = props.todo;

  const [isEditing, setIsEditing] = useState<boolean>();
  const [editedTodo, setEditedTodo] = useState<string>(text);

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  const handleEditTodo = async (
    e: React.FormEvent<HTMLFormElement>,
    todoId: number,
    updatedText: string
  ) => {
    e.preventDefault();
    await axios
      .patch(`${API_BASE}todos/${todoId}`, {
        text: updatedText,
      })
      .then((res) => {
        props.updateTodosAfterEditing(res.data.data.didUpdate);
        toggleEditMode();
      })
      .catch((error) => console.log(error));
  };

  return (
    <>
      {isEditing ? (
        <li>
          <form onSubmit={(e) => handleEditTodo(e, id, editedTodo)}>
            <input
              type="text"
              value={editedTodo}
              placeholder={text}
              onChange={(e) => setEditedTodo(e.target.value)}
            />
            <button type="button" onClick={toggleEditMode}>
              Cancel
            </button>
            <button type="submit">Save</button>
          </form>
        </li>
      ) : (
        <li>
          {text} - {timestampConverter(createdAt)}
          <button onClick={toggleEditMode}>Edit</button>
          <button onClick={() => props.handleDeleteTodo(id)}>Delete</button>
          <label>
            <input
              type="checkbox"
              name="isComplete"
              defaultChecked={completed}
              onChange={() => props.handleIsCompleteToggle(id, completed)}
            />
            Completed?
          </label>
        </li>
      )}
    </>
  );
}
