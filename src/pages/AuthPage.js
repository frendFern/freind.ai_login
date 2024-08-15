import React , { useContext } from 'react';
import '../index.css';
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

import { Auth } from '@supabase/auth-ui-react'
import {
  // Import predefined theme
  ThemeSupa,
} from '@supabase/auth-ui-shared'
import { AppContext } from '../AppContext';

let frend_api_url = "https://d2141ekkpgdi0u.cloudfront.net";

const AuthenticationPage = () => {
  const { supabaseClient } = useContext(AppContext)
  const navigate = useNavigate();
  supabaseClient.auth.onAuthStateChange(async (event) => {
    if (event === "SIGNED_IN" && localStorage.getItem('auth_state_available') !== 'false') {
      localStorage.setItem('auth_state_available','false');
      const { data: { session } } = await supabaseClient.auth.getSession()
      const { user_details, membership_details } = await fetch(frend_api_url+'/get-user-and-membership-details', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id:session.user.id,
          email: session.user.email
        })
      })
      .then(response => response.json())
      .catch(error => console.error('Error:', error))

      let membership_id = membership_details?.id || uuidv4();
      if (!user_details || !membership_details){
        // It is a new user.
        await fetch(frend_api_url+'/create-new-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            membership_id,
            user_id: session.user.id,
            age: 0,
            agent_id: "timely",
            creation_date: session.user.created_at,
            email: session.user.email,
            first_name:"",
            last_name:"",
            language:"en",
            last_login_date: session.user.last_sign_in_at,
            telegram_id:"",
            web_id:""
          })
        })
        .then(response => response.json())
        .catch(error => console.error('Error:', error))
      }
      const cookie = {
        "session": session,
        "has_membership": membership_details?.has_active_subscription || false,
        "membership_id": membership_id
      }
      localStorage.setItem('cookie', JSON.stringify(cookie))
      localStorage.setItem('auth_state_available','true');
      navigate("/")
      window.location.reload()
    } 
  });
    return (
      <div className="App">
        <header className="App-header">
          <Auth
            supabaseClient={supabaseClient}
            appearance={{ 
              theme: ThemeSupa
            }}
            providers={[]}
            theme="dark"
          />
        </header>
      </div>
    );
}

export default AuthenticationPage
