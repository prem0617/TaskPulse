import { useAuthContext } from "@/context/AuthContext";
import type { ReactNode } from "react";
import { Navigate } from "react-router";

interface Props {
  children: ReactNode;
}

const AuthComponentWrapper = ({ children }: Props) => {
  const { loading, user } = useAuthContext();

  if (loading) return <div>Loading...</div>;

  if (user) {
    // If user is already logged in, redirect them to home
    return <Navigate to="/" />;
  }

  // If not logged in, show the actual page (login or signup)
  return <>{children}</>;
};

export default AuthComponentWrapper;
