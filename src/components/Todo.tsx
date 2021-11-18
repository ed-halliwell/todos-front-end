import { ITodo } from "../utils/interfaces";
import timestampConverter from "../utils/timestampConverter";

interface TodoProps {
  todo: ITodo;
  handleEditTodo: (todoId: number) => void;
  handleDeleteTodo: (todoId: number) => void;
  handleIsCompleteToggle: (todoId: number, currentState: boolean) => void;
}

export default function Todo(props: TodoProps): JSX.Element {
  const { text, id, createdAt, completed } = props.todo;

  return (
    <li>
      {text} - {timestampConverter(createdAt)}
      <button onClick={() => props.handleEditTodo(id)}>Edit</button>
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
  );
}
