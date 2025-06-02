import { Route, Routes } from "react-router";
import Login from "./components/custom/Auth/Login";
import Signup from "./components/custom/Auth/Signup";
import Home from "./components/custom/Home";
import Profile from "./components/custom/Auth/Profile";
import PrivateRoute from "./components/custom/Auth/PrivateRoute";
import CreateProject from "./components/custom/Project/CreateProject";
import AuthComponentWrapper from "./components/custom/Auth/AuthComponentWarpper";
import AllProjects from "./components/custom/Project/AllProjects";
import OneProject from "./components/custom/Project/OneProject";
import Request from "./components/custom/Request";
import InvitedProjects from "./components/custom/Project/InvitedProjects";
import SocketListener from "./components/custom/SocketListener";

function App() {
  return (
    <div>
      <SocketListener />
      <Routes>
        <Route
          element={
            <AuthComponentWrapper>
              <Login />
            </AuthComponentWrapper>
          }
          path="/login"
        />
        <Route
          element={
            <AuthComponentWrapper>
              <Signup />
            </AuthComponentWrapper>
          }
          path="/signup"
        />
        <Route element={<Home />} path="/" />
        <Route
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
          path="/profile/:id"
        />
        <Route
          element={
            <PrivateRoute>
              <AllProjects />
            </PrivateRoute>
          }
          path="/projects"
        />
        <Route
          element={
            <PrivateRoute>
              <OneProject />
            </PrivateRoute>
          }
          path="/project/:id"
        />
        <Route
          element={
            <PrivateRoute>
              <Request />
            </PrivateRoute>
          }
          path="/invite-request"
        />
        <Route
          element={
            <PrivateRoute>
              <InvitedProjects />
            </PrivateRoute>
          }
          path="/invited-projects"
        />
        <Route element={<CreateProject />} path="/createproject" />
      </Routes>
    </div>
  );
}

export default App;
