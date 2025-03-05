import { useState } from 'react';
import { LineChart, Scale, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import './ProgressTracker.css';

const ProgressTracker = ({ userData }) => {
  const [activeTab, setActiveTab] = useState('weight');
  
  // Sample weight data
  const weightData = [
    { date: '2023-01-01', weight: 185 },
    { date: '2023-01-08', weight: 183 },
    { date: '2023-01-15', weight: 181 },
    { date: '2023-01-22', weight: 180 },
    { date: '2023-01-29', weight: 178 },
    { date: '2023-02-05', weight: 177 },
    { date: '2023-02-12', weight: 176 },
    { date: '2023-02-19', weight: 175 },
    { date: '2023-02-26', weight: 174 },
    { date: '2023-03-05', weight: 173 },
    { date: '2023-03-12', weight: 172 },
  ];
  
  // Sample body measurements
  const measurementsData = [
    { date: '2023-01-01', chest: 42, waist: 36, hips: 40, arms: 14, thighs: 24 },
    { date: '2023-01-15', chest: 41.5, waist: 35, hips: 39.5, arms: 14.2, thighs: 23.5 },
    { date: '2023-02-01', chest: 41, waist: 34, hips: 39, arms: 14.5, thighs: 23 },
    { date: '2023-02-15', chest: 40.5, waist: 33, hips: 38.5, arms: 14.8, thighs: 22.5 },
    { date: '2023-03-01', chest: 40, waist: 32, hips: 38, arms: 15, thighs: 22 },
  ];
  
  // Sample nutrition data
  const nutritionData = [
    { date: '2023-03-06', calories: 1950, protein: 145, carbs: 180, fat: 60 },
    { date: '2023-03-07', calories: 2050, protein: 155, carbs: 190, fat: 65 },
    { date: '2023-03-08', calories: 1900, protein: 150, carbs: 170, fat: 55 },
    { date: '2023-03-09', calories: 2100, protein: 160, carbs: 195, fat: 70 },
    { date: '2023-03-10', calories: 1850, protein: 140, carbs: 165, fat: 58 },
    { date: '2023-03-11', calories: 2000, protein: 152, carbs: 185, fat: 63 },
    { date: '2023-03-12', calories: 1920, protein: 148, carbs: 175, fat: 60 },
  ];
  
  // Calculate weight change
  const weightChange = weightData.length > 1 
    ? weightData[weightData.length - 1].weight - weightData[0].weight 
    : 0;
  
  // Calculate average daily calories
  const avgCalories = nutritionData.reduce((sum, day) => sum + day.calories, 0) / nutritionData.length;
  
  // Calculate waist change
  const waistChange = measurementsData.length > 1 
    ? measurementsData[measurementsData.length - 1].waist - measurementsData[0].waist 
    : 0;

  return (
    <div className="progress-tracker">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Progress Tracker</h2>
        <p className="dashboard-subtitle">Track your fitness journey and see your progress over time</p>
      </div>
      
      <div className="progress-summary">
        <div className="summary-card">
          <div className="summary-icon weight-icon">
            <Scale size={24} />
          </div>
          <div className="summary-content">
            <h3 className="summary-title">Current Weight</h3>
            <div className="summary-value">{weightData[weightData.length - 1].weight} lbs</div>
            <div className={`summary-change ${weightChange < 0 ? 'positive-change' : 'negative-change'}`}>
              {weightChange < 0 ? <TrendingDown size={16} /> : <TrendingUp size={16} />}
              <span>{Math.abs(weightChange)} lbs since start</span>
            </div>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="summary-icon waist-icon">
            <LineChart size={24} />
          </div>
          <div className="summary-content">
            <h3 className="summary-title">Waist Measurement</h3>
            <div className="summary-value">{measurementsData[measurementsData.length - 1].waist} in</div>
            <div className={`summary-change ${waistChange < 0 ? 'positive-change' : 'negative-change'}`}>
              {waistChange < 0 ? <TrendingDown size={16} /> : <TrendingUp size={16} />}
              <span>{Math.abs(waistChange)} in since start</span>
            </div>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="summary-icon calories-icon">
            <Calendar size={24} />
          </div>
          <div className="summary-content">
            <h3 className="summary-title">Avg. Daily Calories</h3>
            <div className="summary-value">{Math.round(avgCalories)} cal</div>
            <div className="summary-note">
              <span>Last 7 days</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="progress-tabs">
        <button 
          className={`tab-button ${activeTab === 'weight' ? 'active' : ''}`}
          onClick={() => setActiveTab('weight')}
        >
          Weight History
        </button>
        <button 
          className={`tab-button ${activeTab === 'measurements' ? 'active' : ''}`}
          onClick={() => setActiveTab('measurements')}
        >
          Body Measurements
        </button>
        <button 
          className={`tab-button ${activeTab === 'nutrition' ? 'active' : ''}`}
          onClick={() => setActiveTab('nutrition')}
        >
          Nutrition History
        </button>
      </div>
      
      <div className="progress-content">
        {activeTab === 'weight' && (
          <div className="weight-history">
            <div className="chart-container">
              <div className="chart-placeholder">
                <p>Weight history chart will be displayed here</p>
              </div>
            </div>
            
            <div className="data-table">
              <h3 className="table-title">Weight Log</h3>
              <div className="table-container">
                <table className="progress-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Weight (lbs)</th>
                      <th>Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {weightData.slice().reverse().map((entry, index, arr) => {
                      const prevEntry = index < arr.length - 1 ? arr[index + 1] : null;
                      const change = prevEntry ? entry.weight - prevEntry.weight : 0;
                      
                      return (
                        <tr key={entry.date}>
                          <td>{new Date(entry.date).toLocaleDateString()}</td>
                          <td>{entry.weight}</td>
                          <td className={change === 0 ? '' : change < 0 ? 'positive-change' : 'negative-change'}>
                            {change === 0 ? '-' : `${change > 0 ? '+' : ''}${change} lbs`}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              <div className="table-actions">
                <button className="btn btn-primary">Add Weight Entry</button>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'measurements' && (
          <div className="measurements-history">
            <div className="chart-container">
              <div className="chart-placeholder">
                <p>Body measurements chart will be displayed here</p>
              </div>
            </div>
            
            <div className="data-table">
              <h3 className="table-title">Measurements Log</h3>
              <div className="table-container">
                <table className="progress-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Chest (in)</th>
                      <th>Waist (in)</th>
                      <th>Hips (in)</th>
                      <th>Arms (in)</th>
                      <th>Thighs (in)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {measurementsData.slice().reverse().map((entry) => (
                      <tr key={entry.date}>
                        <td>{new Date(entry.date).toLocaleDateString()}</td>
                        <td>{entry.chest}</td>
                        <td>{entry.waist}</td>
                        <td>{entry.hips}</td>
                        <td>{entry.arms}</td>
                        <td>{entry.thighs}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="table-actions">
                <button className="btn btn-primary">Add Measurement Entry</button>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'nutrition' && (
          <div className="nutrition-history">
            <div className="chart-container">
              <div className="chart-placeholder">
                <p>Nutrition history chart will be displayed here</p>
              </div>
            </div>
            
            <div className="data-table">
              <h3 className="table-title">Nutrition Log</h3>
              <div className="table-container">
                <table className="progress-table">
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
                    {nutritionData.slice().reverse().map((entry) => (
                      <tr key={entry.date}>
                        <td>{new Date(entry.date).toLocaleDateString()}</td>
                        <td>{entry.calories}</td>
                        <td>{entry.protein}</td>
                        <td>{entry.carbs}</td>
                        <td>{entry.fat}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressTracker;
