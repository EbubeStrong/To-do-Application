import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "../../components/components/ui/button";
import { Input } from "../../components/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/components/ui/select";
import { useToast } from "../../components/hooks/use-toast";
import TodoForm from "./TodoForm";
import Spinner from "./Spinner";
import ConfirmDialog from "./ConfirmDialog";

const fetchTodos = async () => {
  const { data } = await axios.get(
    "https://jsonplaceholder.typicode.com/todos"
  );
  return data;
};

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [todoToUpdate, setTodoToUpdate] = useState(null);
  const todosPerPage = 5;

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });

  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem("todos")) || [];
    if (data) {
      const combinedTodos = [
        ...storedTodos,
        ...data.filter(
          (todo) => !storedTodos.some((storedTodo) => storedTodo.id === todo.id)
        ),
      ];
      setTodos(combinedTodos);
      localStorage.setItem("todos", JSON.stringify(combinedTodos));
    } else {
      setTodos(storedTodos);
    }
  }, [data]);

  const createTodoMutation = useMutation({
    mutationFn: (newTodo) =>
      axios.post("https://jsonplaceholder.typicode.com/todos", newTodo),
    onSuccess: (data) => {
      const newTodo = {
        ...data.data,
        id: Date.now(),
        isLocal: true,
        dueDate: data.data.dueDate || null,
      };
      const updatedTodos = [newTodo, ...todos];
      setTodos(updatedTodos);
      localStorage.setItem("todos", JSON.stringify(updatedTodos));
      queryClient.invalidateQueries(["todos"]);
      toast({
        title: "Todo created",
        description: "Your new todo has been created successfully.",
      });
    },
  });

  const deleteTodoMutation = useMutation({
    mutationFn: (id) =>
      axios.delete(`https://jsonplaceholder.typicode.com/todos/${id}`),
    onSuccess: (_, id) => {
      const updatedTodos = todos.filter((todo) => todo.id !== id);
      setTodos(updatedTodos);
      localStorage.setItem("todos", JSON.stringify(updatedTodos));
      queryClient.invalidateQueries(["todos"]);
      toast({
        title: "Todo deleted",
        description: "The todo has been deleted successfully.",
      });
    },
  });

  const updateTodoMutation = useMutation({
    mutationFn: (updatedTodo) =>
      updatedTodo.isLocal
        ? Promise.resolve(updatedTodo)
        : axios.put(
            `https://jsonplaceholder.typicode.com/todos/${updatedTodo.id}`,
            updatedTodo
          ),
    onSuccess: (data) => {
      const updatedTodo = data.isLocal ? data : data.data;
      const updatedTodos = todos.map((todo) =>
        todo.id === updatedTodo.id
          ? { ...updatedTodo, isLocal: todo.isLocal }
          : todo
      );
      setTodos(updatedTodos);
      localStorage.setItem("todos", JSON.stringify(updatedTodos));
      queryClient.invalidateQueries(["todos"]);
      toast({
        title: "Todo updated",
        description: "The todo has been updated successfully.",
      });
    },
  });

  const handleCreateTodo = (newTodo) => {
    createTodoMutation.mutate(newTodo);
  };

  const handleDeleteTodo = (id) => {
    deleteTodoMutation.mutate(id);
  };

  const handleUpdateTodo = (todo) => {
    const today = new Date().setHours(0, 0, 0, 0);
    const dueDate = new Date(todo.dueDate).setHours(0, 0, 0, 0);

    if (!todo.completed && dueDate > today) {
      setTodoToUpdate(todo);
      setConfirmDialogOpen(true);
    } else {
      updateTodoMutation.mutate({ ...todo, completed: !todo.completed });
    }
  };

  const handleConfirmUpdate = () => {
    if (todoToUpdate) {
      updateTodoMutation.mutate({ ...todoToUpdate, completed: true });
    }
    setConfirmDialogOpen(false);
    setTodoToUpdate(null);
  };

  const handleCancelUpdate = () => {
    setConfirmDialogOpen(false);
    setTodoToUpdate(null);
  };

  const filteredTodos = todos
    .filter((todo) =>
      todo.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((todo) => {
      if (filter === "completed") return todo.completed;
      if (filter === "incomplete") return !todo.completed;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "a-z") return a.title.localeCompare(b.title);
      if (sortBy === "z-a") return b.title.localeCompare(a.title);
      return new Date(b.dueDate) - new Date(a.dueDate);
    });

  const indexOfLastTodo = currentPage * todosPerPage;
  const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
  const currentTodos = filteredTodos.slice(indexOfFirstTodo, indexOfLastTodo);

  const totalPages = Math.ceil(filteredTodos.length / todosPerPage);

  const rangeSize = 5;
  const currentRange = Math.ceil(currentPage / rangeSize);
  const startPage = (currentRange - 1) * rangeSize + 1;
  const endPage = Math.min(startPage + rangeSize - 1, totalPages);

  const pageRange = [];
  for (let i = startPage; i <= endPage; i++) {
    pageRange.push(i);
  }

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (isLoading) return <Spinner />;
  if (isError) return <div>Error fetching todos</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">To-do List</h1>

      <div
        className="max-w-[1100px] mx-auto p-6"
        style={{ boxShadow: "inset 0 4px 6px rgba(0, 0, 0, 0.1)" }}
      >
        <TodoForm onCreateTodo={handleCreateTodo} />
        <div className="mb-4 flex gap-4">
          <Input
            type="text"
            placeholder="Search todos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
          <Select onValueChange={setFilter} defaultValue={filter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="incomplete">Incomplete</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={setSortBy} defaultValue={sortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="a-z">A-Z</SelectItem>
              <SelectItem value="z-a">Z-A</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <ul className="space-y-4">
          {currentTodos.map((todo) => (
            <li
              key={todo.id}
              className={`p-4 rounded shadow flex justify-between items-center w-full sm:space-x-4 ${
                todo.completed ? "bg-green-100" : "bg-red-50"
              }`}
              style={{ maxWidth: '100%' }}
            >

              <div>
                <Link
                  to={`/todo/${todo.id}`}
                  className="text-lg font-semibold text-blue-600 hover:text-blue-800"
                >
                  {todo.title}
                </Link>
                <p>{todo.completed ? "Completed" : "Incomplete"}</p>
                {todo.dueDate && (
                  <p>Due: {new Date(todo.dueDate).toLocaleDateString()}</p>
                )}
              </div>
              <div className="space-x-3 space-y-3">
                <Button
                  onClick={() => handleUpdateTodo(todo)}
                  variant="outline"
                >
                  {todo.completed ? "Mark Incomplete" : "Mark Complete"}
                </Button>
                <Button
                  onClick={() => handleDeleteTodo(todo.id)}
                  variant="destructive"
                >
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex justify-center space-x-2">
          {startPage > rangeSize && (
            <Button onClick={() => paginate(startPage - rangeSize)}>
              Previous
            </Button>
          )}
          {pageRange.map((page) => (
            <Button
              key={page}
              onClick={() => paginate(page)}
              variant={currentPage === page ? "default" : "outline"}
            >
              {page}
            </Button>
          ))}
          {endPage < totalPages && (
            <Button onClick={() => paginate(endPage + 1)}>Next</Button>
          )}
        </div>
        <ConfirmDialog
          isOpen={confirmDialogOpen}
          onConfirm={handleConfirmUpdate}
          onCancel={handleCancelUpdate}
        />
      </div>
    </div>
  );
};

export default TodoList;
