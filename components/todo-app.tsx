"use client"

import type React from "react"

import { useState } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { addTodo, toggleTodo, deleteTodo, setFilter, clearCompleted, type FilterType } from "@/lib/features/todoSlice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2, Plus, Filter } from "lucide-react"

export default function TodoApp() {
  const [inputValue, setInputValue] = useState("")
  const dispatch = useAppDispatch()
  const { todos, filter } = useAppSelector((state) => state.todos)

  const filteredTodos = todos.filter((todo) => {
    switch (filter) {
      case "active":
        return !todo.completed
      case "completed":
        return todo.completed
      default:
        return true
    }
  })

  const handleAddTodo = () => {
    if (inputValue.trim()) {
      dispatch(
        addTodo({
          text: inputValue.trim(),
          priority: "medium",
          category: "Personal",
        }),
      )
      setInputValue("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddTodo()
    }
  }

  const activeTodosCount = todos.filter((todo) => !todo.completed).length
  const completedTodosCount = todos.filter((todo) => todo.completed).length

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
          <Filter className="w-6 h-6" />
          Todo App with Redux Toolkit
        </CardTitle>
        <div className="flex justify-center gap-4 mt-4">
          <Badge variant="secondary">Active: {activeTodosCount}</Badge>
          <Badge variant="secondary">Completed: {completedTodosCount}</Badge>
          <Badge variant="secondary">Total: {todos.length}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Add Todo Input */}
        <div className="flex gap-2">
          <Input
            placeholder="Add a new todo..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button onClick={handleAddTodo} className="px-6">
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 justify-center">
          {(["all", "active", "completed"] as FilterType[]).map((filterType) => (
            <Button
              key={filterType}
              variant={filter === filterType ? "default" : "outline"}
              onClick={() => dispatch(setFilter(filterType))}
              className="capitalize"
            >
              {filterType}
            </Button>
          ))}
        </div>

        {/* Todo List */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {filter === "all" ? "No todos yet. Add one above!" : `No ${filter} todos.`}
            </div>
          ) : (
            filteredTodos.map((todo) => (
              <div
                key={todo.id}
                className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Checkbox checked={todo.completed} onCheckedChange={() => dispatch(toggleTodo(todo.id))} />
                <span className={`flex-1 ${todo.completed ? "line-through text-gray-500" : "text-gray-800"}`}>
                  {todo.text}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => dispatch(deleteTodo(todo.id))}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))
          )}
        </div>

        {/* Clear Completed */}
        {completedTodosCount > 0 && (
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => dispatch(clearCompleted())}
              className="text-red-600 hover:text-red-700"
            >
              Clear Completed ({completedTodosCount})
            </Button>
          </div>
        )}

        {/* Redux Toolkit Info */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Redux Toolkit Features:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Immutable state updates with Immer</li>
            <li>• Type-safe actions and reducers</li>
            <li>• localStorage persistence</li>
            <li>• Efficient re-renders with React-Redux</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
