import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js'
import { AppContext } from './AppContext';

import LeftNavBar from './components/LeftNavBar';
import TopNavBar from './components/TopNavBar';
import MobileNavBar from './components/MobileNavBar'; 

import ExplorePage from './pages/ExplorePage';
import GalleryPage from './pages/GalleryPage';
import CreateAIPage from './pages/CreateAIPage';
import ChatPage from './pages/ChatPage';
import MyAIPage from './pages/MyAIPage';
import PremiumPage from './pages/PremiumPage';
import DefaultChatPage from './pages/DefaultChatPage'; 
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';

import Footer from './components/Footer';
import AuthenticationPage from './pages/AuthPage';
import SignOut from './pages/Signout';
import ResetPasswordPage from './pages/ResetPasswordPage';
import PurchaseSuccessPage from './pages/PurchaseSuccessPage';
import NewUserPage from './pages/NewUserPage';


const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_PUBLIC_KEY; 
const supabaseClient = createClient(supabaseUrl, supabaseKey)
localStorage.setItem('auth_state_available','true');

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };


  function MainPage() {
    const { pathname } = useLocation();
    const isChatPage = pathname.startsWith('/chat');
    const isPrivacyPage = pathname.startsWith('/privacy-policy')
    const isNewUserPage = pathname.startsWith('/newuser')
  
    if (pathname === "/login") {
      return (
        <Routes>
          <Route
            path="/login" 
            element={ localStorage.getItem("cookie") === null ? <AuthenticationPage /> : <Navigate replace to={"/"}/> } />
        </Routes>
      );
    }

    return (
      <div className="flex flex-col h-screen">
        <TopNavBar onToggle={toggleMobileMenu} /> 
        <MobileNavBar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
        <div className="flex flex-1">
          {!isChatPage && !isPrivacyPage && !isNewUserPage && <LeftNavBar />}
          <div className="flex-1 ">
            <Routes>
              <Route path="/" element={<ExplorePage/>}  />
              <Route path="/chat/:avatarName" element={<ChatPage />} />
              <Route path="/chat" element={<DefaultChatPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/create-AI" element={<CreateAIPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/my-AI" element={<MyAIPage />} />
              <Route path="/logout" element={<SignOut />} />
              <Route
                path="/resetpassword" 
                element={ localStorage.getItem("cookie") !== null ? <ResetPasswordPage /> : <Navigate replace to={"/login"}/> } />
              <Route
                path="/premium" 
                element={ localStorage.getItem("cookie") !== null ? <PremiumPage /> : <Navigate replace to={"/login"}/> } />
              <Route
                path="/purchase-success" 
                element={ localStorage.getItem("cookie") !== null ? <PurchaseSuccessPage /> : <Navigate replace to={"/"}/> } />
              <Route path="/newuser" element={<NewUserPage />} />
            </Routes>
          </div>
        </div>
        {(!isPrivacyPage && !isChatPage) && <Footer />}
      </div>
    );
  }

  return (
    <AppContext.Provider value={{ supabaseClient }}>
      <Router>
        <MainPage/>
      </Router>
    </AppContext.Provider>
  );
}

export default App;
