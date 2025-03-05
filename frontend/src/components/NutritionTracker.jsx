import { useState } from 'react';
import { PieChart, BarChart, Plus, Search } from 'lucide-react';
import './NutritionTracker.css';

const NutritionTracker = ({ userData }) => {
  const [activeView, setActiveView] = useState('daily');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddFoodModal, setShowAddFoodModal] = useState(false);
  const [newFood, setNewFood] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    servingSize: '',
    mealType: 'breakfast'
  });

  // Sample food database
  const foodDatabase = [
    { id: 1, name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6, servingSize: '100g' },
    { id: 2, name: 'Brown Rice', calories: 112, protein: 2.6, carbs: 23.5, fat: 0.9, servingSize: '100g' },
    { id: 3, name: 'Avocado', calories: 160, protein: 2, carbs: 8.5, fat: 14.7, servingSize: '100g' },
    { id: 4, name: 'Salmon', calories: 208, protein: 20, carbs: 0, fat: 13, servingSize: '100g' },
    { id: 5, name: 'Sweet Potato', calories: 86, protein: 1.6, carbs: 20, fat: 0.1, servingSize: '100g' },
    { id: 6, name: 'Greek Yogurt', calories: 59, protein: 10, carbs: 3.6, fat: 0.4, servingSize: '100g' },
    { id: 7, name: 'Spinach', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, servingSize: '100g' },
    { id: 8, name: 'Banana', calories: 89, protein: 1.1, carbs: 22.8, fat: 0.3, servingSize: '100g' },
    { id: 9, name: 'Almonds', calories: 579, protein: 21.2, carbs: 21.7, fat: 49.9, servingSize: '100g' },
    { id: 10, name: 'Egg', calories: 155, protein: 12.6, carbs: 1.1, fat: 10.6, servingSize: '100g' },
  ];

  // Sample daily food log
  const [dailyFoodLog, setDailyFoodLog] = useState([
    { id: 1, name: 'Greek Yogurt', calories: 150, protein: 15, carbs: 8, fat: 5, servingSize: '1 cup', mealType: 'breakfast', time: '8:30 AM' },
    { id: 2, name: 'Banana', calories: 105, protein: 1.3, carbs: 27, fat: 0.4, servingSize: '1 medium', mealType: 'breakfast', time: '8:30 AM' },
    { id: 3, name: 'Grilled Chicken Salad', calories: 350, protein: 35, carbs: 10, fat: 15, servingSize: '1 bowl', mealType: 'lunch', time: '12:45 PM' },
    { id: 4, name: 'Apple', calories: 95, protein: 0.5, carbs: 25, fat: 0.3, servingSize: '1 medium', mealType: 'snack', time: '3:30 PM' },
  ]);

  // Calculate daily totals
  const dailyTotals = dailyFoodLog.reduce((acc, food) => {
    acc.calories += food.calories;
    acc.protein += food.protein;
    acc.carbs += food.carbs;
    acc.fat += food.fat;
    return acc;
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleAddFood = () => {
    setShowAddFoodModal(true);
  };

  const handleCloseModal = () => {
    setShowAddFoodModal(false);
    setNewFood({
      name: '',
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      servingSize: '',
      mealType: 'breakfast'
    });
  };

  const handleNewFoodChange = (e) => {
    const { name, value } = e.target;
    setNewFood(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitFood = (e) => {
    e.preventDefault();
    
    // Add the new food to the daily log
    const newFoodItem = {
      id: Date.now(),
      name: newFood.name,
      calories: parseFloat(newFood.calories),
      protein: parseFloat(newFood.protein),
      carbs: parseFloat(newFood.carbs),
      fat: parseFloat(newFood.fat),
      servingSize: newFood.servingSize,
      mealType: newFood.mealType,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setDailyFoodLog(prev => [...prev, newFoodItem]);
    handleCloseModal();
  };

  const handleDeleteFood = (id) => {
    setDailyFoodLog(prev => prev.filter(food => food.id !== id));
  };

  const filteredFoods = foodDatabase.filter(food => 
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const calculateProgress = (current, goal) => {
    return Math.min(Math.round((current / goal) * 100), 100);
  };

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
                              &times;
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
            <p className="trends-description">
              This view will show your nutrition trends over time, including calorie intake, 
              macronutrient distribution, and progress towards your goals.
            </p>
            <div className="placeholder-chart">
              <p>Charts and trends visualization will appear here</p>
            </div>
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
                  <p className="no-results">No foods found. Try a different search term.</p>
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
