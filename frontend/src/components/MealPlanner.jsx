import { useState } from 'react';
import { Search, Plus, RefreshCw } from 'lucide-react';
import { generateMealPlan } from '../utils/ai-service';
import './MealPlanner.css';

const MealPlanner = ({ userData, setUserData }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [mealPlan, setMealPlan] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDay, setSelectedDay] = useState('monday');

  // Sample meal plan data (in a real app, this would come from the AI)
  const sampleMealPlan = {
    monday: {
      breakfast: {
        name: 'Greek Yogurt Parfait',
        calories: 320,
        protein: 22,
        carbs: 40,
        fat: 8,
        ingredients: ['Greek yogurt', 'Mixed berries', 'Granola', 'Honey'],
        instructions: 'Layer yogurt, berries, and granola in a bowl. Drizzle with honey.'
      },
      lunch: {
        name: 'Quinoa Salad Bowl',
        calories: 450,
        protein: 15,
        carbs: 65,
        fat: 15,
        ingredients: ['Quinoa', 'Cucumber', 'Cherry tomatoes', 'Avocado', 'Feta cheese', 'Olive oil', 'Lemon juice'],
        instructions: 'Mix cooked quinoa with chopped vegetables. Add feta cheese and dress with olive oil and lemon juice.'
      },
      dinner: {
        name: 'Baked Salmon with Roasted Vegetables',
        calories: 520,
        protein: 35,
        carbs: 30,
        fat: 25,
        ingredients: ['Salmon fillet', 'Broccoli', 'Bell peppers', 'Zucchini', 'Olive oil', 'Garlic', 'Lemon'],
        instructions: 'Season salmon with garlic, salt, and pepper. Bake at 400°F for 15 minutes. Roast vegetables with olive oil.'
      },
      snacks: [
        {
          name: 'Apple with Almond Butter',
          calories: 200,
          protein: 5,
          carbs: 25,
          fat: 10
        },
        {
          name: 'Protein Shake',
          calories: 150,
          protein: 20,
          carbs: 5,
          fat: 3
        }
      ]
    },
    tuesday: {
      breakfast: {
        name: 'Veggie Omelette',
        calories: 350,
        protein: 25,
        carbs: 10,
        fat: 22,
        ingredients: ['Eggs', 'Spinach', 'Bell peppers', 'Onion', 'Feta cheese'],
        instructions: 'Whisk eggs, pour into a hot pan. Add vegetables and cheese. Fold and cook until set.'
      },
      lunch: {
        name: 'Turkey Avocado Wrap',
        calories: 420,
        protein: 30,
        carbs: 35,
        fat: 18,
        ingredients: ['Whole grain wrap', 'Turkey breast', 'Avocado', 'Lettuce', 'Tomato', 'Greek yogurt'],
        instructions: 'Spread Greek yogurt on wrap. Layer with turkey, avocado, lettuce, and tomato. Roll up and enjoy.'
      },
      dinner: {
        name: 'Lentil Curry with Brown Rice',
        calories: 480,
        protein: 20,
        carbs: 70,
        fat: 12,
        ingredients: ['Lentils', 'Brown rice', 'Onion', 'Garlic', 'Curry powder', 'Coconut milk', 'Spinach'],
        instructions: 'Sauté onion and garlic. Add lentils, curry powder, and coconut milk. Simmer until lentils are tender. Serve over brown rice.'
      },
      snacks: [
        {
          name: 'Greek Yogurt with Berries',
          calories: 180,
          protein: 15,
          carbs: 20,
          fat: 2
        },
        {
          name: 'Mixed Nuts',
          calories: 170,
          protein: 6,
          carbs: 5,
          fat: 15
        }
      ]
    }
  };

  const handleGenerateMealPlan = async () => {
    setIsGenerating(true);
    try {
      // In a real app, this would call the Gemini API
      const generatedPlan = await generateMealPlan(userData);
      setMealPlan(generatedPlan || sampleMealPlan);
    } catch (error) {
      console.error('Error generating meal plan:', error);
      // Fallback to sample data
      setMealPlan(sampleMealPlan);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDayChange = (day) => {
    setSelectedDay(day);
  };

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
            <p className="generator-description">
              Our AI will create a customized meal plan based on your:
            </p>
            
            <ul className="generator-features">
              <li>Daily calorie goal: <strong>{userData?.calorieGoal || 2000} calories</strong></li>
              <li>Protein target: <strong>{userData?.nutritionGoals?.protein || 150}g</strong></li>
              <li>Dietary restrictions: <strong>{userData?.dietaryRestrictions?.join(', ') || 'None'}</strong></li>
              <li>Fitness goal: <strong>{userData?.goal === 'lose-weight' ? 'Weight Loss' : userData?.goal === 'gain-muscle' ? 'Muscle Gain' : 'Maintenance'}</strong></li>
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
    );
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
        {Object.keys(mealPlan).map(day => (
          <button
            key={day}
            className={`day-button ${selectedDay === day ? 'active' : ''}`}
            onClick={() => handleDayChange(day)}
          >
            {day.charAt(0).toUpperCase() + day.slice(1)}
          </button>
        ))}
      </div>
      
      <div className="meal-plan-content">
        <div className="meal-section">
          <h3 className="meal-title">Breakfast</h3>
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
          <h3 className="meal-title">Lunch</h3>
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
          <h3 className="meal-title">Dinner</h3>
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
          <h3 className="meal-title">Snacks</h3>
          <div className="snacks-container">
            {mealPlan[selectedDay].snacks.map((snack, index) => (
              <div key={index} className="snack-card">
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
    </div>
  );
};

export default MealPlanner;
