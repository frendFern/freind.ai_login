import React , { useEffect, useContext } from 'react';

import { AppContext } from '../AppContext';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from "react-router-dom";

let frend_api_url = "https://d2141ekkpgdi0u.cloudfront.net";
let hasCreatedUser = false;
let navigate;

/*
function saveUserInfo() {
    // TODO: Save user data to DB.
    navigate("/")
    window.location.reload()
}
*/

const createNewUser = async (supabaseClient) => {
    const { data: { session } } = await supabaseClient.auth.getSession()
    
    // Kick user out of page if unauthorized
    if (!session){
        navigate("/")
        return; 
    }

    // Check if the user is already created.
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

    // Create the new user if user does not exist.
    let membership_id = membership_details?.id || uuidv4();
    if (!user_details || !membership_details){
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
}
const NewUserPage = () => {
    const { supabaseClient } = useContext(AppContext)
    navigate = useNavigate();
    useEffect(() => { 
        if (!hasCreatedUser){
            hasCreatedUser = true;
            createNewUser(supabaseClient);
        }
    }, [supabaseClient]);
    return(
        <div className="font-mono pt-6">
            <div className="">
                <h1 className=" text-center pl-4 title font-mono text-neutral-200 text-5xl font-medium leading-[171.43%] self-stretch  mr-px mt-2">Personalize Your AI Experience</h1>
            </div>
            <div>
                <form className="new-user-form">
                    <div className="">
                        <div className='p-2 mb-5'>
                            <label className="font-mono block text-white text-xl mb-2">First name</label>
                            <input type="text" id="first_name" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" placeholder="John" required />
                        </div>
                        <div className='p-2 mb-5'>
                            <label className="font-mono block text-white text-xl mb-2">Last name</label>
                            <input type="text" id="last_name" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" placeholder="Doe" required />
                        </div>
                        <div className='p-2 mb-5'>
                            <label className="font-mono block text-white text-xl mb-2">Age</label>
                            <input type="number" id="age" aria-describedby="helper-text-explanation" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" placeholder="18" required />
                        </div>
                    </div>
                    <div className="mb-6">
                        <div className="flex justify-center h-5 px-2">
                            <input id="remember" type="checkbox" value="" className="w-4 h-4 " required />
                            <label className="px-2 text-white">I agree with the <a href="/privacy-policy" className="text-blue-600 hover:underline dark:text-blue-500">terms and conditions</a>.</label>
                        </div>
                    </div>
                    <div className="flex justify-center">
                        
                        <button type="submit" className="submit-self-info text-white bg-emerald-700 hover:bg-emerald-800 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Submit</button>
                    </div>                
                </form>
            </div>
        </div>
    )
}
export default NewUserPage