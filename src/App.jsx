import React, { useState } from 'react';
import Navbar from './components/navigation/Navbar';
import LandingPage from './pages/LandingPage';
import HowItWorksPage from './pages/HowItWorksPage';
import FeaturesPage from './pages/FeaturesPage';
import AuthPage from './pages/AuthPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [dashboardSubTab, setDashboardSubTab] = useState('overview');

  const handleNavigate = (page, subTab = 'overview') => {
    setCurrentPage(page);
    if (subTab) {
      setDashboardSubTab(subTab);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isPublicPage = ['landing', 'how-it-works', 'features'].includes(currentPage);

  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen bg-dark-bg text-slate-100 flex flex-col font-sans">
          
          {/* Global Header for public marketing and how-it-works pages */}
          {isPublicPage && (
            <Navbar 
              currentRoute={currentPage} 
              onNavigate={handleNavigate} 
            />
          )}

          {/* Page Routing */}
          <div className="flex-1">
            {currentPage === 'landing' && (
              <LandingPage onNavigate={handleNavigate} />
            )}

            {currentPage === 'how-it-works' && (
              <HowItWorksPage onNavigate={handleNavigate} />
            )}

            {currentPage === 'features' && (
              <FeaturesPage onNavigate={handleNavigate} />
            )}

            {currentPage === 'auth' && (
              <AuthPage onNavigate={handleNavigate} />
            )}

            {currentPage === 'onboarding' && (
              <OnboardingPage onNavigate={handleNavigate} />
            )}

            {currentPage === 'dashboard' && (
              <DashboardPage 
                initialTab={dashboardSubTab} 
                onNavigateLanding={() => handleNavigate('landing')}
              />
            )}
          </div>

        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}
