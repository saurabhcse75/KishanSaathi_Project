import axios from "axios";

const API=axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
    timeout: 10000,
});

API.interceptors.request.use((req)=>{
    const auth=JSON.parse(localStorage.getItem("auth"));

    if(auth?.token){
        req.headers.Authorization=`Bearer ${auth.token}`;
    }
    return req;
});


// Auto Logout
API.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);


export default API;