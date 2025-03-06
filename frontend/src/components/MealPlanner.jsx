import { useState, useEffect } from "react"
import { Search, Plus, RefreshCw, Save, Trash2, Calendar, Share2 } from "lucide-react"
import { generateMealPlan } from "../utils/ai-service"
import "./MealPlanner.css"

const MealPlanner = ({ userData, setUserData }) => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [mealPlan, setMealPlan] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDay, setSelectedDay] = useState("monday")
  const [customMealPlan, setCustomMealPlan] = useState({})
  const [editingMeal, setEditingMeal] = useState(null)
  const [showShareModal, setShowShareModal] = useState(false)
  const [shareEmail, setShareEmail] = useState("")
  const [showExportModal, setShowExportModal] = useState(false)
  const [exportFormat, setExportFormat] = useState("pdf")

  // Load saved meal plan from localStorage on component mount
  useEffect(() => {
    const savedMealPlan = localStorage.getItem("mealPlan")
    if (savedMealPlan) {
      setMealPlan(JSON.parse(savedMealPlan))
    }
  }, [])

  const handleGenerateMealPlan = async () => {
    setIsGenerating(true)
    try {
      // In a real app, this would call the Gemini API
      const generatedPlan = await generateMealPlan(userData)

      // Create a more comprehensive meal plan with all days of the week
      const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
      const newPlan = {}

      // Use the generated plan for the first few days, then create template data for remaining days
      daysOfWeek.forEach((day, index) => {
        if (generatedPlan && generatedPlan[day]) {
          newPlan[day] = generatedPlan[day]
        } else {
          // Create template data for this day
          newPlan[day] = {
            breakfast: {
              name: `${day.charAt(0).toUpperCase() + day.slice(1)} Breakfast`,
              calories: 300 + Math.floor(Math.random() * 100),
              protein: 15 + Math.floor(Math.random() * 10),
              carbs: 30 + Math.floor(Math.random() * 15),
              fat: 8 + Math.floor(Math.random() * 7),
              ingredients: ["Ingredient 1", "Ingredient 2", "Ingredient 3"],
              instructions: "Instructions for preparing this meal will go here.",
            },
            lunch: {
              name: `${day.charAt(0).toUpperCase() + day.slice(1)} Lunch`,
              calories: 400 + Math.floor(Math.random() * 100),
              protein: 25 + Math.floor(Math.random() * 10),
              carbs: 40 + Math.floor(Math.random() * 15),
              fat: 12 + Math.floor(Math.random() * 8),
              ingredients: ["Ingredient 1", "Ingredient 2", "Ingredient 3", "Ingredient 4"],
              instructions: "Instructions for preparing this meal will go here.",
            },
            dinner: {
              name: `${day.charAt(0).toUpperCase() + day.slice(1)} Dinner`,
              calories: 500 + Math.floor(Math.random() * 100),
              protein: 30 + Math.floor(Math.random() * 10),
              carbs: 45 + Math.floor(Math.random() * 15),
              fat: 15 + Math.floor(Math.random() * 10),
              ingredients: ["Ingredient 1", "Ingredient 2", "Ingredient 3", "Ingredient 4", "Ingredient 5"],
              instructions: "Instructions for preparing this meal will go here.",
            },
            snacks: [
              {
                name: `${day.charAt(0).toUpperCase() + day.slice(1)} Snack 1`,
                calories: 150 + Math.floor(Math.random() * 50),
                protein: 5 + Math.floor(Math.random() * 5),
                carbs: 15 + Math.floor(Math.random() * 10),
                fat: 5 + Math.floor(Math.random() * 5),
              },
              {
                name: `${day.charAt(0).toUpperCase() + day.slice(1)} Snack 2`,
                calories: 120 + Math.floor(Math.random() * 50),
                protein: 4 + Math.floor(Math.random() * 5),
                carbs: 12 + Math.floor(Math.random() * 10),
                fat: 4 + Math.floor(Math.random() * 5),
              },
            ],
          }
        }
      })

      setMealPlan(newPlan)

      // Save to localStorage
      localStorage.setItem("mealPlan", JSON.stringify(newPlan))

      // Also update today's meals in the dashboard
      const today = new Date().getDay()
      const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
      const todayName = dayNames[today]

      if (newPlan[todayName]) {
        const todayMeals = [
          {
            ...newPlan[todayName].breakfast,
            id: Date.now(),
            time: "8:00 AM",
            items: newPlan[todayName].breakfast.ingredients,
          },
          {
            ...newPlan[todayName].lunch,
            id: Date.now() + 1,
            time: "12:30 PM",
            items: newPlan[todayName].lunch.ingredients,
          },
          {
            ...newPlan[todayName].dinner,
            id: Date.now() + 2,
            time: "7:00 PM",
            items: newPlan[todayName].dinner.ingredients,
          },
        ]
        localStorage.setItem("todayMeals", JSON.stringify(todayMeals))
      }
    } catch (error) {
      console.error("Error generating meal plan:", error)
      alert("Failed to generate meal plan. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const filteredMealPlan = () => {
    if (!mealPlan) return {}
    if (!searchQuery) return mealPlan

    const filtered = {}

    Object.keys(mealPlan).forEach((day) => {
      const dayPlan = mealPlan[day]
      const matchesSearch =
        dayPlan.breakfast.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dayPlan.lunch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dayPlan.dinner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dayPlan.snacks.some((snack) => snack.name.toLowerCase().includes(searchQuery.toLowerCase()))

      if (matchesSearch) {
        filtered[day] = dayPlan
      }
    })

    return Object.keys(filtered).length > 0 ? filtered : mealPlan
  }

  const handleDayChange = (day) => {
    setSelectedDay(day)
  }

  const handleEditMeal = (mealType) => {
    // Set the current meal for editing
    setEditingMeal({
      type: mealType,
      day: selectedDay,
      ...mealPlan[selectedDay][mealType],
    })
  }

  const handleSaveMeal = () => {
    if (!editingMeal) return

    // Create a copy of the current meal plan
    const updatedMealPlan = { ...mealPlan }

    // Update the specific meal
    updatedMealPlan[editingMeal.day][editingMeal.type] = {
      name: editingMeal.name,
      calories: Number.parseInt(editingMeal.calories),
      protein: Number.parseInt(editingMeal.protein),
      carbs: Number.parseInt(editingMeal.carbs),
      fat: Number.parseInt(editingMeal.fat),
      ingredients: editingMeal.ingredients,
      instructions: editingMeal.instructions,
    }

    // Update state and localStorage
    setMealPlan(updatedMealPlan)
    localStorage.setItem("mealPlan", JSON.stringify(updatedMealPlan))

    // Clear editing state
    setEditingMeal(null)

    // Show success message
    alert("Meal updated successfully!")
  }

  const handleCancelEdit = () => {
    setEditingMeal(null)
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditingMeal((prev) => ({ ...prev, [name]: value }))
  }

  const handleEditIngredients = (e) => {
    // Convert comma-separated string to array
    const ingredients = e.target.value.split(",").map((item) => item.trim())
    setEditingMeal((prev) => ({ ...prev, ingredients }))
  }

  const handleCreateMeal = () => {
    if (!mealPlan) return

    // Create a new meal in the selected day
    const newMeal = {
      name: "New Custom Meal",
      calories: 400,
      protein: 20,
      carbs: 40,
      fat: 15,
      ingredients: ["Add your ingredients"],
      instructions: "Add your instructions",
    }

    // Set it for editing
    setEditingMeal({
      type: "custom",
      day: selectedDay,
      ...newMeal,
    })
  }

  const handleAddSnack = () => {
    if (!mealPlan) return

    // Create a copy of the current meal plan
    const updatedMealPlan = { ...mealPlan }

    // Add a new snack
    const newSnack = {
      name: "New Snack",
      calories: 100,
      protein: 5,
      carbs: 10,
      fat: 5,
    }

    updatedMealPlan[selectedDay].snacks = [...updatedMealPlan[selectedDay].snacks, newSnack]

    // Update state and localStorage
    setMealPlan(updatedMealPlan)
    localStorage.setItem("mealPlan", JSON.stringify(updatedMealPlan))
  }

  const handleDeleteSnack = (index) => {
    if (!mealPlan) return

    // Create a copy of the current meal plan
    const updatedMealPlan = { ...mealPlan }

    // Remove the snack at the specified index
    updatedMealPlan[selectedDay].snacks = updatedMealPlan[selectedDay].snacks.filter((_, i) => i !== index)

    // Update state and localStorage
    setMealPlan(updatedMealPlan)
    localStorage.setItem("mealPlan", JSON.stringify(updatedMealPlan))
  }

  const handleEditSnack = (index) => {
    setEditingMeal({
      type: "snack",
      day: selectedDay,
      index,
      ...mealPlan[selectedDay].snacks[index],
    })
  }

  const handleSaveSnack = () => {
    if (!editingMeal || editingMeal.type !== "snack") return

    // Create a copy of the current meal plan
    const updatedMealPlan = { ...mealPlan }

    // Update the specific snack
    updatedMealPlan[editingMeal.day].snacks[editingMeal.index] = {
      name: editingMeal.name,
      calories: Number.parseInt(editingMeal.calories),
      protein: Number.parseInt(editingMeal.protein),
      carbs: Number.parseInt(editingMeal.carbs),
      fat: Number.parseInt(editingMeal.fat),
    }

    // Update state and localStorage
    setMealPlan(updatedMealPlan)
    localStorage.setItem("mealPlan", JSON.stringify(updatedMealPlan))

    // Clear editing state
    setEditingMeal(null)

    // Show success message
    alert("Snack updated successfully!")
  }

  const handleSaveCustomMeal = () => {
    if (!editingMeal || editingMeal.type !== "custom") return

    // Ask which meal type this should replace
    const mealType = window.prompt("Which meal should this replace? (breakfast, lunch, dinner)", "breakfast")

    if (!mealType || !["breakfast", "lunch", "dinner"].includes(mealType.toLowerCase())) {
      alert("Invalid meal type. Please choose breakfast, lunch, or dinner.")
      return
    }

    // Create a copy of the current meal plan
    const updatedMealPlan = { ...mealPlan }

    // Update the specific meal
    updatedMealPlan[editingMeal.day][mealType.toLowerCase()] = {
      name: editingMeal.name,
      calories: Number.parseInt(editingMeal.calories),
      protein: Number.parseInt(editingMeal.protein),
      carbs: Number.parseInt(editingMeal.carbs),
      fat: Number.parseInt(editingMeal.fat),
      ingredients: editingMeal.ingredients,
      instructions: editingMeal.instructions,
    }

    // Update state and localStorage
    setMealPlan(updatedMealPlan)
    localStorage.setItem("mealPlan", JSON.stringify(updatedMealPlan))

    // Clear editing state
    setEditingMeal(null)

    // Show confirmation
    alert(`Your custom meal has been saved as ${mealType}!`)
  }

  const handleShareMealPlan = () => {
    setShowShareModal(true)
  }

  const handleExportMealPlan = () => {
    setShowExportModal(true)
  }

  const handleShareSubmit = (e) => {
    e.preventDefault()

    // In a real app, this would send the meal plan to the specified email
    alert(`Meal plan shared with ${shareEmail}!`)

    // Reset form and close modal
    setShareEmail("")
    setShowShareModal(false)
  }

  const handleExportSubmit = (e) => {
    e.preventDefault()

    // In a real app, this would generate and download the meal plan in the specified format
    alert(`Meal plan exported as ${exportFormat.toUpperCase()}!`)

    // Close modal
    setShowExportModal(false)
  }

  const handleAddToCalendar = () => {
    // In a real app, this would add the meal plan to the user's calendar

    // Get the current date
    const today = new Date()
    const dayOfWeek = today.getDay() // 0 = Sunday, 1 = Monday, etc.
    const daysOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]

    // Create calendar entries for the next 7 days
    const calendarData = {}

    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      const dateKey = date.toISOString().split("T")[0]

      const dayName = daysOfWeek[(dayOfWeek + i) % 7]

      if (mealPlan && mealPlan[dayName]) {
        calendarData[dateKey] = mealPlan[dayName]
      }
    }

    // Save to localStorage for the calendar component to use
    const existingCalendarData = localStorage.getItem("mealPlanCalendar")
    const updatedCalendarData = existingCalendarData
      ? { ...JSON.parse(existingCalendarData), ...calendarData }
      : calendarData

    localStorage.setItem("mealPlanCalendar", JSON.stringify(updatedCalendarData))

    alert("Meal plan added to calendar!")
  }

  // If no meal plan is generated yet, show the generator UI
  if (!mealPlan) {
    return (
      <div className="meal-planner">
        <div className="dashboard-header">
          <h2 className="dashboard-title">Meal Planner</h2>
          <p className="dashboard-subtitle">Generate a personalized meal plan based on your goals and preferences</p>
        </div>

        <div className="meal-generator">
          <div className="generator-card">
            <h3 className="generator-title">Generate Your Weekly Meal Plan</h3>
            <p className="generator-description">Our AI will create a customized meal plan based on your:</p>

            <ul className="generator-features">
              <li>
                Daily calorie goal: <strong>{userData?.calorieGoal || 2000} calories</strong>
              </li>
              <li>
                Protein target: <strong>{userData?.nutritionGoals?.protein || 150}g</strong>
              </li>
              <li>
                Dietary restrictions: <strong>{userData?.dietaryRestrictions?.join(", ") || "None"}</strong>
              </li>
              <li>
                Fitness goal:{" "}
                <strong>
                  {userData?.goal === "lose-weight"
                    ? "Weight Loss"
                    : userData?.goal === "gain-muscle"
                      ? "Muscle Gain"
                      : "Maintenance"}
                </strong>
              </li>
            </ul>

            <button
              className="btn btn-primary generate-button"
              onClick={handleGenerateMealPlan}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <RefreshCw size={18} className="spinning" />
                  Generating Plan...
                </>
              ) : (
                <>
                  <Plus size={18} />
                  Generate Meal Plan
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Once meal plan is generated, show the plan
  return (
    <div className="meal-planner">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Your Meal Plan</h2>
        <div className="meal-actions">
          <div className="search-container">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search meals..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <button className="btn btn-primary" onClick={handleCreateMeal}>
            <Plus size={18} />
            Create Custom Meal
          </button>
          <button className="btn btn-outline" onClick={handleAddToCalendar}>
            <Calendar size={18} />
            Add to Calendar
          </button>
          <button className="btn btn-outline" onClick={handleShareMealPlan}>
            <Share2 size={18} />
            Share
          </button>
          <button className="btn btn-outline" onClick={() => setMealPlan(null)}>
            Create New Plan
          </button>
        </div>
      </div>

      <div className="days-navigation">
        {Object.keys(filteredMealPlan()).map((day) => (
          <button
            key={day}
            className={`day-button ${selectedDay === day ? "active" : ""}`}
            onClick={() => handleDayChange(day)}
          >
            {day.charAt(0).toUpperCase() + day.slice(1)}
          </button>
        ))}
      </div>

      {editingMeal ? (
        <div className="meal-edit-form">
          <h3 className="edit-title">Edit {editingMeal.type.charAt(0).toUpperCase() + editingMeal.type.slice(1)}</h3>

          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-input"
              value={editingMeal.name}
              onChange={handleEditChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="calories" className="form-label">
                Calories
              </label>
              <input
                type="number"
                id="calories"
                name="calories"
                className="form-input"
                value={editingMeal.calories}
                onChange={handleEditChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="protein" className="form-label">
                Protein (g)
              </label>
              <input
                type="number"
                id="protein"
                name="protein"
                className="form-input"
                value={editingMeal.protein}
                onChange={handleEditChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="carbs" className="form-label">
                Carbs (g)
              </label>
              <input
                type="number"
                id="carbs"
                name="carbs"
                className="form-input"
                value={editingMeal.carbs}
                onChange={handleEditChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="fat" className="form-label">
                Fat (g)
              </label>
              <input
                type="number"
                id="fat"
                name="fat"
                className="form-input"
                value={editingMeal.fat}
                onChange={handleEditChange}
              />
            </div>
          </div>

          {editingMeal.type !== "snack" && (
            <>
              <div className="form-group">
                <label htmlFor="ingredients" className="form-label">
                  Ingredients (comma-separated)
                </label>
                <textarea
                  id="ingredients"
                  name="ingredients"
                  className="form-input"
                  value={editingMeal.ingredients?.join(", ")}
                  onChange={handleEditIngredients}
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label htmlFor="instructions" className="form-label">
                  Instructions
                </label>
                <textarea
                  id="instructions"
                  name="instructions"
                  className="form-input"
                  value={editingMeal.instructions}
                  onChange={handleEditChange}
                  rows={4}
                />
              </div>
            </>
          )}

          <div className="edit-actions">
            <button className="btn btn-outline" onClick={handleCancelEdit}>
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={
                editingMeal.type === "snack"
                  ? handleSaveSnack
                  : editingMeal.type === "custom"
                    ? handleSaveCustomMeal
                    : handleSaveMeal
              }
            >
              <Save size={16} />
              Save Changes
            </button>
          </div>
        </div>
      ) : (
        <div className="meal-plan-content">
          <div className="meal-section">
            <div className="meal-header">
              <h3 className="meal-title">Breakfast</h3>
              <button className="btn btn-outline btn-sm" onClick={() => handleEditMeal("breakfast")}>
                Edit
              </button>
            </div>
            <div className="meal-card">
              <div className="meal-card-header">
                <h4 className="meal-name">{mealPlan[selectedDay].breakfast.name}</h4>
                <span className="meal-calories">{mealPlan[selectedDay].breakfast.calories} cal</span>
              </div>
              <div className="meal-macros">
                <div className="macro">
                  <span className="macro-value">{mealPlan[selectedDay].breakfast.protein}g</span>
                  <span className="macro-label">Protein</span>
                </div>
                <div className="macro">
                  <span className="macro-value">{mealPlan[selectedDay].breakfast.carbs}g</span>
                  <span className="macro-label">Carbs</span>
                </div>
                <div className="macro">
                  <span className="macro-value">{mealPlan[selectedDay].breakfast.fat}g</span>
                  <span className="macro-label">Fat</span>
                </div>
              </div>
              <div className="meal-details">
                <div className="ingredients">
                  <h5 className="details-title">Ingredients</h5>
                  <ul className="ingredients-list">
                    {mealPlan[selectedDay].breakfast.ingredients.map((ingredient, index) => (
                      <li key={index}>{ingredient}</li>
                    ))}
                  </ul>
                </div>
                <div className="instructions">
                  <h5 className="details-title">Instructions</h5>
                  <p className="instructions-text">{mealPlan[selectedDay].breakfast.instructions}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="meal-section">
            <div className="meal-header">
              <h3 className="meal-title">Lunch</h3>
              <button className="btn btn-outline btn-sm" onClick={() => handleEditMeal("lunch")}>
                Edit
              </button>
            </div>
            <div className="meal-card">
              <div className="meal-card-header">
                <h4 className="meal-name">{mealPlan[selectedDay].lunch.name}</h4>
                <span className="meal-calories">{mealPlan[selectedDay].lunch.calories} cal</span>
              </div>
              <div className="meal-macros">
                <div className="macro">
                  <span className="macro-value">{mealPlan[selectedDay].lunch.protein}g</span>
                  <span className="macro-label">Protein</span>
                </div>
                <div className="macro">
                  <span className="macro-value">{mealPlan[selectedDay].lunch.carbs}g</span>
                  <span className="macro-label">Carbs</span>
                </div>
                <div className="macro">
                  <span className="macro-value">{mealPlan[selectedDay].lunch.fat}g</span>
                  <span className="macro-label">Fat</span>
                </div>
              </div>
              <div className="meal-details">
                <div className="ingredients">
                  <h5 className="details-title">Ingredients</h5>
                  <ul className="ingredients-list">
                    {mealPlan[selectedDay].lunch.ingredients.map((ingredient, index) => (
                      <li key={index}>{ingredient}</li>
                    ))}
                  </ul>
                </div>
                <div className="instructions">
                  <h5 className="details-title">Instructions</h5>
                  <p className="instructions-text">{mealPlan[selectedDay].lunch.instructions}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="meal-section">
            <div className="meal-header">
              <h3 className="meal-title">Dinner</h3>
              <button className="btn btn-outline btn-sm" onClick={() => handleEditMeal("dinner")}>
                Edit
              </button>
            </div>
            <div className="meal-card">
              <div className="meal-card-header">
                <h4 className="meal-name">{mealPlan[selectedDay].dinner.name}</h4>
                <span className="meal-calories">{mealPlan[selectedDay].dinner.calories} cal</span>
              </div>
              <div className="meal-macros">
                <div className="macro">
                  <span className="macro-value">{mealPlan[selectedDay].dinner.protein}g</span>
                  <span className="macro-label">Protein</span>
                </div>
                <div className="macro">
                  <span className="macro-value">{mealPlan[selectedDay].dinner.carbs}g</span>
                  <span className="macro-label">Carbs</span>
                </div>
                <div className="macro">
                  <span className="macro-value">{mealPlan[selectedDay].dinner.fat}g</span>
                  <span className="macro-label">Fat</span>
                </div>
              </div>
              <div className="meal-details">
                <div className="ingredients">
                  <h5 className="details-title">Ingredients</h5>
                  <ul className="ingredients-list">
                    {mealPlan[selectedDay].dinner.ingredients.map((ingredient, index) => (
                      <li key={index}>{ingredient}</li>
                    ))}
                  </ul>
                </div>
                <div className="instructions">
                  <h5 className="details-title">Instructions</h5>
                  <p className="instructions-text">{mealPlan[selectedDay].dinner.instructions}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="meal-section">
            <div className="meal-header">
              <h3 className="meal-title">Snacks</h3>
              <button className="btn btn-primary btn-sm" onClick={handleAddSnack}>
                <Plus size={16} />
                Add Snack
              </button>
            </div>
            <div className="snacks-container">
              {mealPlan[selectedDay].snacks.map((snack, index) => (
                <div key={index} className="snack-card">
                  <div className="snack-actions">
                    <button className="edit-snack-btn" onClick={() => handleEditSnack(index)}>
                      <Save size={14} />
                    </button>
                    <button className="delete-snack-btn" onClick={() => handleDeleteSnack(index)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <h4 className="snack-name">{snack.name}</h4>
                  <div className="snack-macros">
                    <span className="snack-calories">{snack.calories} cal</span>
                    <div className="snack-macro-details">
                      <span>{snack.protein}g protein</span>
                      <span>{snack.carbs}g carbs</span>
                      <span>{snack.fat}g fat</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Share Meal Plan</h3>
              <button className="close-modal-btn" onClick={() => setShowShareModal(false)}>
                &times;
              </button>
            </div>
            <form onSubmit={handleShareSubmit}>
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="form-input"
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                  placeholder="Enter recipient's email"
                  required
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowShareModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Share Meal Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Export Meal Plan</h3>
              <button className="close-modal-btn" onClick={() => setShowExportModal(false)}>
                &times;
              </button>
            </div>
            <form onSubmit={handleExportSubmit}>
              <div className="form-group">
                <label htmlFor="format" className="form-label">
                  Export Format
                </label>
                <select
                  id="format"
                  className="form-input"
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value)}
                >
                  <option value="pdf">PDF</option>
                  <option value="csv">CSV</option>
                  <option value="json">JSON</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowExportModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Export
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default MealPlanner

