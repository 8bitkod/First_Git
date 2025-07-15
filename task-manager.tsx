"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, Plus } from "lucide-react"

interface Task {
  id: number
  title: string
  completed: boolean
}

type FilterType = "all" | "active" | "completed"

export default function TaskManager() {
  // Initial sample tasks
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: "Learn React fundamentals", completed: true },
    { id: 2, title: "Build a task manager app", completed: false },
    { id: 3, title: "Practice JavaScript concepts", completed: false },
    { id: 4, title: "Review state management", completed: true },
  ])

  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [filter, setFilter] = useState<FilterType>("all")

  // Add a new task
  const addTask = () => {
    if (newTaskTitle.trim() !== "") {
      const newTask: Task = {
        id: Date.now(), // Using timestamp as unique ID
        title: newTaskTitle.trim(),
        completed: false,
      }
      setTasks([...tasks, newTask])
      setNewTaskTitle("")
    }
  }

  // Toggle task completion
  const toggleTask = (id: number) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  // Delete a task
  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  // Filter tasks based on current filter
  const filteredTasks = tasks.filter((task) => {
    switch (filter) {
      case "active":
        return !task.completed
      case "completed":
        return task.completed
      default:
        return true
    }
  })

  // Calculate task counts
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((task) => task.completed).length
  const activeTasks = totalTasks - completedTasks

  // Handle Enter key press in input
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addTask()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Task Manager</CardTitle>
            <div className="flex justify-center gap-4 text-sm text-muted-foreground">
              <span>Total: {totalTasks}</span>
              <span>Active: {activeTasks}</span>
              <span>Completed: {completedTasks}</span>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Add new task section */}
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Add a new task..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button onClick={addTask} disabled={!newTaskTitle.trim()}>
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>

            {/* Filter buttons */}
            <div className="flex gap-2 justify-center">
              <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
                All ({totalTasks})
              </Button>
              <Button
                variant={filter === "active" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("active")}
              >
                Active ({activeTasks})
              </Button>
              <Button
                variant={filter === "completed" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("completed")}
              >
                Completed ({completedTasks})
              </Button>
            </div>

            {/* Task list */}
            <div className="space-y-2">
              {filteredTasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {filter === "all" ? "No tasks yet. Add one above!" : `No ${filter} tasks.`}
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                      task.completed ? "bg-muted/50 border-muted" : "bg-background border-border hover:bg-muted/30"
                    }`}
                  >
                    <Checkbox
                      id={`task-${task.id}`}
                      checked={task.completed}
                      onCheckedChange={() => toggleTask(task.id)}
                    />
                    <label
                      htmlFor={`task-${task.id}`}
                      className={`flex-1 cursor-pointer ${
                        task.completed ? "line-through text-muted-foreground" : "text-foreground"
                      }`}
                    >
                      {task.title}
                    </label>
                    {task.completed && (
                      <Badge variant="secondary" className="text-xs">
                        Done
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteTask(task.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      aria-label={`Delete task: ${task.title}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>

            {/* Summary footer */}
            {totalTasks > 0 && (
              <div className="text-center text-sm text-muted-foreground pt-4 border-t">
                {completedTasks === totalTasks
                  ? "🎉 All tasks completed! Great job!"
                  : `${activeTasks} task${activeTasks !== 1 ? "s" : ""} remaining`}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
