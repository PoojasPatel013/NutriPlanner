"use client"

import { useState, useEffect } from "react"
import { Search, Plus, RefreshCw, Save, Trash2 } from "lucide-react"
import { generateMealPlan } from "../utils/ai-service"
import "./MealPlanner.css"

const MealPlanner = ({ userData, setUserData }) => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [mealPlan, setMealPlan] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDay, setSelectedDay] = useState("monday")
  const [customMealPlan, setCustomMealPlan] = useState({})
  const [editingMeal, setEditingMeal] = useState(null)

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

      // If no plan is returned from the API, create a basic structure
      const newPlan = generatedPlan || {
        monday: {
          breakfast: {
            name: "Greek Yogurt Parfait",
            calories: 320,
            protein: 22,
            carbs: 40,
            fat: 8,
            ingredients: ["Greek yogurt", "Mixed berries", "Granola", "Honey"],
            instructions: "Layer yogurt, berries, and granola in a bowl. Drizzle with honey.",
          },
          lunch: {
            name: "Quinoa Salad Bowl",
            calories: 450,
            protein: 15,
            carbs: 65,
            fat: 15,
            ingredients: [
              "Quinoa",
              "Cucumber",
              "Cherry tomatoes",
              "Avocado",
              "Feta cheese",
              "Olive oil",
              "Lemon juice",
            ],
            instructions:
              "Mix cooked quinoa with chopped vegetables. Add feta cheese and dress with olive oil and lemon juice.",
          },
          dinner: {
            name: "Baked Salmon with Roasted Vegetables",
            calories: 520,
            protein: 35,
            carbs: 30,
            fat: 25,
            ingredients: ["Salmon fillet", "Broccoli", "Bell peppers", "Zucchini", "Olive oil", "Garlic", "Lemon"],
            instructions:
              "Season salmon with garlic, salt, and pepper. Bake at 400°F for 15 minutes. Roast vegetables with olive oil.",
          },
          snacks: [
            {
              name: "Apple with Almond Butter",
              calories: 200,
              protein: 5,
              carbs: 25,
              fat: 10,
            },
            {
              name: "Protein Shake",
              calories: 150,
              protein: 20,
              carbs: 5,
              fat: 3,
            },
          ],
        },
        tuesday: {
          breakfast: {
            name: "Veggie Omelette",
            calories: 350,
            protein: 25,
            carbs: 10,
            fat: 22,
            ingredients: ["Eggs", "Spinach", "Bell peppers", "Onion", "Feta cheese"],
            instructions: "Whisk eggs, pour into a hot pan. Add vegetables and cheese. Fold and cook until set.",
          },
          lunch: {
            name: "Turkey Avocado Wrap",
            calories: 420,
            protein: 30,
            carbs: 35,
            fat: 18,
            ingredients: ["Whole grain wrap", "Turkey breast", "Avocado", "Lettuce", "Tomato", "Greek yogurt"],
            instructions:
              "Spread Greek yogurt on wrap. Layer with turkey, avocado, lettuce, and tomato. Roll up and enjoy.",
          },
          dinner: {
            name: "Lentil Curry with Brown Rice",
            calories: 480,
            protein: 20,
            carbs: 70,
            fat: 12,
            ingredients: ["Lentils", "Brown rice", "Onion", "Garlic", "Curry powder", "Coconut milk", "Spinach"],
            instructions:
              "Sauté onion and garlic. Add lentils, curry powder, and coconut milk. Simmer until lentils are tender. Serve over brown rice.",
          },
          snacks: [
            {
              name: "Greek Yogurt with Berries",
              calories: 180,
              protein: 15,
              carbs: 20,
              fat: 2,
            },
            {
              name: "Mixed Nuts",
              calories: 170,
              protein: 6,
              carbs: 5,
              fat: 15,
            },
          ],
        },
        wednesday: {
          breakfast: {
            name: "Overnight Oats",
            calories: 350,
            protein: 15,
            carbs: 55,
            fat: 10,
            ingredients: ["Rolled oats", "Almond milk", "Chia seeds", "Banana", "Peanut butter"],
            instructions: "Mix oats, milk, and chia seeds. Refrigerate overnight. Top with banana and peanut butter.",
          },
          lunch: {
            name: "Mediterranean Bowl",
            calories: 420,
            protein: 18,
            carbs: 45,
            fat: 20,
            ingredients: ["Chickpeas", "Cucumber", "Tomatoes", "Olives", "Feta", "Olive oil", "Lemon juice"],
            instructions: "Combine all ingredients in a bowl. Drizzle with olive oil and lemon juice.",
          },
          dinner: {
            name: "Grilled Chicken with Sweet Potato",
            calories: 480,
            protein: 40,
            carbs: 35,
            fat: 15,
            ingredients: ["Chicken breast", "Sweet potato", "Broccoli", "Olive oil", "Herbs"],
            instructions: "Grill chicken with herbs. Roast sweet potato and broccoli with olive oil.",
          },
          snacks: [
            {
              name: "Protein Bar",
              calories: 200,
              protein: 15,
              carbs: 20,
              fat: 8,
            },
            {
              name: "Carrot Sticks with Hummus",
              calories: 150,
              protein: 5,
              carbs: 15,
              fat: 7,
            },
          ],
        },
      }

      setMealPlan(newPlan)

      // Save to localStorage
      localStorage.setItem("mealPlan", JSON.stringify(newPlan))
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
      calories: editingMeal.calories,
      protein: editingMeal.protein,
      carbs: editingMeal.carbs,
      fat: editingMeal.fat,
      ingredients: editingMeal.ingredients,
      instructions: editingMeal.instructions,
    }

    // Update state and localStorage
    setMealPlan(updatedMealPlan)
    localStorage.setItem("mealPlan", JSON.stringify(updatedMealPlan))

    // Clear editing state
    setEditingMeal(null)
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
      calories: editingMeal.calories,
      protein: editingMeal.protein,
      carbs: editingMeal.carbs,
      fat: editingMeal.fat,
    }

    // Update state and localStorage
    setMealPlan(updatedMealPlan)
    localStorage.setItem("mealPlan", JSON.stringify(updatedMealPlan))

    // Clear editing state
    setEditingMeal(null)
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
          <button className="btn btn-outline" onClick={() => setMealPlan(null)}>
            Create New Plan
          </button>
        </div>
      </div>

      <div className="days-navigation">
        {Object.keys(mealPlan).map((day) => (
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
              onClick={editingMeal.type === "snack" ? handleSaveSnack : handleSaveMeal}
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
    </div>
  )
}

export default MealPlanner

