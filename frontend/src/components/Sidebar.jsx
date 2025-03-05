import { Home, Utensils, LineChart, Apple, Calendar, Settings } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home size={20} /> },
    { id: 'meal-planner', label: 'Meal Planner', icon: <Utensils size={20} /> },
    { id: 'nutrition', label: 'Nutrition', icon: <Apple size={20} /> },
    { id: 'progress', label: 'Progress', icon: <LineChart size={20} /> },
    { id: 'calendar', label: 'Calendar', icon: <Calendar size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-logo">NutriPlan</h2>
      </div>
      
      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          {menuItems.map((item) => (
            <li key={item.id} className="sidebar-menu-item">
              <button
                className={`sidebar-menu-button ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <span className="sidebar-menu-icon">{item.icon}</span>
                <span className="sidebar-menu-label">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        <div className="sidebar-upgrade">
          <p className="sidebar-upgrade-text">Upgrade to Pro</p>
          <button className="sidebar-upgrade-button">Upgrade</button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
