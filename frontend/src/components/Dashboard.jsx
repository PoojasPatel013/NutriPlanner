"use client"

import { useState, useEffect } from "react"
import MealPlanner from "./MealPlanner"
import NutritionTracker from "./NutritionTracker"
import ProgressTracker from "./ProgressTracker"
import CalendarView from "./CalendarView"
import SettingsView from "./SettingsView"
import DashboardHome from "./DashboardHome"
import "./Dashboard.css"

const Dashboard = ({ activeTab, userData, setUserData }) => {
  const [loading, setLoading] = useState(false)
  const [currentTab, setCurrentTab] = useState(activeTab)

  // Update current tab when activeTab prop changes
  useEffect(() => {
    setCurrentTab(activeTab)
  }, [activeTab])

  // Render the appropriate component based on the active tab
  const renderContent = () => {
    switch (currentTab) {
      case "dashboard":
        return <DashboardHome userData={userData} />
      case "meal-planner":
        return <MealPlanner userData={userData} setUserData={setUserData} />
      case "nutrition":
        return <NutritionTracker userData={userData} />
      case "progress":
        return <ProgressTracker userData={userData} />
      case "calendar":
        return <CalendarView userData={userData} />
      case "settings":
        return <SettingsView userData={userData} setUserData={setUserData} />
      default:
        return <DashboardHome userData={userData} />
    }
  }

  return (
    <main className="dashboard">
      <div className="dashboard-content">
        {loading ? <div className="loading-spinner">Loading...</div> : renderContent()}
      </div>
    </main>
  )
}

export default Dashboard
