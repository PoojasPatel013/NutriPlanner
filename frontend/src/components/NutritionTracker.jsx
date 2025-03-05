"use client"

import { useState, useEffect } from "react"
import { PieChart, BarChart, Plus, Search, X } from 'lucide-react'
import "./NutritionTracker.css"

const NutritionTracker = ({ userData }) => {
  const [activeView, setActiveView] = useState('daily')
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddFoodModal, setShowAddFoodModal] = useState(false)
  const [newFood, setNewFood] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    servingSize: '',
    mealType: 'breakfast'
  })
  
  // State for food database and daily food log
  const [foodDatabase, setFoodDatabase] = useState([])
  const [dailyFoodLog, setDailyFoodLog] = useState([])
  const [dailyTotals, setDailyTotals] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0 })
  const [nutritionHistory, setNutritionHistory] = useState([])

  // Load data from localStorage on component mount
  useEffect(() => {
    // Load food database
    const savedFoodDatabase = localStorage.getItem("foodDatabase")
    if (savedFoodDatabase) {
      setFoodDatabase(JSON.parse(savedFoodDatabase))
    } else {
      // Initialize with some sample foods if no database exists
      const initialFoods = [
        { id: 1, name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6, servingSize: '100g' },
        { id: 2, name: 'Brown Rice', calories: 112, protein: 2.6, carbs: 23.5, fat: 0.9, servingSize: '100g' },
        { id: 3, name: 'Avocado', calories: 160, protein: 2, carbs: 8.5, fat: 14.7, servingSize: '100g' },
        { id: 4, name: 'Salmon', calories: 208, protein: 20, carbs: 0, fat: 13, servingSize: '100g' },
        { id: 5, name: 'Sweet Potato', calories: 86, protein: 1.6, carbs: 20, fat: 0.1, servingSize: '100g' },
      ]
      setFoodDatabase(initialFoods)
      localStorage.setItem("foodDatabase", JSON.stringify(initialFoods))
    }
    
    // Load daily food log
    const today = new Date().toISOString().split('T')[0]
    const savedFoodLog = localStorage.getItem(`foodLog_${today}`)
    if (savedFoodLog) {
      const parsedLog = JSON.parse(savedFoodLog)
      setDailyFoodLog(parsedLog)
      
      // Calculate totals
      calculateDailyTotals(parsedLog)
    }
    
    // Load nutrition history
    const savedHistory = localStorage.getItem("nutritionHistory")
    if (savedHistory) {
      setNutritionHistory(JSON.parse(savedHistory))
    }
  }, [])
  
  // Calculate daily totals whenever food log changes
  const calculateDailyTotals = (foodLog) => {
    const totals = foodLog.reduce((acc, food) => {
      acc.calories += food.calories
      acc.protein += food.protein
      acc.carbs += food.carbs
      acc.fat += food.fat
      return acc
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 })
    
    setDailyTotals(totals)
    
    // Update today's meals in localStorage for the dashboard
    localStorage.setItem("todayMeals", JSON.stringify(foodLog))
    
    // Update nutrition history
    const today = new Date().toISOString().split('T')[0]
    const updatedHistory = [...nutritionHistory.filter(entry => entry.date !== today), 
      { date: today, ...totals }
    ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 7) // Keep last 7 days
    
    setNutritionHistory(updatedHistory)
    localStorage.setItem("nutritionHistory", JSON.stringify(updatedHistory))
    
    // Update weekly progress for the dashboard
    updateWeeklyProgress(totals)
  }
  
  // Update weekly progress in localStorage
  const updateWeeklyProgress = (totals) => {
    const today = new Date().getDay()
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const todayName = dayNames[today]
    
    const savedProgress = localStorage.getItem("weeklyProgress")
    if (savedProgress) {
      const progress = JSON.parse(savedProgress)
      const updatedProgress = progress.map(day => {
        if (day.day === todayName) {
          return { ...day, calories: totals.calories }
        }
        return day
      })
      
      localStorage.setItem("weeklyProgress", JSON.stringify(updatedProgress))
    }
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleAddFood = () => {
    setShowAddFoodModal(true)
  }

  const handleCloseModal = () => {
    setShowAddFoodModal(false)
    setNewFood({
      name: '',
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      servingSize: '',
      mealType: 'breakfast'
    })
    setSearchQuery('')
  }

  const handleNewFoodChange = (e) => {
    const { name, value } = e.target
    setNewFood(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmitFood = (e) => {
    e.preventDefault()
    
    // Add the new food to the daily log
    const newFoodItem = {
      id: Date.now(),
      name: newFood.name,
      calories: Number.parseFloat(newFood.calories),
      protein: Number.parseFloat(newFood.protein),
      carbs: Number.parseFloat(newFood.carbs),
      fat: Number.parseFloat(newFood.fat),
      servingSize: newFood.servingSize,
      mealType: newFood.mealType,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    
    // Add to food database if it's a new food
    if (!foodDatabase.some(food => food.name.toLowerCase() === newFoodItem.name.toLowerCase())) {
      const newFoodForDb = { ...newFoodItem }
      delete newFoodForDb.mealType
      delete newFoodForDb.time
      
      const updatedDatabase = [...foodDatabase, newFoodForDb]
      setFoodDatabase(updatedDatabase)
      localStorage.setItem("foodDatabase", JSON.stringify(updatedDatabase))
    }
    
    // Add to daily food log
    const updatedFoodLog = [...dailyFoodLog, newFoodItem]
    setDailyFoodLog(updatedFoodLog)
    
    // Save to localStorage
    const today = new Date().toISOString().split('T')[0]
    localStorage.setItem(`foodLog_${today}`, JSON.stringify(updatedFoodLog))
    
    // Update totals
    calculateDailyTotals(updatedFoodLog)
    
    handleCloseModal()
  }

  const handleDeleteFood = (id) => {
    const updatedFoodLog = dailyFoodLog.filter(food => food.id !== id)
    setDailyFoodLog(updatedFoodLog)
    
    // Save to localStorage
    const today = new Date().toISOString().split('T')[0]
    localStorage.setItem(`foodLog_${today}`, JSON.stringify(updatedFoodLog))
    
    // Update totals
    calculateDailyTotals(updatedFoodLog)
  }

  const filteredFoods = foodDatabase.filter(food => 
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const calculateProgress = (current, goal) => {
    return Math.min(Math.round((current / goal) * 100), 100)
  }

  return (
    <div className="nutrition-tracker">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Nutrition Tracker</h2>
        <div className="view-toggle">
          <button 
            className={`view-button ${activeView === 'daily' ? 'active' : ''}`}
            onClick={() => setActiveView('daily')}
          >
            <BarChart size={16} />
            Daily Log
          </button>
          <button 
            className={`view-button ${activeView === 'trends' ? 'active' : ''}`}
            onClick={() => setActiveView('trends')}
          >
            <PieChart size={16} />
            Nutrition Trends
          </button>
        </div>
      </div>
      
      {activeView === 'daily' && (
        <div className="daily-nutrition">
          <div className="nutrition-summary-card">
            <div className="summary-header">
              <h3 className="summary-title">Today's Summary</h3>
              <button className="btn btn-primary add-food-btn" onClick={handleAddFood}>
                <Plus size={16} />
                Add Food
              </button>
            </div>
            
            <div className="nutrition-summary">
              <div className="nutrition-item">
                <div className="nutrition-info">
                  <span className="nutrition-label">Calories</span>
                  <span className="nutrition-value">{dailyTotals.calories} / {userData?.calorieGoal || 2000}</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-bar-fill" 
                    style={{ width: `${calculateProgress(dailyTotals.calories, userData?.calorieGoal || 2000)}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="nutrition-item">
                <div className="nutrition-info">
                  <span className="nutrition-label">Protein</span>
                  <span className="nutrition-value">{dailyTotals.protein}g / {userData?.nutritionGoals?.protein || 150}g</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-bar-fill protein-fill" 
                    style={{ width: `${calculateProgress(dailyTotals.protein, userData?.nutritionGoals?.protein || 150)}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="nutrition-item">
                <div className="nutrition-info">
                  <span className="nutrition-label">Carbs</span>
                  <span className="nutrition-value">{dailyTotals.carbs}g / {userData?.nutritionGoals?.carbs || 200}g</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-bar-fill carbs-fill" 
                    style={{ width: `${calculateProgress(dailyTotals.carbs, userData?.nutritionGoals?.carbs || 200)}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="nutrition-item">
                <div className="nutrition-info">
                  <span className="nutrition-label">Fat</span>
                  <span className="nutrition-value">{dailyTotals.fat}g / {userData?.nutritionGoals?.fat || 65}g</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-bar-fill fat-fill" 
                    style={{ width: `${calculateProgress(dailyTotals.fat, userData?.nutritionGoals?.fat || 65)}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="macros-chart">
              <div className="macro-distribution">
                <div className="macro-percentage protein-color" style={{ width: `${(dailyTotals.protein * 4 / (dailyTotals.calories || 1)) * 100}%` }}></div>
                <div className="macro-percentage carbs-color" style={{ width: `${(dailyTotals.carbs * 4 / (dailyTotals.calories || 1)) * 100}%` }}></div>
                <div className="macro-percentage fat-color" style={{ width: `${(dailyTotals.fat * 9 / (dailyTotals.calories || 1)) * 100}%` }}></div>
              </div>
              <div className="macro-legend">
                <div className="legend-item">
                  <div className="legend-color protein-color"></div>
                  <span>Protein</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color carbs-color"></div>
                  <span>Carbs</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color fat-color"></div>
                  <span>Fat</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="food-log-section">
            <h3 className="section-title">Today's Food Log</h3>
            
            <div className="meal-sections">
              {['breakfast', 'lunch', 'dinner', 'snack'].map(mealType => (
                <div key={mealType} className="meal-log-section">
                  <h4 className="meal-type-title">{mealType.charAt(0).toUpperCase() + mealType.slice(1)}</h4>
                  
                  {dailyFoodLog.filter(food => food.mealType === mealType).length === 0 ? (
                    <div className="empty-meal">
                      <p className="empty-text">No {mealType} logged yet</p>
                      <button className="btn btn-outline btn-sm" onClick={handleAddFood}>Add Food</button>
                    </div>
                  ) : (
                    <div className="food-items">
                      {dailyFoodLog
                        .filter(food => food.mealType === mealType)
                        .map(food => (
                          <div key={food.id} className="food-log-item">
                            <div className="food-log-details">
                              <div className="food-log-main">
                                <h5 className="food-name">{food.name}</h5>
                                <span className="food-serving">{food.servingSize}</span>
                              </div>
                              <div className="food-log-time">{food.time}</div>
                            </div>
                            <div className="food-log-nutrition">
                              <span className="food-calories">{food.calories} cal</span>
                              <div className="food-macros">
                                <span className="food-macro">P: {food.protein}g</span>
                                <span className="food-macro">C: {food.carbs}g</span>
                                <span className="food-macro">F: {food.fat}g</span>
                              </div>
                            </div>
                            <button 
                              className="delete-food-btn" 
                              onClick={() => handleDeleteFood(food.id)}
                              aria-label="Delete food"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {activeView === 'trends' && (
        <div className="nutrition-trends">
          <div className="trends-card">
            <h3 className="trends-title">Weekly Nutrition Trends</h3>
            
            {nutritionHistory.length > 0 ? (
              <div className="nutrition-history">
                <div className="history-chart">
                  <div className="chart-bars">
                    {nutritionHistory.slice().reverse().map((day, index) => (
                      <div key={index} className="history-bar-group">
                        <div className="history-date">{new Date(day.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</div>
                        <div className="history-bars">
                          <div 
                            className="history-bar calories-bar" 
                            style={{ height: `${(day.calories / (userData?.calorieGoal || 2000)) * 100}%` }}
                            title={`${day.calories} calories`}
                          ></div>
                          <div 
                            className="history-bar protein-bar" 
                            style={{ height: `${(day.protein / (userData?.nutritionGoals?.protein || 150)) * 100}%` }}
                            title={`${day.protein}g protein`}
                          ></div>
                          <div 
                            className="history-bar carbs-bar" 
                            style={{ height: `${(day.carbs / (userData?.nutritionGoals?.carbs || 200)) * 100}%` }}
                            title={`${day.carbs}g carbs`}
                          ></div>
                          <div 
                            className="history-bar fat-bar" 
                            style={{ height: `${(day.fat / (userData?.nutritionGoals?.fat || 65)) * 100}%` }}
                            title={`${day.fat}g fat`}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="chart-legend">
                    <div className="legend-item">
                      <div className="legend-color calories-color"></div>
                      <span>Calories</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-color protein-color"></div>
                      <span>Protein</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-color carbs-color"></div>
                      <span>Carbs</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-color fat-color"></div>
                      <span>Fat</span>
                    </div>
                  </div>
                </div>
                
                <div className="history-table">
                  <h4>Nutrition History</h4>
                  <div className="table-container">
                    <table>
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Calories</th>
                          <th>Protein (g)</th>
                          <th>Carbs (g)</th>
                          <th>Fat (g)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {nutritionHistory.map((day, index) => (
                          <tr key={index}>
                            <td>{new Date(day.date).toLocaleDateString()}</td>
                            <td>{day.calories}</td>
                            <td>{day.protein}</td>
                            <td>{day.carbs}</td>
                            <td>{day.fat}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="empty-trends">
                <p>No nutrition data available yet. Start logging your meals to see trends.</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {showAddFoodModal && (
        <div className="modal-overlay">
          <div className="food-modal">
            <div className="modal-header">
              <h3 className="modal-title">Add Food</h3>
              <button className="close-modal-btn" onClick={handleCloseModal}>&times;</button>
            </div>
            
            <div className="food-search">
              <div className="search-container">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search foods..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
            
            {searchQuery && (
              <div className="search-results">
                <h4 className="results-title">Search Results</h4>
                {filteredFoods.length === 0 ? (
                  <p className="no-results">No foods found. Try a different search term or add a new food.</p>
                ) : (
                  <div className="food-results-list">
                    {filteredFoods.map(food => (
                      <div key={food.id} className="food-result-item">
                        <div className="food-result-details">
                          <h5 className="food-result-name">{food.name}</h5>
                          <span className="food-result-serving">{food.servingSize}</span>
                        </div>
                        <div className="food-result-nutrition">
                          <span className="food-result-calories">{food.calories} cal</span>
                          <div className="food-result-macros">
                            <span>P: {food.protein}g</span>
                            <span>C: {food.carbs}g</span>
                            <span>F: {food.fat}g</span>
                          </div>
                        </div>
                        <button 
                          className="btn btn-sm btn-primary"
                          onClick={() => {
                            setNewFood({
                              name: food.name,
                              calories: food.calories.toString(),
                              protein: food.protein.toString(),
                              carbs: food.carbs.toString(),
                              fat: food.fat.toString(),
                              servingSize: food.servingSize,
                              mealType: 'breakfast'
                            });
                            setSearchQuery('');
                          }}
                        >
                          Add
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            <form className="add-food-form" onSubmit={handleSubmitFood}>
              <h4 className="form-section-title">Food Details</h4>
              
              <div className="form-group">
                <label htmlFor="name" className="form-label">Food Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-input"
                  value={newFood.name}
                  onChange={handleNewFoodChange}
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="calories" className="form-label">Calories</label>
                  <input
                    type="number"
                    id="calories"
                    name="calories"
                    className="form-input"
                    value={newFood.calories}
                    onChange={handleNewFoodChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="servingSize" className="form-label">Serving Size</label>
                  <input
                    type="text"
                    id="servingSize"
                    name="servingSize"
                    className="form-input"
                    value={newFood.servingSize}
                    onChange={handleNewFoodChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="protein" className="form-label">Protein (g)</label>
                  <input
                    type="number"
                    id="protein"
                    name="protein"
                    className="form-input"
                    value={newFood.protein}
                    onChange={handleNewFoodChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="carbs" className="form-label">Carbs (g)</label>
                  <input
                    type="number"
                    id="carbs"
                    name="carbs"
                    className="form-input"
                    value={newFood.carbs}
                    onChange={handleNewFoodChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="fat" className="form-label">Fat (g)</label>
                  <input
                    type="number"
                    id="fat"
                    name="fat"
                    className="form-input"
                    value={newFood.fat}
                    onChange={handleNewFoodChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="mealType" className="form-label">Meal Type</label>
                <select
                  id="mealType"
                  name="mealType"
                  className="form-input"
                  value={newFood.mealType}
                  onChange={handleNewFoodChange}
                  required
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                </select>
              </div>
              
              <div className="form-actions">
                <button type="button" className="btn btn-outline" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add Food</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NutritionTracker;
