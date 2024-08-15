import React, { useContext } from 'react';
import '../index.css';
import { useNavigate } from "react-router-dom";

import { UpdatePassword  } from '@supabase/auth-ui-react'
import {
  // Import predefined theme
  ThemeSupa,
} from '@supabase/auth-ui-shared'
import { AppContext } from '../AppContext';

const ResetPasswordPage = () => {
  const { supabaseClient } = useContext(AppContext)
  const navigate = useNavigate();
  supabaseClient.auth.onAuthStateChange(async (event) => {
    if (event === "USER_UPDATED") {
      navigate("/")
    } 
  })
  return (
    <div className="App">
      <header className="App-header">
        <UpdatePassword
          supabaseClient={supabaseClient}
          appearance={{ theme: ThemeSupa }}
        />
      </header>
    </div>
  );

}

export default ResetPasswordPage
