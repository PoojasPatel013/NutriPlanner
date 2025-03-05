"use client"

import { useState, useEffect } from "react"
import { LineChart, Scale, TrendingUp, TrendingDown, Calendar, Plus } from "lucide-react"
import "./ProgressTracker.css"

const ProgressTracker = ({ userData }) => {
  const [activeTab, setActiveTab] = useState("weight")
  const [weightData, setWeightData] = useState([])
  const [measurementsData, setMeasurementsData] = useState([])
  const [nutritionData, setNutritionData] = useState([])
  const [showAddWeightModal, setShowAddWeightModal] = useState(false)
  const [showAddMeasurementModal, setShowAddMeasurementModal] = useState(false)
  const [newWeight, setNewWeight] = useState("")
  const [newMeasurements, setNewMeasurements] = useState({
    chest: "",
    waist: "",
    hips: "",
    arms: "",
    thighs: "",
  })

  // Load data from localStorage on component mount
  useEffect(() => {
    // Load weight data
    const savedWeightData = localStorage.getItem("weightData")
    if (savedWeightData) {
      setWeightData(JSON.parse(savedWeightData))
    }

    // Load measurements data
    const savedMeasurementsData = localStorage.getItem("measurementsData")
    if (savedMeasurementsData) {
      setMeasurementsData(JSON.parse(savedMeasurementsData))
    }

    // Load nutrition history for the nutrition tab
    const savedNutritionHistory = localStorage.getItem("nutritionHistory")
    if (savedNutritionHistory) {
      setNutritionData(JSON.parse(savedNutritionHistory))
    } else {
      // If no nutrition history, try to get from daily food log
      const today = new Date().toISOString().split("T")[0]
      const savedFoodLog = localStorage.getItem(`foodLog_${today}`)
      if (savedFoodLog) {
        const foodLog = JSON.parse(savedFoodLog)
        const totals = foodLog.reduce(
          (acc, food) => {
            acc.calories += food.calories
            acc.protein += food.protein
            acc.carbs += food.carbs
            acc.fat += food.fat
            return acc
          },
          { calories: 0, protein: 0, carbs: 0, fat: 0 },
        )

        setNutritionData([{ date: today, ...totals }])
      }
    }
  }, [])

  // Calculate weight change
  const weightChange = weightData.length > 1 ? weightData[weightData.length - 1].weight - weightData[0].weight : 0

  // Calculate waist change
  const waistChange =
    measurementsData.length > 1 ? measurementsData[measurementsData.length - 1].waist - measurementsData[0].waist : 0

  // Calculate average daily calories
  const avgCalories =
    nutritionData.length > 0 ? nutritionData.reduce((sum, day) => sum + day.calories, 0) / nutritionData.length : 0

  const handleAddWeight = () => {
    setShowAddWeightModal(true)
  }

  const handleAddMeasurement = () => {
    setShowAddMeasurementModal(true)
  }

  const handleWeightSubmit = (e) => {
    e.preventDefault()

    const today = new Date().toISOString().split("T")[0]
    const newWeightEntry = {
      date: today,
      weight: Number.parseFloat(newWeight),
    }

    // Add to weight data
    const updatedWeightData = [...weightData, newWeightEntry].sort((a, b) => new Date(a.date) - new Date(b.date))

    setWeightData(updatedWeightData)
    localStorage.setItem("weightData", JSON.stringify(updatedWeightData))

    // Reset form and close modal
    setNewWeight("")
    setShowAddWeightModal(false)
  }

  const handleMeasurementSubmit = (e) => {
    e.preventDefault()

    const today = new Date().toISOString().split("T")[0]
    const newMeasurementEntry = {
      date: today,
      chest: Number.parseFloat(newMeasurements.chest),
      waist: Number.parseFloat(newMeasurements.waist),
      hips: Number.parseFloat(newMeasurements.hips),
      arms: Number.parseFloat(newMeasurements.arms),
      thighs: Number.parseFloat(newMeasurements.thighs),
    }

    // Add to measurements data
    const updatedMeasurementsData = [...measurementsData, newMeasurementEntry].sort(
      (a, b) => new Date(a.date) - new Date(b.date),
    )

    setMeasurementsData(updatedMeasurementsData)
    localStorage.setItem("measurementsData", JSON.stringify(updatedMeasurementsData))

    // Reset form and close modal
    setNewMeasurements({
      chest: "",
      waist: "",
      hips: "",
      arms: "",
      thighs: "",
    })
    setShowAddMeasurementModal(false)
  }

  const handleMeasurementChange = (e) => {
    const { name, value } = e.target
    setNewMeasurements((prev) => ({ ...prev, [name]: value }))
  }

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
            <div className="summary-value">
              {weightData.length > 0 ? `${weightData[weightData.length - 1].weight} lbs` : "No data"}
            </div>
            {weightData.length > 1 && (
              <div className={`summary-change ${weightChange < 0 ? "positive-change" : "negative-change"}`}>
                {weightChange < 0 ? <TrendingDown size={16} /> : <TrendingUp size={16} />}
                <span>{Math.abs(weightChange)} lbs since start</span>
              </div>
            )}
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon waist-icon">
            <LineChart size={24} />
          </div>
          <div className="summary-content">
            <h3 className="summary-title">Waist Measurement</h3>
            <div className="summary-value">
              {measurementsData.length > 0 ? `${measurementsData[measurementsData.length - 1].waist} in` : "No data"}
            </div>
            {measurementsData.length > 1 && (
              <div className={`summary-change ${waistChange < 0 ? "positive-change" : "negative-change"}`}>
                {waistChange < 0 ? <TrendingDown size={16} /> : <TrendingUp size={16} />}
                <span>{Math.abs(waistChange)} in since start</span>
              </div>
            )}
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
              <span>Last {nutritionData.length} days</span>
            </div>
          </div>
        </div>
      </div>

      <div className="progress-tabs">
        <button
          className={`tab-button ${activeTab === "weight" ? "active" : ""}`}
          onClick={() => setActiveTab("weight")}
        >
          Weight History
        </button>
        <button
          className={`tab-button ${activeTab === "measurements" ? "active" : ""}`}
          onClick={() => setActiveTab("measurements")}
        >
          Body Measurements
        </button>
        <button
          className={`tab-button ${activeTab === "nutrition" ? "active" : ""}`}
          onClick={() => setActiveTab("nutrition")}
        >
          Nutrition History
        </button>
      </div>

      <div className="progress-content">
        {activeTab === "weight" && (
          <div className="weight-history">
            <div className="chart-container">
              <div className="weight-chart">
                {weightData.length > 0 ? (
                  <div className="chart-bars">
                    {weightData.map((entry, index) => {
                      // Calculate height percentage based on min/max weight
                      const weights = weightData.map((d) => d.weight)
                      const minWeight = Math.min(...weights)
                      const maxWeight = Math.max(...weights)
                      const range = maxWeight - minWeight
                      const heightPercentage = range > 0 ? ((entry.weight - minWeight) / range) * 70 + 10 : 50

                      return (
                        <div key={index} className="chart-bar-container">
                          <div className="chart-date">
                            {new Date(entry.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                          </div>
                          <div className="chart-bar-wrapper">
                            <div
                              className="chart-bar"
                              style={{ height: `${heightPercentage}%` }}
                              title={`${entry.weight} lbs`}
                            >
                              <div className="bar-value">{entry.weight}</div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="empty-chart">
                    <p>No weight data available. Start tracking your weight to see progress.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="data-table">
              <div className="table-header">
                <h3 className="table-title">Weight Log</h3>
                <button className="btn btn-primary" onClick={handleAddWeight}>
                  <Plus size={16} />
                  Add Weight Entry
                </button>
              </div>
              <div className="table-container">
                {weightData.length > 0 ? (
                  <table className="progress-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Weight (lbs)</th>
                        <th>Change</th>
                      </tr>
                    </thead>
                    <tbody>
                      {weightData
                        .slice()
                        .reverse()
                        .map((entry, index, arr) => {
                          const prevEntry = index < arr.length - 1 ? arr[index + 1] : null
                          const change = prevEntry ? entry.weight - prevEntry.weight : 0

                          return (
                            <tr key={entry.date}>
                              <td>{new Date(entry.date).toLocaleDateString()}</td>
                              <td>{entry.weight}</td>
                              <td className={change === 0 ? "" : change < 0 ? "positive-change" : "negative-change"}>
                                {change === 0 ? "-" : `${change > 0 ? "+" : ""}${change} lbs`}
                              </td>
                            </tr>
                          )
                        })}
                    </tbody>
                  </table>
                ) : (
                  <div className="empty-table">
                    <p>No weight entries yet. Add your first weight entry to start tracking.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "measurements" && (
          <div className="measurements-history">
            <div className="chart-container">
              <div className="measurements-chart">
                {measurementsData.length > 0 ? (
                  <div className="measurements-visualization">
                    <div className="measurement-type-labels">
                      <div className="measurement-label">Chest</div>
                      <div className="measurement-label">Waist</div>
                      <div className="measurement-label">Hips</div>
                      <div className="measurement-label">Arms</div>
                      <div className="measurement-label">Thighs</div>
                    </div>
                    <div className="measurement-trends">
                      {measurementsData.map((entry, index) => (
                        <div key={index} className="measurement-date-group">
                          <div className="measurement-date">
                            {new Date(entry.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                          </div>
                          <div className="measurement-values">
                            <div className="measurement-value">{entry.chest} in</div>
                            <div className="measurement-value">{entry.waist} in</div>
                            <div className="measurement-value">{entry.hips} in</div>
                            <div className="measurement-value">{entry.arms} in</div>
                            <div className="measurement-value">{entry.thighs} in</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="empty-chart">
                    <p>No measurement data available. Start tracking your measurements to see progress.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="data-table">
              <div className="table-header">
                <h3 className="table-title">Measurements Log</h3>
                <button className="btn btn-primary" onClick={handleAddMeasurement}>
                  <Plus size={16} />
                  Add Measurement Entry
                </button>
              </div>
              <div className="table-container">
                {measurementsData.length > 0 ? (
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
                      {measurementsData
                        .slice()
                        .reverse()
                        .map((entry) => (
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
                ) : (
                  <div className="empty-table">
                    <p>No measurement entries yet. Add your first measurement entry to start tracking.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "nutrition" && (
          <div className="nutrition-history">
            <div className="chart-container">
              <div className="nutrition-chart">
                {nutritionData.length > 0 ? (
                  <div className="chart-bars">
                    {nutritionData.map((entry, index) => (
                      <div key={index} className="nutrition-bar-group">
                        <div className="chart-date">
                          {new Date(entry.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                        </div>
                        <div className="nutrition-bars">
                          <div
                            className="nutrition-bar calories-bar"
                            style={{ height: `${(entry.calories / (userData?.calorieGoal || 2000)) * 100}%` }}
                            title={`${entry.calories} calories`}
                          >
                            <div className="bar-value">{entry.calories}</div>
                          </div>
                          <div
                            className="nutrition-bar protein-bar"
                            style={{ height: `${(entry.protein / (userData?.nutritionGoals?.protein || 150)) * 100}%` }}
                            title={`${entry.protein}g protein`}
                          >
                            <div className="bar-value">{entry.protein}g</div>
                          </div>
                          <div
                            className="nutrition-bar carbs-bar"
                            style={{ height: `${(entry.carbs / (userData?.nutritionGoals?.carbs || 200)) * 100}%` }}
                            title={`${entry.carbs}g carbs`}
                          >
                            <div className="bar-value">{entry.carbs}g</div>
                          </div>
                          <div
                            className="nutrition-bar fat-bar"
                            style={{ height: `${(entry.fat / (userData?.nutritionGoals?.fat || 65)) * 100}%` }}
                            title={`${entry.fat}g fat`}
                          >
                            <div className="bar-value">{entry.fat}g</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-chart">
                    <p>No nutrition data available. Start logging your meals to see nutrition history.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="data-table">
              <h3 className="table-title">Nutrition Log</h3>
              <div className="table-container">
                {nutritionData.length > 0 ? (
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
                      {nutritionData
                        .slice()
                        .reverse()
                        .map((entry) => (
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
                ) : (
                  <div className="empty-table">
                    <p>No nutrition entries yet. Log your meals in the Nutrition Tracker to see data here.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Weight Modal */}
      {showAddWeightModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Add Weight Entry</h3>
              <button className="close-modal-btn" onClick={() => setShowAddWeightModal(false)}>
                &times;
              </button>
            </div>
            <form onSubmit={handleWeightSubmit}>
              <div className="form-group">
                <label htmlFor="weight" className="form-label">
                  Weight (lbs)
                </label>
                <input
                  type="number"
                  id="weight"
                  className="form-input"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  step="0.1"
                  required
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowAddWeightModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Measurement Modal */}
      {showAddMeasurementModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Add Measurement Entry</h3>
              <button className="close-modal-btn" onClick={() => setShowAddMeasurementModal(false)}>
                &times;
              </button>
            </div>
            <form onSubmit={handleMeasurementSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="chest" className="form-label">
                    Chest (in)
                  </label>
                  <input
                    type="number"
                    id="chest"
                    name="chest"
                    className="form-input"
                    value={newMeasurements.chest}
                    onChange={handleMeasurementChange}
                    step="0.1"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="waist" className="form-label">
                    Waist (in)
                  </label>
                  <input
                    type="number"
                    id="waist"
                    name="waist"
                    className="form-input"
                    value={newMeasurements.waist}
                    onChange={handleMeasurementChange}
                    step="0.1"
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="hips" className="form-label">
                    Hips (in)
                  </label>
                  <input
                    type="number"
                    id="hips"
                    name="hips"
                    className="form-input"
                    value={newMeasurements.hips}
                    onChange={handleMeasurementChange}
                    step="0.1"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="arms" className="form-label">
                    Arms (in)
                  </label>
                  <input
                    type="number"
                    id="arms"
                    name="arms"
                    className="form-input"
                    value={newMeasurements.arms}
                    onChange={handleMeasurementChange}
                    step="0.1"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="thighs" className="form-label">
                    Thighs (in)
                  </label>
                  <input
                    type="number"
                    id="thighs"
                    name="thighs"
                    className="form-input"
                    value={newMeasurements.thighs}
                    onChange={handleMeasurementChange}
                    step="0.1"
                    required
                  />
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowAddMeasurementModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProgressTracker

