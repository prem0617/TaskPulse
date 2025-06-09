import { useAuthContext } from "@/context/AuthContext";
import type { ReactNode } from "react";
import { Navigate } from "react-router";
import LoadingSpinner from "../Task/LoadingSpinner";

interface Props {
  children: ReactNode;
}

const PrivateRoute = ({ children }: Props) => {
  const { loading, user } = useAuthContext();
  //   console.log(loading, user);
  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" />;

  return children;
};

export default PrivateRoute;
