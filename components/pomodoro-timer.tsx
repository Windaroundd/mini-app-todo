"use client"

import React, { useState } from "react"
import { useTimer } from "@/hooks/useTimer"
import { useToggle } from "@/hooks/useToggle"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, Pause, RotateCcw, Coffee, Clock, Target } from "lucide-react"

type TimerMode = "work" | "shortBreak" | "longBreak"

const TIMER_DURATIONS = {
  work: 25 * 60, // 25 minutes
  shortBreak: 5 * 60, // 5 minutes
  longBreak: 15 * 60, // 15 minutes
}

export default function PomodoroTimer() {
  const [mode, setMode] = useState<TimerMode>("work")
  const [cycles, setCycles] = useState(0)
  const [customDuration, setCustomDuration] = useState(25)
  const [isCustomMode, toggleCustomMode] = useToggle(false)

  const duration = isCustomMode ? customDuration * 60 : TIMER_DURATIONS[mode]
  const { time, isRunning, start, pause, reset } = useTimer(0)

  const progress = (time / duration) * 100
  const remainingTime = Math.max(0, duration - time)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleModeChange = (newMode: TimerMode) => {
    setMode(newMode)
    reset()
    if (newMode === "work" && mode !== "work") {
      setCycles((prev) => prev + 1)
    }
  }

  const handleReset = () => {
    reset()
    if (mode === "work") {
      setCycles(0)
    }
  }

  const getModeColor = (currentMode: TimerMode) => {
    switch (currentMode) {
      case "work":
        return "bg-red-500"
      case "shortBreak":
        return "bg-green-500"
      case "longBreak":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const getModeIcon = (currentMode: TimerMode) => {
    switch (currentMode) {
      case "work":
        return <Target className="w-4 h-4" />
      case "shortBreak":
        return <Coffee className="w-4 h-4" />
      case "longBreak":
        return <Coffee className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  // Auto-switch modes when timer completes
  React.useEffect(() => {
    if (time >= duration && isRunning) {
      pause()

      // Auto-switch to next mode
      if (mode === "work") {
        const nextMode = cycles > 0 && cycles % 4 === 0 ? "longBreak" : "shortBreak"
        handleModeChange(nextMode)
      } else {
        handleModeChange("work")
      }

      // Browser notification (if permission granted)
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(`${mode === "work" ? "Work" : "Break"} session completed!`, {
          body: `Time for a ${mode === "work" ? "break" : "work session"}`,
          icon: "/favicon.ico",
        })
      }
    }
  }, [time, duration, isRunning, mode, cycles])

  // Request notification permission
  React.useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
    }
  }, [])

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
          <Clock className="w-6 h-6" />
          Pomodoro Timer
        </CardTitle>
        <div className="flex justify-center gap-2 mt-4">
          <Badge variant="secondary">Cycles: {cycles}</Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            {getModeIcon(mode)}
            {mode.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Timer Display */}
        <div className="text-center">
          <div className="text-6xl font-mono font-bold text-gray-800 mb-4">{formatTime(remainingTime)}</div>

          <Progress
            value={progress}
            className="h-3 mb-4"
            style={{
              background: `linear-gradient(to right, ${getModeColor(mode)} ${progress}%, #e5e7eb ${progress}%)`,
            }}
          />

          <div className="text-sm text-gray-600">
            {progress > 0 ? `${Math.round(progress)}% complete` : "Ready to start"}
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-2">
          <Button onClick={isRunning ? pause : start} className={`${getModeColor(mode)} hover:opacity-90`}>
            {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isRunning ? "Pause" : "Start"}
          </Button>

          <Button onClick={handleReset} variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>

        {/* Mode Selection */}
        <div className="grid grid-cols-3 gap-2">
          {(["work", "shortBreak", "longBreak"] as TimerMode[]).map((timerMode) => (
            <Button
              key={timerMode}
              variant={mode === timerMode ? "default" : "outline"}
              onClick={() => handleModeChange(timerMode)}
              className="text-xs"
            >
              {timerMode === "work" && "Work"}
              {timerMode === "shortBreak" && "Short Break"}
              {timerMode === "longBreak" && "Long Break"}
            </Button>
          ))}
        </div>

        {/* Custom Timer */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={isCustomMode} onChange={toggleCustomMode} className="rounded" />
            <label className="text-sm">Custom Duration</label>
          </div>

          {isCustomMode && (
            <Select
              value={customDuration.toString()}
              onValueChange={(value) => setCustomDuration(Number.parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 minutes</SelectItem>
                <SelectItem value="10">10 minutes</SelectItem>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="20">20 minutes</SelectItem>
                <SelectItem value="25">25 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">60 minutes</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Tips */}
        <div className="bg-blue-50 p-3 rounded-lg text-sm">
          <h4 className="font-semibold text-blue-800 mb-1">Pomodoro Technique:</h4>
          <ul className="text-blue-700 space-y-1">
            <li>• Work for 25 minutes, then take a 5-minute break</li>
            <li>• After 4 cycles, take a longer 15-minute break</li>
            <li>• Stay focused during work sessions</li>
            <li>• Use breaks to rest and recharge</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
