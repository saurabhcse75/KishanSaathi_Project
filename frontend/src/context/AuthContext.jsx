import { createContext,useEffect,useState } from "react";

export const AuthContext=createContext();                         

export const AuthProvider =({children})=>{
    const [auth,setAuth]=useState(
        JSON.parse(localStorage.getItem("auth")) || null
    );

    const login =(data)=>{
         localStorage.setItem("auth",JSON.stringify(data));   //we are saving with auth Name
         setAuth(data);
    };

    const logout= ()=>{
        localStorage.removeItem("auth");
        setAuth(null);``
    };


//     What this does:
// Listens for changes in localStorage from other tabs.
// If user logs out in one tab → all tabs log out automatically.

// 👉 Example:

// Tab 1 → logout
// Tab 2 → instantly detects and logs out


    useEffect(()=>{
        const checkAuth = () =>{
            const stored =localStorage.getItem("auth");
            if (stored) {
           setAuth(JSON.parse(stored));
             } else {
            setAuth(null);
        }
    };

    window.addEventListener("storage",checkAuth);
   
    return ()=>{
         window.removeEventListener("storage", checkAuth);
    };


},[]);

    return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
    );
};