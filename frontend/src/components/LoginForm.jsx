import { useState } from 'react';
import './LoginForm.css';

const LoginForm = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    height: '',
    weight: '',
    age: '',
    goal: 'lose-weight',
    dietaryRestrictions: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => {
      if (checked) {
        return { ...prev, dietaryRestrictions: [...prev.dietaryRestrictions, value] };
      } else {
        return { ...prev, dietaryRestrictions: prev.dietaryRestrictions.filter(item => item !== value) };
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // For demo purposes, just pass the form data to the onLogin function
    // In a real app, you would validate and authenticate with a backend
    onLogin({
      ...formData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      calorieGoal: calculateCalorieGoal(formData),
      nutritionGoals: {
        protein: Math.round(calculateCalorieGoal(formData) * 0.3 / 4), // 30% protein, 4 calories per gram
        carbs: Math.round(calculateCalorieGoal(formData) * 0.4 / 4),   // 40% carbs, 4 calories per gram
        fat: Math.round(calculateCalorieGoal(formData) * 0.3 / 9)      // 30% fat, 9 calories per gram
      }
    });
  };

  const calculateCalorieGoal = (userData) => {
    // Basic BMR calculation using Harris-Benedict equation
    const { weight, height, age, goal } = userData;
    
    // Convert to numbers
    const weightNum = parseFloat(weight) || 70;
    const heightNum = parseFloat(height) || 170;
    const ageNum = parseFloat(age) || 30;
    
    // BMR calculation (simplified)
    let bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum;
    
    // Adjust based on goal
    switch(goal) {
      case 'lose-weight':
        return Math.round(bmr * 1.2 - 500); // Deficit for weight loss
      case 'gain-muscle':
        return Math.round(bmr * 1.4 + 300); // Surplus for muscle gain
      case 'maintain':
      default:
        return Math.round(bmr * 1.3); // Maintenance
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <div className="login-header">
          <h1 className="login-title">NutriPlan AI</h1>
          <p className="login-subtitle">Your AI-powered nutrition assistant</p>
        </div>
        
        <form className="login-form" onSubmit={handleSubmit}>
          <h2 className="form-title">{isLogin ? 'Login' : 'Create Account'}</h2>
          
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name" className="form-label">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-input"
                value={formData.name}
                onChange={handleChange}
                required={!isLogin}
              />
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          {!isLogin && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="height" className="form-label">Height (cm)</label>
                  <input
                    type="number"
                    id="height"
                    name="height"
                    className="form-input"
                    value={formData.height}
                    onChange={handleChange}
                    required={!isLogin}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="weight" className="form-label">Weight (kg)</label>
                  <input
                    type="number"
                    id="weight"
                    name="weight"
                    className="form-input"
                    value={formData.weight}
                    onChange={handleChange}
                    required={!isLogin}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="age" className="form-label">Age</label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    className="form-input"
                    value={formData.age}
                    onChange={handleChange}
                    required={!isLogin}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="goal" className="form-label">Goal</label>
                <select
                  id="goal"
                  name="goal"
                  className="form-input"
                  value={formData.goal}
                  onChange={handleChange}
                  required={!isLogin}
                >
                  <option value="lose-weight">Lose Weight</option>
                  <option value="gain-muscle">Gain Muscle</option>
                  <option value="maintain">Maintain Weight</option>
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label">Dietary Restrictions</label>
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="dietaryRestrictions"
                      value="vegetarian"
                      checked={formData.dietaryRestrictions.includes('vegetarian')}
                      onChange={handleCheckboxChange}
                    />
                    Vegetarian
                  </label>
                  
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="dietaryRestrictions"
                      value="vegan"
                      checked={formData.dietaryRestrictions.includes('vegan')}
                      onChange={handleCheckboxChange}
                    />
                    Vegan
                  </label>
                  
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="dietaryRestrictions"
                      value="gluten-free"
                      checked={formData.dietaryRestrictions.includes('gluten-free')}
                      onChange={handleCheckboxChange}
                    />
                    Gluten-Free
                  </label>
                  
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="dietaryRestrictions"
                      value="dairy-free"
                      checked={formData.dietaryRestrictions.includes('dairy-free')}
                      onChange={handleCheckboxChange}
                    />
                    Dairy-Free
                  </label>
                </div>
              </div>
            </>
          )}
          
          <button type="submit" className="btn btn-primary login-button">
            {isLogin ? 'Login' : 'Create Account'}
          </button>
          
          <p className="form-toggle">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button type="button" className="toggle-button" onClick={toggleForm}>
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
