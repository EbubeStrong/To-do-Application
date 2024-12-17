import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "../../components/components/ui/button";
import { Input } from "../../components/components/ui/input";
import { Checkbox } from "../../components/components/ui/checkbox";
import { useToast } from "../../components/hooks/use-toast";
import Spinner from "./Spinner";

const fetchTodo = async (id) => {
  const storedTodos = JSON.parse(localStorage.getItem("todos")) || [];
  const localTodo = storedTodos.find((t) => t.id === parseInt(id));
  if (localTodo) {
    return localTodo;
  }
  const { data } = await axios.get(
    `https://jsonplaceholder.typicode.com/todos/${id}`
  );
  return data;
};

const TodoDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [todo, setTodo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDueDate, setEditedDueDate] = useState("");

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["todo", id],
    queryFn: () => fetchTodo(id),
    enabled: !!id,
  });

  useEffect(() => {
    if (data) {
      setTodo(data);
      setEditedTitle(data.title);
      setEditedDueDate(data.dueDate || "");
    }
  }, [data]);

  const updateTodoMutation = useMutation({
    mutationFn: (updatedTodo) =>
      updatedTodo.isLocal
        ? Promise.resolve(updatedTodo)
        : axios.put(
            `https://jsonplaceholder.typicode.com/todos/${id}`,
            updatedTodo
          ),
    onSuccess: (data) => {
      const updatedTodo = data.isLocal ? data : data.data;
      setTodo(updatedTodo);
      queryClient.invalidateQueries(["todo", id]);
      const storedTodos = JSON.parse(localStorage.getItem("todos")) || [];
      const updatedTodos = storedTodos.map((t) =>
        t.id === parseInt(id) ? { ...updatedTodo, isLocal: t.isLocal } : t
      );
      localStorage.setItem("todos", JSON.stringify(updatedTodos));
      toast({
        title: "Todo Updated",
        description: "The todo has been updated successfully.",
      });
    },
    onError: (error) => {
      console.error("Error updating todo:", error);
      toast({
        title: "Error",
        description: "An error occurred while updating the todo.",
      });
    },
  });

  const handleUpdate = () => {
    if (isEditing) {
      if (!todo) return;
      const updatedTodo = {
        ...todo,
        title: editedTitle || todo.title,
        dueDate: editedDueDate || todo.dueDate,
      };
      updateTodoMutation.mutate(updatedTodo);
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const handleToggleComplete = () => {
    if (!todo) return;
    const updatedTodo = { ...todo, completed: !todo.completed };
    updateTodoMutation.mutate(updatedTodo);
  };

  if (isLoading) return <Spinner />;
  if (isError) return <div>Error: Todo not found</div>;
  if (!todo) return <Spinner />;

  return (
    <div className="container p-4">
      <h1 className="text-4xl font-bold mb-8">Todo Details</h1>
      <div className="bg-white max-w-[500px] mx-auto p-6 rounded shadow">
        {isEditing ? (
          <>
            <Input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="mb-4"
            />
            <Input
              type="date"
              value={editedDueDate}
              onChange={(e) => setEditedDueDate(e.target.value)}
              className="mb-4"
            />
          </>
        ) : (
          <>
            <h2 className="text-2xl mb-4">{todo.title}</h2>
            {todo.dueDate && (
              <p className="mb-4">
                Due: {new Date(todo.dueDate).toLocaleDateString()}
              </p>
            )}
          </>
        )}
        <div className="flex items-center space-x-2 mb-4">
          <Checkbox
            id="completed"
            checked={todo.completed}
            onCheckedChange={handleToggleComplete}
          />
          <label htmlFor="completed" className="ml-2">
            {todo.completed ? "Completed" : "Incomplete"}
          </label>
        </div>
        <div className="space-x-4">
          <Button onClick={handleUpdate}>{isEditing ? "Save" : "Edit"}</Button>
          <Button variant="outline" onClick={() => navigate("/todos")}>
            Back to List
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TodoDetails;