import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './CalendarView.css';

const CalendarView = ({ userData }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Sample meal plan data
  const mealPlanData = {
    '2023-03-12': {
      breakfast: { name: 'Greek Yogurt Parfait', calories: 320 },
      lunch: { name: 'Quinoa Salad Bowl', calories: 450 },
      dinner: { name: 'Baked Salmon with Roasted Vegetables', calories: 520 },
      snacks: [
        { name: 'Apple with Almond Butter', calories: 200 },
        { name: 'Protein Shake', calories: 150 }
      ]
    },
    '2023-03-13': {
      breakfast: { name: 'Veggie Omelette', calories: 350 },
      lunch: { name: 'Turkey Avocado Wrap', calories: 420 },
      dinner: { name: 'Lentil Curry with Brown Rice', calories: 480 },
      snacks: [
        { name: 'Greek Yogurt with Berries', calories: 180 },
        { name: 'Mixed Nuts', calories: 170 }
      ]
    },
    '2023-03-14': {
      breakfast: { name: 'Overnight Oats with Berries', calories: 380 },
      lunch: { name: 'Chicken Caesar Salad', calories: 410 },
      dinner: { name: 'Stir-Fried Tofu with Vegetables', calories: 450 },
      snacks: [
        { name: 'Hummus with Carrots', calories: 160 },
        { name: 'Protein Bar', calories: 200 }
      ]
    }
  };
  
  // Sample workout data
  const workoutData = {
    '2023-03-12': { name: 'Upper Body Strength', duration: 45, type: 'strength' },
    '2023-03-13': { name: 'HIIT Cardio', duration: 30, type: 'cardio' },
    '2023-03-15': { name: 'Lower Body Strength', duration: 50, type: 'strength' },
    '2023-03-17': { name: 'Yoga', duration: 60, type: 'flexibility' }
  };
  
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };
  
  const formatDateKey = (date) => {
    return date.toISOString().split('T')[0];
  };
  
  const hasMealPlan = (date) => {
    return mealPlanData[formatDateKey(date)] !== undefined;
  };
  
  const hasWorkout = (date) => {
    return workoutData[formatDateKey(date)] !== undefined;
  };
  
  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const monthName = currentDate.toLocaleString('default', { month: 'long' });
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateKey = formatDateKey(date);
      const isToday = new Date().toDateString() === date.toDateString();
      const isSelected = selectedDate.toDateString() === date.toDateString();
      const hasMeal = mealPlanData[dateKey] !== undefined;
      const hasExercise = workoutData[dateKey] !== undefined;
      
      days.push(
        <div 
          key={day} 
          className={`calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
          onClick={() => setSelectedDate(date)}
        >
          <div className="day-number">{day}</div>
          <div className="day-indicators">
            {hasMeal && <div className="indicator meal-indicator" title="Meal Plan"></div>}
            {hasExercise && <div className="indicator workout-indicator" title="Workout"></div>}
          </div>
        </div>
      );
    }
    
    return (
      <div className="calendar-container">
        <div className="calendar-header">
          <button 
            className="month-nav-button"
            onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
          >
            <ChevronLeft size={20} />
          </button>
          <h3 className="current-month">{monthName} {year}</h3>
          <button 
            className="month-nav-button"
            onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
          >
            <ChevronRight size={20} />
          </button>
        </div>
        
        <div className="calendar-weekdays">
          <div className="weekday">Sun</div>
          <div className="weekday">Mon</div>
          <div className="weekday">Tue</div>
          <div className="weekday">Wed</div>
          <div className="weekday">Thu</div>
          <div className="weekday">Fri</div>
          <div className="weekday">Sat</div>
        </div>
        
        <div className="calendar-days">
          {days}
        </div>
      </div>
    );
  };
  
  const renderDayDetails = () => {
    const dateKey = formatDateKey(selectedDate);
    const mealPlan = mealPlanData[dateKey];
    const workout = workoutData[dateKey];
    
    return (
      <div className="day-details">
        <h3 className="details-date">{selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h3>
        
        <div className="details-section">
          <h4 className="section-title">Meal Plan</h4>
          {mealPlan ? (
            <div className="meal-plan-details">
              <div className="meal-item">
                <div className="meal-header">
                  <h5 className="meal-name">Breakfast</h5>
                  <span className="meal-calories">{mealPlan.breakfast.calories} cal</span>
                </div>
                <p className="meal-description">{mealPlan.breakfast.name}</p>
              </div>
              
              <div className="meal-item">
                <div className="meal-header">
                  <h5 className="meal-name">Lunch</h5>
                  <span className="meal-calories">{mealPlan.lunch.calories} cal</span>
                </div>
                <p className="meal-description">{mealPlan.lunch.name}</p>
              </div>
              
              <div className="meal-item">
                <div className="meal-header">
                  <h5 className="meal-name">Dinner</h5>
                  <span className="meal-calories">{mealPlan.dinner.calories} cal</span>
                </div>
                <p className="meal-description">{mealPlan.dinner.name}</p>
              </div>
              
              <div className="meal-item">
                <div className="meal-header">
                  <h5 className="meal-name">Snacks</h5>
                  <span className="meal-calories">
                    {mealPlan.snacks.reduce((total, snack) => total + snack.calories, 0)} cal
                  </span>
                </div>
                <div className="snack-list">
                  {mealPlan.snacks.map((snack, index) => (
                    <p key={index} className="snack-item">
                      {snack.name} <span className="snack-calories">({snack.calories} cal)</span>
                    </p>
                  ))}
                </div>
              </div>
              
              <div className="meal-total">
                <span className="total-label">Total Calories:</span>
                <span className="total-value">
                  {mealPlan.breakfast.calories + mealPlan.lunch.calories + mealPlan.dinner.calories + 
                    mealPlan.snacks.reduce((total, snack) => total + snack.calories, 0)} cal
                </span>
              </div>
            </div>
          ) : (
            <div className="empty-details">
              <p>No meal plan for this day</p>
              <button className="btn btn-primary">Create Meal Plan</button>
            </div>
          )}
        </div>
        
        <div className="details-section">
          <h4 className="section-title">Workout</h4>
          {workout ? (
            <div className="workout-details">
              <div className="workout-header">
                <h5 className="workout-name">{workout.name}</h5>
                <span className={`workout-type ${workout.type}`}>{workout.type}</span>
              </div>
              <p className="workout-duration">Duration: {workout.duration} minutes</p>
              <button className="btn btn-outline">View Workout Details</button>
            </div>
          ) : (
            <div className="empty-details">
              <p>No workout scheduled for this day</p>
              <button className="btn btn-primary">Schedule Workout</button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="calendar-view">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Calendar</h2>
        <p className="dashboard-subtitle">View and manage your meal plans and workouts</p>
      </div>
      
      <div className="calendar-layout">
        <div className="calendar-grid">
          {renderCalendar()}
        </div>
        
        <div className="day-details-container">
          {renderDayDetails()}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
