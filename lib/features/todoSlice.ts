import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: number
  priority: "low" | "medium" | "high"
  category: string
  dueDate?: string
  tags: string[]
}

export type FilterType = "all" | "active" | "completed" | "overdue"
export type SortType = "createdAt" | "dueDate" | "priority" | "alphabetical"

interface TodoState {
  todos: Todo[]
  filter: FilterType
  sortBy: SortType
  searchQuery: string
  categories: string[]
  selectedCategory: string
}

const initialState: TodoState = {
  todos: [],
  filter: "all",
  sortBy: "createdAt",
  searchQuery: "",
  categories: ["Personal", "Work", "Shopping", "Health"],
  selectedCategory: "all",
}

// Load from localStorage
if (typeof window !== "undefined") {
  const savedTodos = localStorage.getItem("todos")
  if (savedTodos) {
    try {
      initialState.todos = JSON.parse(savedTodos)
    } catch (error) {
      console.error("Error loading todos from localStorage:", error)
    }
  }
}

const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    addTodo: (
      state,
      action: PayloadAction<{ text: string; priority: "low" | "medium" | "high"; category: string; dueDate?: string }>,
    ) => {
      const newTodo: Todo = {
        id: Date.now().toString(),
        text: action.payload.text,
        completed: false,
        createdAt: Date.now(),
        priority: action.payload.priority,
        category: action.payload.category,
        dueDate: action.payload.dueDate,
        tags: [],
      }
      state.todos.push(newTodo)

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("todos", JSON.stringify(state.todos))
      }
    },

    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find((todo) => todo.id === action.payload)
      if (todo) {
        todo.completed = !todo.completed

        // Save to localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("todos", JSON.stringify(state.todos))
        }
      }
    },

    deleteTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter((todo) => todo.id !== action.payload)

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("todos", JSON.stringify(state.todos))
      }
    },

    setFilter: (state, action: PayloadAction<FilterType>) => {
      state.filter = action.payload
    },

    clearCompleted: (state) => {
      state.todos = state.todos.filter((todo) => !todo.completed)

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("todos", JSON.stringify(state.todos))
      }
    },

    editTodo: (state, action: PayloadAction<{ id: string; text: string }>) => {
      const todo = state.todos.find((todo) => todo.id === action.payload.id)
      if (todo) {
        todo.text = action.payload.text
        if (typeof window !== "undefined") {
          localStorage.setItem("todos", JSON.stringify(state.todos))
        }
      }
    },

    setPriority: (state, action: PayloadAction<{ id: string; priority: "low" | "medium" | "high" }>) => {
      const todo = state.todos.find((todo) => todo.id === action.payload.id)
      if (todo) {
        todo.priority = action.payload.priority
        if (typeof window !== "undefined") {
          localStorage.setItem("todos", JSON.stringify(state.todos))
        }
      }
    },

    setDueDate: (state, action: PayloadAction<{ id: string; dueDate: string }>) => {
      const todo = state.todos.find((todo) => todo.id === action.payload.id)
      if (todo) {
        todo.dueDate = action.payload.dueDate
        if (typeof window !== "undefined") {
          localStorage.setItem("todos", JSON.stringify(state.todos))
        }
      }
    },

    addTag: (state, action: PayloadAction<{ id: string; tag: string }>) => {
      const todo = state.todos.find((todo) => todo.id === action.payload.id)
      if (todo && !todo.tags.includes(action.payload.tag)) {
        todo.tags.push(action.payload.tag)
        if (typeof window !== "undefined") {
          localStorage.setItem("todos", JSON.stringify(state.todos))
        }
      }
    },

    removeTag: (state, action: PayloadAction<{ id: string; tag: string }>) => {
      const todo = state.todos.find((todo) => todo.id === action.payload.id)
      if (todo) {
        todo.tags = todo.tags.filter((tag) => tag !== action.payload.tag)
        if (typeof window !== "undefined") {
          localStorage.setItem("todos", JSON.stringify(state.todos))
        }
      }
    },

    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },

    setSortBy: (state, action: PayloadAction<SortType>) => {
      state.sortBy = action.payload
    },

    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload
    },

    addCategory: (state, action: PayloadAction<string>) => {
      if (!state.categories.includes(action.payload)) {
        state.categories.push(action.payload)
      }
    },
  },
})

export const {
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
} = todoSlice.actions
export default todoSlice.reducer
