import { useState } from 'react';
import { Sun, Moon, User, LogOut } from 'lucide-react';
import './Header.css';

const Header = ({ userData, onLogout }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <h1 className="header-title">NutriPlan AI</h1>
        
        <div className="header-actions">
          <button 
            className="theme-toggle" 
            onClick={toggleDarkMode}
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <div className="user-menu">
            <div className="user-info">
              <div className="user-avatar">
                <User size={20} />
              </div>
              <span className="user-name">{userData?.name || 'User'}</span>
            </div>
            
            <button className="logout-button" onClick={onLogout}>
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
