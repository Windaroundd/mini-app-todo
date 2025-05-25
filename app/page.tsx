"use client";

import { Provider } from "react-redux";
import { store } from "@/lib/store";
import TodoApp from "@/components/todo-app";
import DebounceDemo from "@/components/debounce-demo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdvancedTodoApp from "@/components/advanced-todo-app";
import PomodoroTimer from "@/components/pomodoro-timer";

export default function Home() {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
            React Hooks & Redux Toolkit Demo
          </h1>

          <Tabs defaultValue="todo" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="todo" className="text-sm">
                Basic Todo
              </TabsTrigger>
              <TabsTrigger value="advanced" className="text-sm">
                Advanced Todo
              </TabsTrigger>
            </TabsList>

            <TabsContent value="todo">
              <TodoApp />
            </TabsContent>

            <TabsContent value="advanced">
              <AdvancedTodoApp />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Provider>
  );
}
