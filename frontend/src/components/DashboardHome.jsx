"use client"

import { useState, useEffect } from "react"
import { Utensils, Droplet, LineChart, Apple } from 'lucide-react'
import { generateAIRecommendation } from "../utils/ai-service"
import "./DashboardHome.css"

const DashboardHome = ({ userData }) => {
  const [recommendation, setRecommendation] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [waterIntake, setWaterIntake] = useState(0)
  const [todayStats, setTodayStats] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  })
  const [recentMeals, setRecentMeals] = useState([])
  const [weeklyProgress, setWeeklyProgress] = useState([])

  useEffect(() => {
    // Load water intake from localStorage
    const savedWaterIntake = localStorage.getItem("waterIntake")
    if (savedWaterIntake) {
      setWaterIntake(Number.parseInt(savedWaterIntake, 10))
    }

    // Load today's meals from localStorage
    const savedMeals = localStorage.getItem("todayMeals")
    if (savedMeals) {
      const parsedMeals = JSON.parse(savedMeals)
      setRecentMeals(parsedMeals)
      
      // Calculate today's nutrition from meals
      const totals = parsedMeals.reduce((acc, meal) => {
        acc.calories += meal.calories
        acc.protein += meal.protein || 0
        acc.carbs += meal.carbs || 0
        acc.fat += meal.fat || 0
        return acc
      }, { calories: 0, protein: 0, carbs: 0, fat: 0 })
      
      setTodayStats(totals)
    }

    // Load weekly progress from localStorage
    const savedProgress = localStorage.getItem("weeklyProgress")
    if (savedProgress) {
      setWeeklyProgress(JSON.parse(savedProgress))
    } else {
      // Initialize with empty data for the past week
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      const initialProgress = days.map(day => ({
        day,
        calories: 0,
        goal: userData?.calorieGoal || 2000
      }))
      setWeeklyProgress(initialProgress)
      localStorage.setItem("weeklyProgress", JSON.stringify(initialProgress))
    }

    // Generate AI recommendation based on user data
    const loadRecommendation = async () => {
      setIsLoading(true)
      try {
        const aiRecommendation = await generateAIRecommendation(userData)
        setRecommendation(aiRecommendation)
      } catch (error) {
        console.error("Error fetching AI recommendation:", error)
        setRecommendation(
          "Based on your profile and goals, I recommend focusing on protein-rich foods and staying hydrated throughout the day. Consider adding more leafy greens to your meals for essential nutrients.",
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadRecommendation()
  }, [userData])

  const handleAddWater = () => {
    const newIntake = waterIntake + 1
    setWaterIntake(newIntake)
    localStorage.setItem("waterIntake", newIntake.toString())
  }

  const handleAddMeal = () => {
    // This would typically open a modal to add a meal
    // For now, we'll just add a sample meal
    const newMeal = {
      id: Date.now(),
      name: "Quick Snack",
      calories: 150,
      protein: 5,
      carbs: 20,
      fat: 5,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      items: ["Granola Bar"]
    }
    
    const updatedMeals = [newMeal, ...recentMeals].slice(0, 5) // Keep only the 5 most recent meals
    setRecentMeals(updatedMeals)
    localStorage.setItem("todayMeals", JSON.stringify(updatedMeals))
    
    // Update today's stats
    setTodayStats(prev => ({
      calories: prev.calories + newMeal.calories,
      protein: prev.protein + (newMeal.protein || 0),
      carbs: prev.carbs + (newMeal.carbs || 0),
      fat: prev.fat + (newMeal.fat || 0)
    }))
    
    // Update weekly progress for today
    const today = new Date().getDay()
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const todayName = dayNames[today]
    
    const updatedProgress = weeklyProgress.map(day => {
      if (day.day === todayName) {
        return { ...day, calories: day.calories + newMeal.calories }
      }
      return day
    })
    
    setWeeklyProgress(updatedProgress)
    localStorage.setItem("weeklyProgress", JSON.stringify(updatedProgress))
  }

  const calculateProgress = (current, goal) => {
    return Math.min(Math.round((current / goal) * 100), 100)
  }

  return (
    <div className="dashboard-home">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Welcome back, {userData?.name || "User"}!</h2>
        <p className="dashboard-subtitle">Here's your nutrition summary for today</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card summary-card">
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">Daily Summary</h3>
            <div className="dashboard-card-icon">
              <Utensils size={18} />
            </div>
          </div>

          <div className="nutrition-summary">
            <div className="nutrition-item">
              <div className="nutrition-info">
                <span className="nutrition-label">Calories</span>
                <span className="nutrition-value">
                  {todayStats.calories} / {userData?.calorieGoal || 2000}
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${calculateProgress(todayStats.calories, userData?.calorieGoal || 2000)}%` }}
                ></div>
              </div>
            </div>

            <div className="nutrition-item">
              <div className="nutrition-info">
                <span className="nutrition-label">Protein</span>
                <span className="nutrition-value">
                  {todayStats.protein}g / {userData?.nutritionGoals?.protein || 150}g
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-bar-fill protein-fill"
                  style={{
                    width: `${calculateProgress(todayStats.protein, userData?.nutritionGoals?.protein || 150)}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="nutrition-item">
              <div className="nutrition-info">
                <span className="nutrition-label">Carbs</span>
                <span className="nutrition-value">
                  {todayStats.carbs}g / {userData?.nutritionGoals?.carbs || 200}g
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-bar-fill carbs-fill"
                  style={{ width: `${calculateProgress(todayStats.carbs, userData?.nutritionGoals?.carbs || 200)}%` }}
                ></div>
              </div>
            </div>

            <div className="nutrition-item">
              <div className="nutrition-info">
                <span className="nutrition-label">Fat</span>
                <span className="nutrition-value">
                  {todayStats.fat}g / {userData?.nutritionGoals?.fat || 65}g
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-bar-fill fat-fill"
                  style={{ width: `${calculateProgress(todayStats.fat, userData?.nutritionGoals?.fat || 65)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-card water-card">
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">Water Intake</h3>
            <div className="dashboard-card-icon">
              <Droplet size={18} />
            </div>
          </div>

          <div className="water-tracker">
            <div className="water-visual">
              <div className="water-glasses">
                {Array.from({ length: 8 }, (_, i) => (
                  <div
                    key={i}
                    className={`water-glass ${i < waterIntake ? "filled" : ""}`}
                    title={`Glass ${i + 1}`}
                    onClick={() => setWaterIntake(i + 1)}
                  ></div>
                ))}
              </div>
              <div className="water-count">
                <span className="water-amount">{waterIntake}</span>
                <span className="water-unit">/ 8 glasses</span>
              </div>
            </div>
            <button className="btn btn-primary add-water-btn" onClick={handleAddWater}>
              Add Glass
            </button>
          </div>
        </div>

        <div className="dashboard-card ai-card">
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">AI Recommendation</h3>
            <div className="dashboard-card-icon">
              <Apple size={18} />
            </div>
          </div>

          <div className="ai-recommendation">
            {isLoading ? (
              <p className="loading-text">Generating personalized recommendation...</p>
            ) : (
              <p className="recommendation-text">{recommendation}</p>
            )}
          </div>
        </div>

        <div className="dashboard-card meals-card">
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">Recent Meals</h3>
            <button className="btn btn-outline btn-sm" onClick={handleAddMeal}>Add Meal</button>
          </div>

          <div className="meals-list">
            {recentMeals.length > 0 ? (
              recentMeals.map((meal) => (
                <div key={meal.id} className="meal-item">
                  <div className="meal-info">
                    <h4 className="meal-name">{meal.name}</h4>
                    <span className="meal-time">{meal.time}</span>
                  </div>
                  <div className="meal-details">
                    <p className="meal-foods">{meal.items?.join(", ") || "No details"}</p>
                    <span className="meal-calories">{meal.calories} cal</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-meals">
                <p>No meals logged today</p>
                <button className="btn btn-primary btn-sm" onClick={handleAddMeal}>Log your first meal</button>
              </div>
            )}
          </div>
        </div>

        <div className="dashboard-card progress-card">
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">Weekly Progress</h3>
            <div className="dashboard-card-icon">
              <LineChart size={18} />
            </div>
          </div>

          <div className="weekly-chart">
            {weeklyProgress.map((day, index) => (
              <div key={index} className="chart-bar">
                <div className="bar-container">
                  <div
                    className={`bar-fill ${day.calories > day.goal ? "over-goal" : ""}`}
                    style={{ height: `${(day.calories / (day.goal * 1.5)) * 100}%` }}
                  ></div>
                  <div className="goal-line" style={{ bottom: `${(day.goal / (day.goal * 1.5)) * 100}%` }}></div>
                </div>
                <span className="bar-label">{day.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardHome
