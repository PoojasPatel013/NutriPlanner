import { useState } from 'react';
import { Save, User, Lock, Bell, Moon, Sun } from 'lucide-react';
import './SettingsView.css';

const SettingsView = ({ userData, setUserData }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: userData?.name || '',
    email: userData?.email || '',
    height: userData?.height || '',
    weight: userData?.weight || '',
    age: userData?.age || '',
    goal: userData?.goal || 'lose-weight',
    dietaryRestrictions: userData?.dietaryRestrictions || [],
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    emailNotifications: true,
    pushNotifications: false,
    reminderTime: '20:00',
    darkMode: false,
    language: 'en',
    units: 'imperial'
  });
  
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleDietaryRestrictionChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => {
      if (checked) {
        return { ...prev, dietaryRestrictions: [...prev.dietaryRestrictions, value] };
      } else {
        return { ...prev, dietaryRestrictions: prev.dietaryRestrictions.filter(item => item !== value) };
      }
    });
  };
  
  const handleToggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    setFormData(prev => ({ ...prev, darkMode: newMode }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Update user data based on the active tab
    if (activeTab === 'profile') {
      const updatedUserData = {
        ...userData,
        name: formData.name,
        email: formData.email,
        height: formData.height,
        weight: formData.weight,
        age: formData.age,
        goal: formData.goal,
        dietaryRestrictions: formData.dietaryRestrictions,
        calorieGoal: calculateCalorieGoal(formData),
        nutritionGoals: {
          protein: Math.round(calculateCalorieGoal(formData) * 0.3 / 4), // 30% protein, 4 calories per gram
          carbs: Math.round(calculateCalorieGoal(formData) * 0.4 / 4),   // 40% carbs, 4 calories per gram
          fat: Math.round(calculateCalorieGoal(formData) * 0.3 / 9)      // 30% fat, 9 calories per gram
        }
      };
      
      setUserData(updatedUserData);
      localStorage.setItem('userData', JSON.stringify(updatedUserData));
      setSuccessMessage('Profile updated successfully!');
    } else if (activeTab === 'account') {
      // In a real app, you would validate the current password and update the password
      if (formData.newPassword !== formData.confirmPassword) {
        alert('New passwords do not match!');
        return;
      }
      
      setSuccessMessage('Password updated successfully!');
    } else if (activeTab === 'notifications') {
      // Update notification settings
      const updatedUserData = {
        ...userData,
        notifications: {
          email: formData.emailNotifications,
          push: formData.pushNotifications,
          reminderTime: formData.reminderTime
        }
      };
      
      setUserData(updatedUserData);
      localStorage.setItem('userData', JSON.stringify(updatedUserData));
      setSuccessMessage('Notification settings updated!');
    } else if (activeTab === 'preferences') {
      // Update preferences
      const updatedUserData = {
        ...userData,
        preferences: {
          darkMode: formData.darkMode,
          language: formData.language,
          units: formData.units
        }
      };
      
      setUserData(updatedUserData);
      localStorage.setItem('userData', JSON.stringify(updatedUserData));
      setSuccessMessage('Preferences updated!');
    }
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
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

  return (
    <div className="settings-view">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Settings</h2>
        <p className="dashboard-subtitle">Manage your account settings and preferences</p>
      </div>
      
      <div className="settings-container">
        <div className="settings-sidebar">
          <button 
            className={`settings-tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={18} />
            <span>Profile</span>
          </button>
          
          <button 
            className={`settings-tab ${activeTab === 'account' ? 'active' : ''}`}
            onClick={() => setActiveTab('account')}
          >
            <Lock size={18} />
            <span>Account</span>
          </button>
          
          <button 
            className={`settings-tab ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <Bell size={18} />
            <span>Notifications</span>
          </button>
          
          <button 
            className={`settings-tab ${activeTab === 'preferences' ? 'active' : ''}`}
            onClick={() => setActiveTab('preferences')}
          >
            {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
            <span>Preferences</span>
          </button>
        </div>
        
        <div className="settings-content">
          {successMessage && (
            <div className="success-message">
              {successMessage}
            </div>
          )}
          
          <form className="settings-form" onSubmit={handleSubmit}>
            {activeTab === 'profile' && (
              <div className="settings-section">
                <h3 className="settings-section-title">Profile Information</h3>
                
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-input"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-input"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                
                <h3 className="settings-section-title">Body Metrics</h3>
                
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
                    />
                  </div>
                </div>
                
                <h3 className="settings-section-title">Nutrition Goals</h3>
                
                <div className="form-group">
                  <label htmlFor="goal" className="form-label">Goal</label>
                  <select
                    id="goal"
                    name="goal"
                    className="form-input"
                    value={formData.goal}
                    onChange={handleChange}
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
                        onChange={handleDietaryRestrictionChange}
                      />
                      Vegetarian
                    </label>
                    
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="dietaryRestrictions"
                        value="vegan"
                        checked={formData.dietaryRestrictions.includes('vegan')}
                        onChange={handleDietaryRestrictionChange}
                      />
                      Vegan
                    </label>
                    
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="dietaryRestrictions"
                        value="gluten-free"
                        checked={formData.dietaryRestrictions.includes('gluten-free')}
                        onChange={handleDietaryRestrictionChange}
                      />
                      Gluten-Free
                    </label>
                    
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="dietaryRestrictions"
                        value="dairy-free"
                        checked={formData.dietaryRestrictions.includes('dairy-free')}
                        onChange={handleDietaryRestrictionChange}
                      />
                      Dairy-Free
                    </label>
                    
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="dietaryRestrictions"
                        value="nut-free"
                        checked={formData.dietaryRestrictions.includes('nut-free')}
                        onChange={handleDietaryRestrictionChange}
                      />
                      Nut-Free
                    </label>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'account' && (
              <div className="settings-section">
                <h3 className="settings-section-title">Change Password</h3>
                
                <div className="form-group">
                  <label htmlFor="currentPassword" className="form-label">Current Password</label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    className="form-input"
                    value={formData.currentPassword}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="newPassword" className="form-label">New Password</label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    className="form-input"
                    value={formData.newPassword}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    className="form-input"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="account-actions">
                  <button type="button" className="btn btn-outline danger-btn">Delete Account</button>
                </div>
              </div>
            )}
            
            {activeTab === 'notifications' && (
              <div className="settings-section">
                <h3 className="settings-section-title">Notification Settings</h3>
                
                <div className="form-group">
                  <div className="toggle-group">
                    <label className="toggle-label">
                      Email Notifications
                      <div className="toggle-description">Receive email updates about your meal plans and progress</div>
                    </label>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        name="emailNotifications"
                        checked={formData.emailNotifications}
                        onChange={handleCheckboxChange}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
                
                <div className="form-group">
                  <div className="toggle-group">
                    <label className="toggle-label">
                      Push Notifications
                      <div className="toggle-description">Receive push notifications for reminders and updates</div>
                    </label>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        name="pushNotifications"
                        checked={formData.pushNotifications}
                        onChange={handleCheckboxChange}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="reminderTime" className="form-label">Daily Reminder Time</label>
                  <input
                    type="time"
                    id="reminderTime"
                    name="reminderTime"
                    className="form-input"
                    value={formData.reminderTime}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}
            
            {activeTab === 'preferences' && (
              <div className="settings-section">
                <h3 className="settings-section-title">App Preferences</h3>
                
                <div className="form-group">
                  <div className="toggle-group">
                    <label className="toggle-label">
                      Dark Mode
                      <div className="toggle-description">Switch between light and dark theme</div>
                    </label>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        name="darkMode"
                        checked={formData.darkMode}
                        onChange={(e) => {
                          handleCheckboxChange(e);
                          handleToggleDarkMode();
                        }}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="language" className="form-label">Language</label>
                  <select
                    id="language"
                    name="language"
                    className="form-input"
                    value={formData.language}
                    onChange={handleChange}
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="units" className="form-label">Units</label>
                  <select
                    id="units"
                    name="units"
                    className="form-input"
                    value={formData.units}
                    onChange={handleChange}
                  >
                    <option value="imperial">Imperial (lb, ft, in)</option>
                    <option value="metric">Metric (kg, cm)</option>
                  </select>
                </div>
              </div>
            )}
            
            <div className="form-actions">
              <button type="submit" className="btn btn-primary save-button">
                <Save size={16} />
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
