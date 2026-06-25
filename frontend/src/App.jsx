import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
         <ToastContainer position="top-right" autoClose={2000}  theme="dark"  />
    </AuthProvider>
  );
}

export default App;