import { Route, Routes } from "react-router";
import Login from "./components/custom/Login";
import Signup from "./components/custom/Signup";
import Home from "./components/custom/Home";
import Profile from "./components/custom/Profile";
import PrivateRoute from "./components/custom/PrivateRoute";

function App() {
  return (
    <div>
      <Routes>
        <Route element={<Login />} path="/login" />
        <Route element={<Signup />} path="/signup" />
        <Route element={<Home />} path="/" />
        <Route
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
          path="/profile"
        />
      </Routes>
    </div>
  );
}

export default App;
