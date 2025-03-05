import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import LoginForm from './components/LoginForm';
import './index.css';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Check if user data exists in local storage
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (user) => {
    setUserData(user);
    setIsLoggedIn(true);
    localStorage.setItem('userData', JSON.stringify(user));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData(null);
    localStorage.removeItem('userData');
  };

  return (
    <div className="app">
      {!isLoggedIn ? (
        <LoginForm onLogin={handleLogin} />
      ) : (
        <div className="app-container">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="main-content">
            <Header userData={userData} onLogout={handleLogout} />
            <Dashboard activeTab={activeTab} userData={userData} setUserData={setUserData} />
          </div>
        </div>
      )}
    </div>
  );
}
