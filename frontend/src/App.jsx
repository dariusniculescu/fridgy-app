import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard";
import MyAccount from "./pages/MyAccount.jsx";
import Explore from "./pages/Explore.jsx";
import RecipePage from "./pages/RecipePage.jsx";
import UserAccount from "./pages/UserAccount.jsx";
import AddIngredient from "./pages/AddIngredient.jsx";
import ChangePassword from "./pages/ChangePassword.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ScrollToTop from "./util/ScrollToTop.jsx";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/recipes/:id" element={<RecipePage />} />
        <Route path="/users/:userId" element={<UserAccount />} />

        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute requiredRoles={["ADMIN"]}>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/add-ingredient" 
          element={
            <ProtectedRoute requiredRoles={["ADMIN", "REGULAR"]}>
              <AddIngredient />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/my-account" 
          element={
            <ProtectedRoute requiredRoles={["ADMIN", "REGULAR"]}>
              <MyAccount />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/change-password" 
          element={
            <ProtectedRoute requiredRoles={["ADMIN", "REGULAR"]}>
              <ChangePassword />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
