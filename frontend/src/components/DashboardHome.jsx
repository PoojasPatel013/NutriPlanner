import { useState, useEffect } from 'react';
import { Utensils, Droplet, LineChart, Apple, ArrowUp, ArrowDown } from 'lucide-react';
import { generateAIRecommendation } from '../utils/ai-service';
import './DashboardHome.css';

const DashboardHome = ({ userData }) => {
  const [recommendation, setRecommendation] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [waterIntake, setWaterIntake] = useState(0);
  const [todayStats, setTodayStats] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  });

  // Mock data for recent meals
  const recentMeals = [
    { id: 1, name: 'Breakfast', calories: 450, time: '8:30 AM', items: ['Oatmeal', 'Banana', 'Almond Milk'] },
    { id: 2, name: 'Lunch', calories: 650, time: '12:45 PM', items: ['Grilled Chicken Salad', 'Whole Grain Bread'] },
    { id: 3, name: 'Snack', calories: 200, time: '3:30 PM', items: ['Greek Yogurt', 'Blueberries', 'Honey'] }
  ];

  // Mock data for weekly progress
  const weeklyProgress = [
    { day: 'Mon', calories: 1950, goal: 2000 },
    { day: 'Tue', calories: 2100, goal: 2000 },
    { day: 'Wed', calories: 1850, goal: 2000 },
    { day: 'Thu', calories: 2050, goal: 2000 },
    { day: 'Fri', calories: 1900, goal: 2000 },
    { day: 'Sat', calories: 2200, goal: 2000 },
    { day: 'Sun', calories: 1800, goal: 2000 }
  ];

  useEffect(() => {
    // Simulate loading AI recommendation
    const loadRecommendation = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would call the Gemini API
        const aiRecommendation = await generateAIRecommendation(userData);
        setRecommendation(aiRecommendation);
      } catch (error) {
        console.error('Error fetching AI recommendation:', error);
        setRecommendation('Based on your profile and goals, I recommend focusing on protein-rich foods and staying hydrated throughout the day. Consider adding more leafy greens to your meals for essential nutrients.');
      } finally {
        setIsLoading(false);
      }
    };

    // Simulate fetching today's nutrition data
    const fetchTodayStats = () => {
      // In a real app, this would come from a database
      setTodayStats({
        calories: 1300,
        protein: 75,
        carbs: 140,
        fat: 45
      });
    };

    loadRecommendation();
    fetchTodayStats();
    
    // Initialize water intake from localStorage or default to 0
    const savedWaterIntake = localStorage.getItem('waterIntake');
    if (savedWaterIntake) {
      setWaterIntake(parseInt(savedWaterIntake, 10));
    }
  }, [userData]);

  const handleAddWater = () => {
    const newIntake = waterIntake + 1;
    setWaterIntake(newIntake);
    localStorage.setItem('waterIntake', newIntake.toString());
  };

  const calculateProgress = (current, goal) => {
    return Math.min(Math.round((current / goal) * 100), 100);
  };

  return (
    <div className="dashboard-home">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Welcome back, {userData?.name || 'User'}!</h2>
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
                <span className="nutrition-value">{todayStats.calories} / {userData?.calorieGoal || 2000}</span>
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
                <span className="nutrition-value">{todayStats.protein}g / {userData?.nutritionGoals?.protein || 150}g</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-bar-fill protein-fill" 
                  style={{ width: `${calculateProgress(todayStats.protein, userData?.nutritionGoals?.protein || 150)}%` }}
                ></div>
              </div>
            </div>
            
            <div className="nutrition-item">
              <div className="nutrition-info">
                <span className="nutrition-label">Carbs</span>
                <span className="nutrition-value">{todayStats.carbs}g / {userData?.nutritionGoals?.carbs || 200}g</span>
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
                <span className="nutrition-value">{todayStats.fat}g / {userData?.nutritionGoals?.fat || 65}g</span>
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
                    className={`water-glass ${i < waterIntake ? 'filled' : ''}`}
                    title={`Glass ${i + 1}`}
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
            <button className="btn btn-outline btn-sm">Add Meal</button>
          </div>
          
          <div className="meals-list">
            {recentMeals.map(meal => (
              <div key={meal.id} className="meal-item">
                <div className="meal-info">
                  <h4 className="meal-name">{meal.name}</h4>
                  <span className="meal-time">{meal.time}</span>
                </div>
                <div className="meal-details">
                  <p className="meal-foods">{meal.items.join(', ')}</p>
                  <span className="meal-calories">{meal.calories} cal</span>
                </div>
              </div>
            ))}
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
                    className={`bar-fill ${day.calories > day.goal ? 'over-goal' : ''}`} 
                    style={{ height: `${(day.calories / 2500) * 100}%` }}
                  ></div>
                  <div 
                    className="goal-line" 
                    style={{ bottom: `${(day.goal / 2500) * 100}%` }}
                  ></div>
                </div>
                <span className="bar-label">{day.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
