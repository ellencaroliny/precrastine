import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import WelcomeScreen from './components/WelcomeScreen';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Dashboard from './components/Dashboard';

const AppContent: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'login' | 'register'>('welcome');
  const { user } = useAuth();

  // Initialize demo user data
  React.useEffect(() => {
    const users = JSON.parse(localStorage.getItem('precrastine_users') || '[]');
    const demoUser = users.find((u: any) => u.email === 'demo@precrastine.com');
    
    if (!demoUser) {
      const newDemoUser = {
        id: 'demo-user',
        email: 'demo@precrastine.com',
        name: 'Usuário Demo',
        password: 'demo123',
        createdAt: new Date(),
      };
      users.push(newDemoUser);
      localStorage.setItem('precrastine_users', JSON.stringify(users));
    }
  }, []);

  if (user) {
    return <Dashboard />;
  }

  switch (currentScreen) {
    case 'login':
      return <LoginForm onBack={() => setCurrentScreen('welcome')} />;
    case 'register':
      return <RegisterForm onBack={() => setCurrentScreen('welcome')} />;
    default:
      return (
        <WelcomeScreen
          onLogin={() => setCurrentScreen('login')}
          onRegister={() => setCurrentScreen('register')}
          onGuestLogin={() => {}} // Removido funcionalidade
        />
      );
  }
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;