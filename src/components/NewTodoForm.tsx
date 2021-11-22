import { useState } from "react";
import axios from "axios";
import { ITodo } from "../utils/interfaces";
import { API_BASE } from "../utils/APIFragments";

import FormControl from "@mui/material/FormControl";
import Input from "@mui/material/Input";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

interface NewTodoFormProps {
  updateTodosAfterCreation: (newTodo: ITodo) => void;
}

export default function NewTodoForm(props: NewTodoFormProps): JSX.Element {
  const [isNewTodoMode, setIsNewTodoMode] = useState<boolean>(false);
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
        setIsNewTodoMode(false);
      })
      .catch(function (error) {
        console.log(error);
      });
    setNewTodoValue("");
  };

  return (
    <>
      {isNewTodoMode ? (
        <section>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{ m: 2 }}
          >
            <form onSubmit={handleCreateTodo}>
              <Stack direction="row" spacing={2}>
                <FormControl sx={{ width: "80%", pb: 1 }}>
                  <Input
                    id="newTodo"
                    placeholder="Add a new todo..."
                    value={newTodoValue}
                    onChange={(e) => setNewTodoValue(e.target.value)}
                  />
                </FormControl>
                <IconButton
                  aria-label="Cancel"
                  onClick={() => setIsNewTodoMode(false)}
                >
                  <CloseIcon />
                </IconButton>
                <IconButton aria-label="Save" type="submit">
                  <CheckIcon />
                </IconButton>
              </Stack>
            </form>
          </Box>
        </section>
      ) : (
        <Box display="flex" justifyContent="center" alignItems="center">
          <Button
            variant="contained"
            sx={{ m: 2 }}
            onClick={() => setIsNewTodoMode(true)}
          >
            Create New Todo
          </Button>
        </Box>
      )}
    </>
  );
}
