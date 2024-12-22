import React, { useState } from "react";
import { Button } from "../../components/components/ui/button";
import { Input } from "../../components/components/ui/input";

const TodoForm = ({ onCreateTodo }) => {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const newTodo = {
      id: Date.now(),
      title,
      completed: false,
      dueDate,
      isLocal: true,
    };
    onCreateTodo(newTodo);
    setTitle("");
    setDueDate("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 flex flex-col gap-4 sm:gap-6">
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          type="text"
          placeholder="Enter new todo..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 animate__animated animate__fadeInLeft"
          required
          style={{ animationDelay: "2.5s" }}
        />
        <div className="flex justify-between gap-4  lg:flex-row">
          <Input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 animate__animated animate__fadeInUp"
            required
          style={{ animationDelay: "2.7s" }}
          />
          <Button
            type="submit"
            className="p-3 bg-blue-500 text-white rounded hover:bg-blue-700 animate__animated animate__fadeInUp"
          style={{ animationDelay: "3s" }}
          >
            Add To-do
          </Button>
        </div>
      </div>
    </form>
  );
};

export default TodoForm;
