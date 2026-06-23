import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import LandingPage from './components/LandingPage';
import TextToVideoPage from './services/TextToVideoPage';
import VideoEditorPage from './components/VideoEditorPage';
import ErrorToast from './components/ErrorToast';
import { User, Page, VideoScriptScene } from './types';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [generatedScript, setGeneratedScript] = useState<VideoScriptScene[]>([]);
  const [initialPrompt, setInitialPrompt] = useState('');
  const [postLoginAction, setPostLoginAction] = useState<(() => void) | null>(null);
  const [error, setError] = useState<string | null>(null);

  const showError = (message: string) => {
    setError(message);
  };

  const handleLogin = useCallback(() => {
    setUser({
      name: 'Pengguna AI',
      email: 'user@example.com',
      credits: 100,
      avatarUrl: 'https://picsum.photos/100/100'
    });
    setIsLoggedIn(true);
  }, []);

  // Effect untuk menjalankan tindakan setelah login selesai
  useEffect(() => {
    if (isLoggedIn && postLoginAction) {
      postLoginAction();
      setPostLoginAction(null); // Hapus tindakan setelah eksekusi
    }
  }, [isLoggedIn, postLoginAction]);

  const handleLogout = useCallback(() => {
    setUser(null);
    setIsLoggedIn(false);
    setCurrentPage('landing');
  }, []);

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
    setSidebarOpen(false);
  };

  const handleScriptGenerated = (script: VideoScriptScene[]) => {
    setGeneratedScript(script);
    navigateTo('editor');
  }

  const handleGenerateVideo = (prompt: string) => {
    setInitialPrompt(prompt);
    const navigateAction = () => navigateTo('text-to-video');
    
    if (isLoggedIn) {
      navigateAction();
    } else {
      // Atur tindakan yang akan dilakukan setelah login, lalu picu login
      setPostLoginAction(() => navigateAction);
      handleLogin();
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'text-to-video':
        return <TextToVideoPage onScriptGenerated={handleScriptGenerated} initialPrompt={initialPrompt} showError={showError} />;
      case 'editor':
        return <VideoEditorPage initialScript={generatedScript} showError={showError} />;
      case 'landing':
      default:
        return <LandingPage onStartFree={handleLogin} onGenerateVideo={handleGenerateVideo} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Header 
        isLoggedIn={isLoggedIn} 
        user={user} 
        onLogin={handleLogin} 
        onLogout={handleLogout}
        toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} 
      />
      <Sidebar 
        isOpen={isSidebarOpen} 
        closeSidebar={() => setSidebarOpen(false)} 
        navigateTo={navigateTo}
      />
      <main className="pt-16"> {/* Add padding to avoid content being hidden by fixed header */}
        {renderPage()}
      </main>
      {error && <ErrorToast message={error} onClose={() => setError(null)} />}
    </div>
  );
};

export default App;