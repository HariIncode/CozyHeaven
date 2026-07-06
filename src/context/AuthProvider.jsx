import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import AuthContext from './AuthContext';

function AuthProvider({children}) {

    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [user, setUser] = useState( JSON.parse(localStorage.getItem("user") || null));

    const navigate = useNavigate();

    const login = (jwtToken, userData) =>{
        localStorage.setItem("token", jwtToken);
        localStorage.setItem("user", JSON.stringify(userData));
        setToken(jwtToken);
        setUser(userData);

        if(userData.role === "ADMIN"){
            navigate("/admin/dashboard");
        }else if(userData.role === "HOTEL_OWNER"){
            navigate("/hotels");
        }else{
            navigate("/hotels");
        }
    }

    const logout = () => {
        localStorage.clear();
        setToken(null);
        setUser(null);
        navigate("/login");
    }

    const isLoggedIn = !!token;

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isLoggedIn }}>
        {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider;