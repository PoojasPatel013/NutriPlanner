"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import "./CalendarView.css"

const CalendarView = ({ userData }) => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [mealPlanData, setMealPlanData] = useState({})
  const [workoutData, setWorkoutData] = useState({})
  const [showAddWorkoutModal, setShowAddWorkoutModal] = useState(false)
  const [newWorkout, setNewWorkout] = useState({
    name: "",
    duration: "",
    type: "strength",
  })

  useEffect(() => {
    // Load meal plan data
    const savedMealPlan = localStorage.getItem("mealPlan")
    if (savedMealPlan) {
      const mealPlan = JSON.parse(savedMealPlan)

      // Convert from day-based to date-based format
      const dateBasedMealPlan = {}
      const today = new Date()
      const dayOfWeek = today.getDay() // 0 = Sunday, 1 = Monday, etc.
      const daysOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]

      // Map each day to an actual date starting from the most recent Monday
      for (let i = 0; i < 7; i++) {
        const dayName = daysOfWeek[i]
        const dayOffset = i - dayOfWeek
        const date = new Date(today)
        date.setDate(today.getDate() + dayOffset)
        const dateKey = date.toISOString().split("T")[0]

        if (mealPlan[dayName]) {
          dateBasedMealPlan[dateKey] = mealPlan[dayName]
        }
      }

      setMealPlanData(dateBasedMealPlan)
    }

    // Load workout data
    const savedWorkouts = localStorage.getItem("workoutData")
    if (savedWorkouts) {
      setWorkoutData(JSON.parse(savedWorkouts))
    }
  }, [])

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay()
  }

  const formatDateKey = (date) => {
    return date.toISOString().split("T")[0]
  }

  const handleAddWorkout = () => {
    setShowAddWorkoutModal(true)
  }

  const handleWorkoutSubmit = (e) => {
    e.preventDefault()

    const dateKey = formatDateKey(selectedDate)
    const newWorkoutEntry = {
      name: newWorkout.name,
      duration: Number.parseInt(newWorkout.duration),
      type: newWorkout.type,
    }

    // Add to workout data
    const updatedWorkoutData = { ...workoutData }
    updatedWorkoutData[dateKey] = newWorkoutEntry

    setWorkoutData(updatedWorkoutData)
    localStorage.setItem("workoutData", JSON.stringify(updatedWorkoutData))

    // Reset form and close modal
    setNewWorkout({
      name: "",
      duration: "",
      type: "strength",
    })
    setShowAddWorkoutModal(false)
  }

  const handleWorkoutChange = (e) => {
    const { name, value } = e.target
    setNewWorkout((prev) => ({ ...prev, [name]: value }))
  }

  const handleCreateMealPlan = () => {
    const dateKey = formatDateKey(selectedDate)

    // Check if there's a meal plan for the selected day of the week
    const dayOfWeek = selectedDate.getDay()
    const daysOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    const dayName = daysOfWeek[dayOfWeek]

    // Try to get the meal plan from localStorage
    const savedMealPlan = localStorage.getItem("mealPlan")
    if (savedMealPlan) {
      const mealPlan = JSON.parse(savedMealPlan)

      if (mealPlan[dayName]) {
        // Copy the meal plan for this day to the selected date
        const updatedMealPlanData = { ...mealPlanData }
        updatedMealPlanData[dateKey] = mealPlan[dayName]

        setMealPlanData(updatedMealPlanData)

        // Show confirmation
        alert(`Meal plan created for ${selectedDate.toLocaleDateString()}!`)
        return
      }
    }

    // If no meal plan exists, create a basic one
    const basicMealPlan = {
      breakfast: {
        name: "Basic Breakfast",
        calories: 350,
        ingredients: ["Eggs", "Toast", "Avocado"],
        instructions: "Prepare a simple, nutritious breakfast.",
      },
      lunch: {
        name: "Basic Lunch",
        calories: 450,
        ingredients: ["Chicken", "Rice", "Vegetables"],
        instructions: "Prepare a balanced lunch with protein and vegetables.",
      },
      dinner: {
        name: "Basic Dinner",
        calories: 500,
        ingredients: ["Fish", "Sweet Potato", "Salad"],
        instructions: "Prepare a light dinner with lean protein.",
      },
      snacks: [
        {
          name: "Fruit & Yogurt",
          calories: 180,
        },
        {
          name: "Nuts",
          calories: 150,
        },
      ],
    }

    const updatedMealPlanData = { ...mealPlanData }
    updatedMealPlanData[dateKey] = basicMealPlan

    setMealPlanData(updatedMealPlanData)

    // Show confirmation
    alert(`Basic meal plan created for ${selectedDate.toLocaleDateString()}!`)
  }

  const handleScheduleWorkout = () => {
    setShowAddWorkoutModal(true)
  }

  const handleViewWorkoutDetails = () => {
    const dateKey = formatDateKey(selectedDate)
    const workout = workoutData[dateKey]

    if (workout) {
      alert(`Workout Details:\n\nName: ${workout.name}\nType: ${workout.type}\nDuration: ${workout.duration} minutes`)
    }
  }

  const hasMealPlan = (date) => {
    return mealPlanData[formatDateKey(date)] !== undefined
  }

  const hasWorkout = (date) => {
    return workoutData[formatDateKey(date)] !== undefined
  }

  const renderCalendar = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const daysInMonth = getDaysInMonth(year, month)
    const firstDayOfMonth = getFirstDayOfMonth(year, month)

    const monthName = currentDate.toLocaleString("default", { month: "long" })

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>)
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const dateKey = formatDateKey(date)
      const isToday = new Date().toDateString() === date.toDateString()
      const isSelected = selectedDate.toDateString() === date.toDateString()
      const hasMeal = mealPlanData[dateKey] !== undefined
      const hasExercise = workoutData[dateKey] !== undefined

      days.push(
        <div
          key={day}
          className={`calendar-day ${isToday ? "today" : ""} ${isSelected ? "selected" : ""}`}
          onClick={() => setSelectedDate(date)}
        >
          <div className="day-number">{day}</div>
          <div className="day-indicators">
            {hasMeal && <div className="indicator meal-indicator" title="Meal Plan"></div>}
            {hasExercise && <div className="indicator workout-indicator" title="Workout"></div>}
          </div>
        </div>,
      )
    }

    return (
      <div className="calendar-container">
        <div className="calendar-header">
          <button className="month-nav-button" onClick={() => setCurrentDate(new Date(year, month - 1, 1))}>
            <ChevronLeft size={20} />
          </button>
          <h3 className="current-month">
            {monthName} {year}
          </h3>
          <button className="month-nav-button" onClick={() => setCurrentDate(new Date(year, month + 1, 1))}>
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="calendar-weekdays">
          <div className="weekday">Sun</div>
          <div className="weekday">Mon</div>
          <div className="weekday">Tue</div>
          <div className="weekday">Wed</div>
          <div className="weekday">Thu</div>
          <div className="weekday">Fri</div>
          <div className="weekday">Sat</div>
        </div>

        <div className="calendar-days">{days}</div>
      </div>
    )
  }

  const renderDayDetails = () => {
    const dateKey = formatDateKey(selectedDate)
    const mealPlan = mealPlanData[dateKey]
    const workout = workoutData[dateKey]

    return (
      <div className="day-details">
        <h3 className="details-date">
          {selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </h3>

        <div className="details-section">
          <h4 className="section-title">Meal Plan</h4>
          {mealPlan ? (
            <div className="meal-plan-details">
              <div className="meal-item">
                <div className="meal-header">
                  <h5 className="meal-name">Breakfast</h5>
                  <span className="meal-calories">{mealPlan.breakfast.calories} cal</span>
                </div>
                <p className="meal-description">{mealPlan.breakfast.name}</p>
              </div>

              <div className="meal-item">
                <div className="meal-header">
                  <h5 className="meal-name">Lunch</h5>
                  <span className="meal-calories">{mealPlan.lunch.calories} cal</span>
                </div>
                <p className="meal-description">{mealPlan.lunch.name}</p>
              </div>

              <div className="meal-item">
                <div className="meal-header">
                  <h5 className="meal-name">Dinner</h5>
                  <span className="meal-calories">{mealPlan.dinner.calories} cal</span>
                </div>
                <p className="meal-description">{mealPlan.dinner.name}</p>
              </div>

              <div className="meal-item">
                <div className="meal-header">
                  <h5 className="meal-name">Snacks</h5>
                  <span className="meal-calories">
                    {mealPlan.snacks.reduce((total, snack) => total + snack.calories, 0)} cal
                  </span>
                </div>
                <div className="snack-list">
                  {mealPlan.snacks.map((snack, index) => (
                    <p key={index} className="snack-item">
                      {snack.name} <span className="snack-calories">({snack.calories} cal)</span>
                    </p>
                  ))}
                </div>
              </div>

              <div className="meal-total">
                <span className="total-label">Total Calories:</span>
                <span className="total-value">
                  {mealPlan.breakfast.calories +
                    mealPlan.lunch.calories +
                    mealPlan.dinner.calories +
                    mealPlan.snacks.reduce((total, snack) => total + snack.calories, 0)}{" "}
                  cal
                </span>
              </div>
            </div>
          ) : (
            <div className="empty-details">
              <p>No meal plan for this day</p>
              <button className="btn btn-primary" onClick={handleCreateMealPlan}>
                Create Meal Plan
              </button>
            </div>
          )}
        </div>

        <div className="details-section">
          <h4 className="section-title">Workout</h4>
          {workout ? (
            <div className="workout-details">
              <div className="workout-header">
                <h5 className="workout-name">{workout.name}</h5>
                <span className={`workout-type ${workout.type}`}>{workout.type}</span>
              </div>
              <p className="workout-duration">Duration: {workout.duration} minutes</p>
              <button className="btn btn-outline" onClick={handleViewWorkoutDetails}>
                View Workout Details
              </button>
            </div>
          ) : (
            <div className="empty-details">
              <p>No workout scheduled for this day</p>
              <button className="btn btn-primary" onClick={handleScheduleWorkout}>
                Schedule Workout
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="calendar-view">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Calendar</h2>
        <p className="dashboard-subtitle">View and manage your meal plans and workouts</p>
      </div>

      <div className="calendar-layout">
        <div className="calendar-grid">{renderCalendar()}</div>

        <div className="day-details-container">{renderDayDetails()}</div>
      </div>
      {showAddWorkoutModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Schedule Workout</h3>
              <button className="close-modal-btn" onClick={() => setShowAddWorkoutModal(false)}>
                &times;
              </button>
            </div>
            <form onSubmit={handleWorkoutSubmit}>
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Workout Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-input"
                  value={newWorkout.name}
                  onChange={handleWorkoutChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="duration" className="form-label">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  className="form-input"
                  value={newWorkout.duration}
                  onChange={handleWorkoutChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="type" className="form-label">
                  Workout Type
                </label>
                <select
                  id="type"
                  name="type"
                  className="form-input"
                  value={newWorkout.type}
                  onChange={handleWorkoutChange}
                  required
                >
                  <option value="strength">Strength</option>
                  <option value="cardio">Cardio</option>
                  <option value="flexibility">Flexibility</option>
                  <option value="hiit">HIIT</option>
                  <option value="yoga">Yoga</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowAddWorkoutModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Schedule Workout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default CalendarView

