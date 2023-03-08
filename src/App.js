import { Route, Routes } from "react-router-dom";
import AssignmentView from "./AssignmentView";
import Dashboard from "./Dashboard";
import Home from "./HomePage";
import Login from "./Login";
import PrivateRoute from "./PrivateRoute";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import jwt_decode from "jwt-decode";
import CodeReviewerDashboard from "./CodeReviewerDashboard";
import "./App.css";
import CodeReviewerAssignmentView from "./CodeReviewerAssignmentView";
import AdminPannel from "./AdminPannel";
export default function App() {
  const jwt = localStorage.getItem("token");
  const [roles, setRoles] = useState(getRolesFromJwt(jwt));

  function getRolesFromJwt() {
    if (jwt) {
      const decodedJwt = jwt_decode(jwt);
      return decodedJwt.authorities;
    } else {
      return [];
    }
  }

  return (
    <Routes>
      <Route
        path="/admin"
        element={
          roles.find((role) => role === "ROLE_ADMIN") ? (
            <PrivateRoute>
              <AdminPannel />
            </PrivateRoute>
          ) : (
            <Login/>
          )
        }
      />
      <Route
        path="/dashboard"
        element={
          roles.find((role) => role === "ROLE_CODE_REVIEWER") ? (
            <PrivateRoute>
              <CodeReviewerDashboard />
            </PrivateRoute>
          ) : (
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          )
        }
      />
      <Route
        path="/assignments/:assignmentId"
        element={
          roles.find((role) => role === "ROLE_CODE_REVIEWER") ? (
            <PrivateRoute>
              <CodeReviewerAssignmentView />
            </PrivateRoute>
          ) : (
            <PrivateRoute>
              <AssignmentView />
            </PrivateRoute>
          )
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Home />} />
    </Routes>
  );
}
