import API from "./api";

export const registerUser =(data) => API.post("/auth/register",data);  //form Data will be Passed to the Backend

export const loginUser=(data)=> API.post("/auth/login",data);