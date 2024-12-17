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
    <form
      onSubmit={handleSubmit}
      className="mb-8 flex flex-col gap-4 sm:gap-6 md:flex-row lg:gap-8 flex-wrap"
    >
      <Input
        type="text"
        placeholder="Enter new todo..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="flex-grow"
      />
      <Input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />
      <Button type="submit" className=" hover:bg-green-700" style={{width: "100px"}}>
        Add Todo
      </Button>
    </form>
  );
};

export default TodoForm;
