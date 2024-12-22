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
import TodoForm from "../components/TodoForm";
import Spinner from "../components/Spinner";
import ConfirmDialog from "../components/ConfirmDialog";
import Sidebar from "../components/SideBar";
import { FiMenu, FiX } from "react-icons/fi";

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
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

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
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className="flex-grow overflow-y-auto md:px-2">
        {/* Header with Hamburger and Title */}
        <div
          className="flex items-center justify-between p-2 font-bold mb-4 w-[100%] sticky top-0 z-10 animate__animated animate__fadeIn animate__delay-1s"
          style={{
            boxShadow: "10px 4px 6px rgba(0, 0, 0, 0.1)",
            background: "white",
          }}
        >
          {/* Hamburger for Small Screens */}
          <h1
            className="text-4xl ml-4 animate__animated animate__fadeIn"
            style={{ animationDelay: "1.5s" }}
          >
            To-do List
          </h1>

          <button
            className="md:hidden p-2 focus:outline-none"
            onClick={toggleSidebar}
          >
            {/* {isSidebarOpen ? "Close" : "Menu"} */}
            {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Overlay for Small Screens */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={toggleSidebar}
          />
        )}

        <div
          className="max-w-[1100px] mx-auto p-6 animate__animated animate__fadeIn animate__delay-2s"
          style={{ boxShadow: "inset 0 4px 6px rgba(0, 0, 0, 0.1)" }}
        >
          <TodoForm onCreateTodo={handleCreateTodo} />
          <div className="mb-4 flex gap-4">
            <Input
              type="text"
              placeholder="Search todos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow
               animate__animated animate__fadeInLeft"
              style={{ animationDelay: "2.6s" }}
            />
            <Select
              onValueChange={setFilter}
              defaultValue={filter}
              // className="
            >
              <SelectTrigger
                className="w-[180px] animate__animated animate__fadeInUp"
                style={{ animationDelay: "2.7s" }}
              >
                <SelectValue placeholder="Filter todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="incomplete">Incomplete</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={setSortBy} defaultValue={sortBy}>
              <SelectTrigger
                className="w-[180px] animate__animated animate__fadeInUp"
                style={{ animationDelay: "2.8s" }}
              >
                <SelectValue placeholder="Sort todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="a-z">A-Z</SelectItem>
                <SelectItem value="z-a">Z-A</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <ul
            className="space-y-4 animate__animated animate__fadeIn"
            style={{ animationDelay: "4s" }}
          >
            {currentTodos.map((todo, index) => (
              <li
                key={todo.id}
                className={`p-4  rounded shadow flex justify-between items-center w-[100%] sm:space-x-4 ${
                  todo.completed ? "bg-green-100" : "bg-red-50"
                } animate__animated animate__fadeInLeft`}
                style={{ maxWidth: "100%", animationDelay: `${index * 1.5}s` }}
              >
                <div className="w-[100%]">
                  <Link
                    to={`/todo/${todo.id}`}
                    className="text-lg font-semibold text-blue-600 w-[100%] hover:text-blue-800"
                  >
                    {todo.title}
                  </Link>
                  <p>{todo.completed ? "Completed" : "Incomplete"}</p>
                  {todo.dueDate && (
                    <p>Due: {new Date(todo.dueDate).toLocaleDateString()}</p>
                  )}
                </div>
                <div className="space-x-3 space-y-3 lg:flex-row lg:items-center sm:flex sm:flex-col sm:gap-2.5">
                  <Button
                    onClick={() => handleUpdateTodo(todo)}
                    variant="outline"
                    className="sm:break-words"
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
          <div className="mt-8 flex flex-col justify-center items-center gap-4 space-x-2">
            <div>
              {pageRange.map((page) => (
                <Button
                  key={page}
                  onClick={() => paginate(page)}
                  variant={currentPage === page ? "default" : "outline"}
                >
                  {page}
                </Button>
              ))}
            </div>

            <div className="flex gap-2">
              {startPage > rangeSize && (
                <Button onClick={() => paginate(startPage - rangeSize)}>
                  Previous
                </Button>
              )}

              {endPage < totalPages && (
                <Button onClick={() => paginate(endPage + 1)}>Next</Button>
              )}
            </div>
          </div>

          {/* Floating Add Button */}
          <button
            onClick={() => setIsPopupOpen(true)}
            className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700"
          >
            +
          </button>

          {/* Popup for Creating Todo */}
          {isPopupOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded shadow-lg  max-w-screen-sm md:w-[500px] ">
                <h2 className="text-xl font-bold mb-4">Add New Todo</h2>
                <TodoForm onCreateTodo={handleCreateTodo} />
                <Button
                  onClick={() => setIsPopupOpen(false)}
                  variant="outline"
                  className="mt-4"
                >
                  Close
                </Button>
              </div>
            </div>
          )}

          <ConfirmDialog
            isOpen={confirmDialogOpen}
            onConfirm={handleConfirmUpdate}
            onCancel={handleCancelUpdate}
          />
        </div>
      </div>
    </div>
  );
};

export default TodoList;
