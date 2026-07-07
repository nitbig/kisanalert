import React, { useState, useEffect, Suspense } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Home, Sprout, CloudRain, TrendingUp, User, MessageCircle, Headset, Sun, Moon, Globe } from 'lucide-react';
import { LogoFull, LogoMark } from '../Logo';
import WindLeaves from '../WindLeaves';

const NAV_ITEMS = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Advisory', path: '/advisory', icon: Sprout },
  { name: 'Weather Alert', path: '/weather', icon: CloudRain },
  { name: 'Market', path: '/market', icon: TrendingUp },
  { name: 'Assistant', path: '/assistant', icon: MessageCircle },
  { name: 'Kendra', path: '/expert', icon: Headset },
];

export default function Layout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (!document.getElementById('google-translate-script')) {
      // @ts-ignore
      window.googleTranslateElementInit = () => {
        // @ts-ignore
        if (window.google?.translate?.TranslateElement) {
          // @ts-ignore
          new window.google.translate.TranslateElement({
            pageLanguage: 'en',
            includedLanguages: 'en,hi,te,ta,mr,bn,gu,kn,ml,pa,or,as,ur',
            // @ts-ignore
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
          }, 'google_translate_element');
        }
      };

      const addScript = document.createElement('script');
      addScript.id = 'google-translate-script';
      addScript.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      addScript.async = true;
      document.body.appendChild(addScript);
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="flex h-screen bg-transparent text-[#1E2320] dark:text-[#FAFAF7] relative overflow-hidden">
      <div className="fixed inset-0 -z-20 bg-[#FAFAF7] dark:bg-[#121212]" />
      {/* Light, persistent ambient background gradient spots */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30 dark:opacity-20 z-0">
        <div className="absolute -top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#3C8B5C]/20 to-transparent blur-[120px] dark:from-[#6EE7B7]/10" />
        <div className="absolute top-1/2 -right-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-[#E0A93A]/15 to-transparent blur-[130px] dark:from-[#E0A93A]/10" />
      </div>
      <WindLeaves />
      {/* Global Google Translate Element */}
      <div 
        className="fixed bottom-24 right-4 md:bottom-[6.5rem] md:right-8 z-[100] w-14 h-14 bg-[#3C8B5C] dark:bg-[#6EE7B7] text-white dark:text-[#121212] rounded-full shadow-lg flex items-center justify-center hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden"
      >
        <Globe className="w-6 h-6 shrink-0 absolute pointer-events-none z-10" />
        <div id="google_translate_element" className="absolute -inset-4 z-20 opacity-0 cursor-pointer"></div>
      </div>

      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex flex-col transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'w-20 items-center px-2' : 'w-72'} border-r border-[#6B7268]/20 bg-[#FAFAF7] dark:bg-[#121212] py-4 h-full sticky top-0`}>
        <div 
          className={`mb-8 cursor-pointer flex justify-center w-full ${isSidebarCollapsed ? '' : 'pl-2 justify-start'}`} 
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          title="Toggle Sidebar"
        >
          {isSidebarCollapsed ? (
             <LogoMark className="text-[#3C8B5C] dark:text-[#6EE7B7] h-[38px] w-[38px] shrink-0" />
          ) : (
             <LogoFull className="text-[#3C8B5C] dark:text-[#6EE7B7] h-[38px] w-auto shrink-0" />
          )}
        </div>
        <nav className="flex-1 space-y-2 w-full">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center rounded-xl transition-colors ${isSidebarCollapsed ? 'justify-center p-3' : 'gap-4 px-4 py-3'} ${
                  isActive
                    ? 'bg-[#3C8B5C]/10 text-[#3C8B5C] dark:text-[#6EE7B7] dark:bg-[#6EE7B7]/10 font-medium'
                    : 'text-[#6B7268] dark:text-[#9CA3AF] hover:bg-[#3C8B5C]/5 dark:hover:bg-[#6EE7B7]/5 hover:text-[#1E2320] dark:hover:text-[#FAFAF7]'
                }`
              }
              title={isSidebarCollapsed ? item.name : undefined}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!isSidebarCollapsed && <span className="text-base">{item.name}</span>}
            </NavLink>
          ))}
        </nav>
        
        <div className="mt-auto w-full space-y-2">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`w-full flex items-center rounded-xl transition-colors ${isSidebarCollapsed ? 'justify-center p-3' : 'gap-4 px-4 py-3'} text-[#6B7268] dark:text-[#9CA3AF] hover:bg-[#3C8B5C]/5 dark:hover:bg-[#6EE7B7]/5 hover:text-[#1E2320] dark:hover:text-[#FAFAF7]`}
            title={isSidebarCollapsed ? 'Toggle Theme' : undefined}
          >
            {isDarkMode ? <Sun className="w-5 h-5 shrink-0" /> : <Moon className="w-5 h-5 shrink-0" />}
            {!isSidebarCollapsed && <span className="text-base">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center rounded-xl transition-colors ${isSidebarCollapsed ? 'justify-center p-3' : 'gap-4 px-4 py-3'} ${
                isActive
                  ? 'bg-[#3C8B5C]/10 text-[#3C8B5C] dark:text-[#6EE7B7] dark:bg-[#6EE7B7]/10 font-medium'
                  : 'text-[#6B7268] dark:text-[#9CA3AF] hover:bg-[#3C8B5C]/5 dark:hover:bg-[#6EE7B7]/5 hover:text-[#1E2320] dark:hover:text-[#FAFAF7]'
              }`
            }
            title={isSidebarCollapsed ? 'Profile' : undefined}
          >
            <User className="w-5 h-5 shrink-0" />
            {!isSidebarCollapsed && <span className="text-base">Profile</span>}
          </NavLink>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden shrink-0 flex items-center justify-between p-4 border-b border-[#6B7268]/10 bg-[#FAFAF7]/80 dark:bg-[#121212]/80 dark:border-[#FAFAF7]/10 backdrop-blur-md z-10">
          <LogoFull className="text-[#3C8B5C] dark:text-[#6EE7B7] h-[30px] w-auto" />
          <div className="flex items-center gap-2">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="text-[#6B7268] dark:text-[#9CA3AF] p-2">
              {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </button>
            <NavLink to="/profile" className="text-[#6B7268] dark:text-[#9CA3AF] p-2">
              <User className="w-6 h-6" />
            </NavLink>
          </div>
        </header>

        <div className={`flex-1 overflow-y-auto w-full pb-[80px] md:pb-0 ${location.pathname === '/' ? '' : 'pt-4 md:pt-8'}`}>
          <div className="max-w-7xl mx-auto w-full h-full">
            <Outlet />
          </div>
        </div>
        
        {/* Floating Assistant Button (Desktop) */}
        {location.pathname !== '/assistant' && (
          <NavLink 
            to="/assistant" 
            className="hidden md:flex fixed bottom-8 right-8 bg-[#3C8B5C] dark:bg-[#6EE7B7] text-white dark:text-[#121212] w-14 h-14 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all z-50 items-center justify-center"
          >
            <MessageCircle className="w-6 h-6" />
          </NavLink>
        )}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#FAFAF7] dark:bg-[#121212] border-t border-[#6B7268]/20 dark:border-[#FAFAF7]/10 flex justify-around p-2 pb-safe z-50">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center p-2 rounded-lg min-w-[64px] ${
                isActive ? 'text-[#3C8B5C] dark:text-[#6EE7B7]' : 'text-[#6B7268] dark:text-[#9CA3AF]'
              }`
            }
          >
            <item.icon className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
