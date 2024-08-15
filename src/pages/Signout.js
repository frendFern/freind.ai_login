import { useContext, useEffect } from 'react';
import '../index.css';
import { AppContext } from '../AppContext';
import { useNavigate } from 'react-router-dom';

const SignOut = () => {
    const { supabaseClient } = useContext(AppContext)
    const navigate = useNavigate();

    localStorage.clear()

    useEffect(() => {
        const supabaseSignout = async () => {
            await supabaseClient.auth.signOut();
        }
        supabaseSignout();
        navigate("/")
    }, [navigate, supabaseClient.auth]);

    return (
        <div></div>
    );
}

export default SignOut
