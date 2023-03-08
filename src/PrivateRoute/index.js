import {useState} from "react";
import { Navigate } from "react-router-dom";
import ajax from "../Services/fetchService";

const PrivateRoute = ({ children }) => {
  const jwt = localStorage.getItem("token");
  const [isLoading, setIsLoading] = useState(true);
  const [isValid, setIsValid] = useState(null);

  if (jwt) {
    ajax(`/api/auth/validate?token=${jwt}`, "GET", jwt).then((isValid) => {
      setIsLoading(false);
      setIsValid(isValid);
    });
  } else {
    return <Navigate to="/login" />;
  }

  return isLoading ? (
    <div>...Loding</div>
  ) : isValid === true ? (
    children
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoute;
