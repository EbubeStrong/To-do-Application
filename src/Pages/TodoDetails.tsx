"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import axios, {AxiosResponse} from "axios"
import { Button } from "../../components/components/ui/button"
import { Input } from "../../components/components/ui/input"
import { Checkbox } from "../../components/components/ui/checkbox"
// import { useToast } from "../../components/hooks/use-toast",
import { toast } from 'sonner';
import Spinner from "../components/Spinner"
import type { Todo } from "../types"

const fetchTodo = async (id: string): Promise<Todo> => {
  const storedTodos = JSON.parse(localStorage.getItem("todos") || "[]") as Todo[]
  const localTodo = storedTodos.find((t) => t.id === Number.parseInt(id))
  if (localTodo) {
    return localTodo
  }
  const { data } = await axios.get(`https://jsonplaceholder.typicode.com/todos/${id}`)
  return data
}

const TodoDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [todo, setTodo] = useState<Todo | null>(null)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [editedTitle, setEditedTitle] = useState<string>("")
  const [editedDueDate, setEditedDueDate] = useState<string>("")

  // const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data, isLoading, isError } = useQuery({
    queryKey: ["todo", id],
    queryFn: () => fetchTodo(id!),
    enabled: !!id,
  })

  useEffect(() => {
    if (data) {
      setTodo(data)
      setEditedTitle(data.title)
      setEditedDueDate(data.dueDate || "")
    }
  }, [data])

  const updateTodoMutation = useMutation({
    mutationFn: (updatedTodo: Todo): Promise<AxiosResponse<Todo>> =>
          updatedTodo.isLocal
            ? Promise.resolve({
                data: updatedTodo,
                status: 200,
                statusText: "OK",
                headers: {},
                config: {},
              } as AxiosResponse<Todo>) // Type it as AxiosResponse<Todo>
            : axios.put(
                `https://jsonplaceholder.typicode.com/todos/${updatedTodo.id}`,
                updatedTodo
        ),
    
    onSuccess: (data) => {
      const updatedTodo = (data as any).isLocal ? data : (data as any).data
      setTodo(updatedTodo as Todo)
      queryClient.invalidateQueries({ queryKey: ["todo", id] })
      const storedTodos = JSON.parse(localStorage.getItem("todos") || "[]") as Todo[]
      const updatedTodos = storedTodos.map((t) =>
        t.id === Number.parseInt(id!) ? { ...updatedTodo, isLocal: t.isLocal } : t,
      )
      localStorage.setItem("todos", JSON.stringify(updatedTodos))
      toast("Todo Updated",{
        description: "The todo has been updated successfully.",
      })
    },
    onError: (error) => {
      console.error("Error updating todo:", error)
      toast("Error",{
        description: "An error occurred while updating the todo.",
      })
    },
  })

  const handleUpdate = () => {
    if (isEditing) {
      if (!todo) return
      const updatedTodo: Todo = {
        ...todo,
        title: editedTitle || todo.title,
        dueDate: editedDueDate || todo.dueDate,
      }
      updateTodoMutation.mutate(updatedTodo)
      setIsEditing(false)
    } else {
      setIsEditing(true)
    }
  }

  const handleToggleComplete = () => {
    if (!todo) return
    const updatedTodo: Todo = { ...todo, completed: !todo.completed }
    updateTodoMutation.mutate(updatedTodo)
  }

  if (isLoading) return <Spinner />
  if (isError) return <div>Error: Todo not found</div>
  if (!todo) return <Spinner />

  return (
    <div className="container p-4">
      <h1 className="text-4xl font-bold mb-8">Todo Details</h1>
      <div className="bg-white max-w-[500px] mx-auto p-6 rounded shadow">
        {isEditing ? (
          <>
            <Input type="text" value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} className="mb-4" />
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
            {todo.dueDate && <p className="mb-4">Due: {new Date(todo.dueDate).toLocaleDateString()}</p>}
          </>
        )}
        <div className="flex items-center space-x-2 mb-4">
          <Checkbox id="completed" checked={todo.completed} onCheckedChange={handleToggleComplete} />
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
  )
}

export default TodoDetails
