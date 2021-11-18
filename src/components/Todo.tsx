import { useState } from "react";
import { ITodo } from "../utils/interfaces";
import timestampConverter from "../utils/timestampConverter";
import axios from "axios";
interface TodoProps {
  todo: ITodo;
  //   handleEditTodo: (todoId: number) => void;
  handleDeleteTodo: (todoId: number) => void;
  handleIsCompleteToggle: (todoId: number, currentState: boolean) => void;
}

export default function Todo(props: TodoProps): JSX.Element {
  const { text, id, createdAt, completed } = props.todo;
  const [isEditing, setIsEditing] = useState<boolean>();
  const [editedTodo, setEditedTodo] = useState<string>("");

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  const handleEditTodo = async (todoId: number, updatedText: string) => {
    await axios
      .patch(`${process.env.REACT_APP_PROD_API_URL}todos/${todoId}`, {
        text: updatedText,
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <>
      {isEditing ? (
        <li>
          <form onSubmit={(e) => handleEditTodo(id, text)}>
            <input
              type="text"
              value={text}
              onChange={(e) => setEditedTodo(e.target.value)}
            />
            <button onClick={toggleEditMode}>Cancel</button>
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
