import { useState } from "react";
import { ITodo } from "../utils/interfaces";
import timestampConverter from "../utils/timestampConverter";
import axios from "axios";
import { API_BASE } from "../utils/APIFragments";

import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import FormControl from "@mui/material/FormControl";
import Input from "@mui/material/Input";

interface TodoProps {
  todo: ITodo;
  updateTodosAfterEditing: (updatedTodo: ITodo) => void;
  handleDeleteTodo: (todoId: number) => void;
  handleIsCompleteToggle: (todoId: number, currentState: boolean) => void;
}

export default function Todo(props: TodoProps): JSX.Element {
  const { text, id, createdAt, completed } = props.todo;

  const [isEditing, setIsEditing] = useState<boolean>(false);
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
        <ListItemButton dense>
          <form onSubmit={(e) => handleEditTodo(e, id, editedTodo)}>
            <ListItemIcon>
              <Checkbox
                edge="start"
                disabled
                checked={completed}
                tabIndex={-1}
                disableRipple
              />
            </ListItemIcon>

            <FormControl>
              <Input
                id="component-simple"
                placeholder={text}
                value={editedTodo}
                onChange={(e) => setEditedTodo(e.target.value)}
              />
            </FormControl>

            <ListItemSecondaryAction>
              <IconButton aria-label="Cancel" onClick={toggleEditMode}>
                <CloseIcon />
              </IconButton>
              <IconButton aria-label="Save" type="submit">
                <CheckIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </form>
        </ListItemButton>
      ) : (
        <ListItemButton role={undefined} dense>
          <ListItemIcon>
            <Checkbox
              edge="start"
              checked={completed}
              tabIndex={-1}
              disableRipple
              onClick={() => props.handleIsCompleteToggle(id, completed)}
            />
          </ListItemIcon>
          <Box>
            <ListItemText id={id.toString()} primary={text} />
            <Typography variant="caption" display="block" gutterBottom>
              {timestampConverter(createdAt)}
            </Typography>
          </Box>
          <ListItemSecondaryAction>
            <IconButton aria-label="Edit" onClick={toggleEditMode}>
              <EditIcon />
            </IconButton>
            <IconButton
              aria-label="Delete"
              onClick={() => props.handleDeleteTodo(id)}
            >
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItemButton>
      )}
    </>
  );
}
