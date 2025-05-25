"use client"

import { useState, useMemo } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { useDebounce } from "@/hooks/useDebounce"
import { useToggle } from "@/hooks/useToggle"
import {
  addTodo,
  toggleTodo,
  deleteTodo,
  setFilter,
  clearCompleted,
  editTodo,
  setPriority,
  setDueDate,
  addTag,
  removeTag,
  setSearchQuery,
  setSortBy,
  setSelectedCategory,
  addCategory,
  type FilterType,
  type SortType,
  type Todo,
} from "@/lib/features/todoSlice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Trash2, Plus, Filter, Search, Calendar, Tag, Edit, AlertCircle, Star, BarChart3 } from "lucide-react"

export default function AdvancedTodoApp() {
  const [newTodoText, setNewTodoText] = useState("")
  const [newTodoPriority, setNewTodoPriority] = useState<"low" | "medium" | "high">("medium")
  const [newTodoCategory, setNewTodoCategory] = useState("Personal")
  const [newTodoDueDate, setNewTodoDueDate] = useState("")
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [editText, setEditText] = useState("")
  const [newTag, setNewTag] = useState("")
  const [newCategory, setNewCategory] = useState("")
  const [showAddDialog, toggleAddDialog] = useToggle(false)
  const [showStatsDialog, toggleStatsDialog] = useToggle(false)

  const dispatch = useAppDispatch()
  const { todos, filter, sortBy, searchQuery, categories, selectedCategory } = useAppSelector((state) => state.todos)

  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  const filteredAndSortedTodos = useMemo(() => {
    const filtered = todos.filter((todo) => {
      // Filter by completion status
      const statusMatch = (() => {
        switch (filter) {
          case "active":
            return !todo.completed
          case "completed":
            return todo.completed
          case "overdue":
            return todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.completed
          default:
            return true
        }
      })()

      // Filter by category
      const categoryMatch = selectedCategory === "all" || todo.category === selectedCategory

      // Filter by search query
      const searchMatch =
        !debouncedSearchQuery ||
        todo.text.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        todo.tags.some((tag) => tag.toLowerCase().includes(debouncedSearchQuery.toLowerCase()))

      return statusMatch && categoryMatch && searchMatch
    })

    // Sort todos
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        case "dueDate":
          if (!a.dueDate && !b.dueDate) return 0
          if (!a.dueDate) return 1
          if (!b.dueDate) return -1
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        case "alphabetical":
          return a.text.localeCompare(b.text)
        default:
          return b.createdAt - a.createdAt
      }
    })

    return filtered
  }, [todos, filter, selectedCategory, debouncedSearchQuery, sortBy])

  const stats = useMemo(() => {
    const total = todos.length
    const completed = todos.filter((t) => t.completed).length
    const active = total - completed
    const overdue = todos.filter((t) => t.dueDate && new Date(t.dueDate) < new Date() && !t.completed).length
    const highPriority = todos.filter((t) => t.priority === "high" && !t.completed).length

    const categoryStats = categories.map((cat) => ({
      name: cat,
      total: todos.filter((t) => t.category === cat).length,
      completed: todos.filter((t) => t.category === cat && t.completed).length,
    }))

    return { total, completed, active, overdue, highPriority, categoryStats }
  }, [todos, categories])

  const handleAddTodo = () => {
    if (newTodoText.trim()) {
      dispatch(
        addTodo({
          text: newTodoText.trim(),
          priority: newTodoPriority,
          category: newTodoCategory,
          dueDate: newTodoDueDate || undefined,
        }),
      )
      setNewTodoText("")
      setNewTodoDueDate("")
      toggleAddDialog()
    }
  }

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo)
    setEditText(todo.text)
  }

  const saveEdit = () => {
    if (editingTodo && editText.trim()) {
      dispatch(editTodo({ id: editingTodo.id, text: editText.trim() }))
      setEditingTodo(null)
      setEditText("")
    }
  }

  const addNewTag = (todoId: string) => {
    if (newTag.trim()) {
      dispatch(addTag({ id: todoId, tag: newTag.trim() }))
      setNewTag("")
    }
  }

  const addNewCategory = () => {
    if (newCategory.trim()) {
      dispatch(addCategory(newCategory.trim()))
      setNewCategory("")
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const isOverdue = (dueDate?: string) => {
    return dueDate && new Date(dueDate) < new Date()
  }

  return (
    <div className="space-y-6">
      <Card className="w-full max-w-4xl mx-auto shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Filter className="w-6 h-6" />
              Advanced Todo Manager
            </CardTitle>
            <div className="flex gap-2">
              <Dialog open={showStatsDialog} onOpenChange={toggleStatsDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Stats
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Todo Statistics</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded">
                        <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                        <div className="text-sm text-blue-800">Total</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded">
                        <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                        <div className="text-sm text-green-800">Completed</div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded">
                        <div className="text-2xl font-bold text-orange-600">{stats.active}</div>
                        <div className="text-sm text-orange-800">Active</div>
                      </div>
                      <div className="text-center p-3 bg-red-50 rounded">
                        <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
                        <div className="text-sm text-red-800">Overdue</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Category Breakdown</h4>
                      {stats.categoryStats.map((cat) => (
                        <div key={cat.name} className="flex justify-between items-center py-1">
                          <span className="text-sm">{cat.name}</span>
                          <span className="text-sm text-gray-600">
                            {cat.completed}/{cat.total}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={showAddDialog} onOpenChange={toggleAddDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Todo
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Todo</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="todo-text">Todo Text</Label>
                      <Textarea
                        id="todo-text"
                        placeholder="What needs to be done?"
                        value={newTodoText}
                        onChange={(e) => setNewTodoText(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="priority">Priority</Label>
                        <Select
                          value={newTodoPriority}
                          onValueChange={(value: "low" | "medium" | "high") => setNewTodoPriority(value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select value={newTodoCategory} onValueChange={setNewTodoCategory}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat} value={cat}>
                                {cat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="due-date">Due Date (Optional)</Label>
                      <Input
                        id="due-date"
                        type="date"
                        value={newTodoDueDate}
                        onChange={(e) => setNewTodoDueDate(e.target.value)}
                      />
                    </div>

                    <Button onClick={handleAddTodo} className="w-full">
                      Add Todo
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-4">
            <Badge variant="secondary">Total: {stats.total}</Badge>
            <Badge variant="secondary">Active: {stats.active}</Badge>
            <Badge variant="secondary">Completed: {stats.completed}</Badge>
            {stats.overdue > 0 && <Badge variant="destructive">Overdue: {stats.overdue}</Badge>}
            {stats.highPriority > 0 && (
              <Badge variant="secondary" className="bg-red-100 text-red-800">
                High Priority: {stats.highPriority}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search todos..."
                value={searchQuery}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                className="pl-10"
              />
            </div>

            <Select value={filter} onValueChange={(value: FilterType) => dispatch(setFilter(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Todos</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedCategory} onValueChange={(value) => dispatch(setSelectedCategory(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(value: SortType) => dispatch(setSortBy(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Date Created</SelectItem>
                <SelectItem value="dueDate">Due Date</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="alphabetical">Alphabetical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Add Category */}
          <div className="flex gap-2">
            <Input
              placeholder="Add new category..."
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addNewCategory()}
            />
            <Button onClick={addNewCategory} variant="outline">
              Add Category
            </Button>
          </div>

          {/* Todo List */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredAndSortedTodos.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No todos found. Try adjusting your filters or add a new todo!
              </div>
            ) : (
              filteredAndSortedTodos.map((todo) => (
                <Card
                  key={todo.id}
                  className={`p-4 ${todo.completed ? "opacity-75" : ""} ${isOverdue(todo.dueDate) && !todo.completed ? "border-red-300 bg-red-50" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={todo.completed}
                      onCheckedChange={() => dispatch(toggleTodo(todo.id))}
                      className="mt-1"
                    />

                    <div className="flex-1 space-y-2">
                      {editingTodo?.id === todo.id ? (
                        <div className="flex gap-2">
                          <Input
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && saveEdit()}
                          />
                          <Button onClick={saveEdit} size="sm">
                            Save
                          </Button>
                          <Button onClick={() => setEditingTodo(null)} variant="outline" size="sm">
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <div className={`${todo.completed ? "line-through text-gray-500" : "text-gray-800"}`}>
                          {todo.text}
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2 items-center">
                        <Badge className={getPriorityColor(todo.priority)}>
                          {todo.priority === "high" && <Star className="w-3 h-3 mr-1" />}
                          {todo.priority}
                        </Badge>

                        <Badge variant="outline">{todo.category}</Badge>

                        {todo.dueDate && (
                          <Badge variant={isOverdue(todo.dueDate) && !todo.completed ? "destructive" : "secondary"}>
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(todo.dueDate).toLocaleDateString()}
                          </Badge>
                        )}

                        {isOverdue(todo.dueDate) && !todo.completed && (
                          <Badge variant="destructive">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Overdue
                          </Badge>
                        )}
                      </div>

                      {todo.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {todo.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              <Tag className="w-3 h-3 mr-1" />
                              {tag}
                              <button
                                onClick={() => dispatch(removeTag({ id: todo.id, tag }))}
                                className="ml-1 text-red-500 hover:text-red-700"
                              >
                                ×
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Input
                          placeholder="Add tag..."
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && addNewTag(todo.id)}
                          className="text-xs h-8"
                        />
                        <Button onClick={() => addNewTag(todo.id)} size="sm" variant="outline">
                          <Tag className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex gap-1">
                      <Select
                        value={todo.priority}
                        onValueChange={(value: "low" | "medium" | "high") =>
                          dispatch(setPriority({ id: todo.id, priority: value }))
                        }
                      >
                        <SelectTrigger className="w-20 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Med</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>

                      <Input
                        type="date"
                        value={todo.dueDate || ""}
                        onChange={(e) => dispatch(setDueDate({ id: todo.id, dueDate: e.target.value }))}
                        className="w-32 h-8"
                      />

                      <Button onClick={() => handleEditTodo(todo)} size="sm" variant="ghost">
                        <Edit className="w-4 h-4" />
                      </Button>

                      <Button
                        onClick={() => dispatch(deleteTodo(todo.id))}
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* Clear Completed */}
          {stats.completed > 0 && (
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => dispatch(clearCompleted())}
                className="text-red-600 hover:text-red-700"
              >
                Clear Completed ({stats.completed})
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
