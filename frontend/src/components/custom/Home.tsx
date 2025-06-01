import { useAuthContext } from "@/context/AuthContext";
import { Link, useNavigate } from "react-router-dom"; // ✅ Fix this
import { Button } from "../ui/button";
import axios from "axios";
import toast from "react-hot-toast";
import { useSocket } from "@/hooks/useSokect";
import { useEffect } from "react";

const Home = () => {
  const { user, setUser } = useAuthContext();
  const navigate = useNavigate();
  const socket = useSocket();
  async function handleLogout() {
    try {
      localStorage.removeItem("tmtoken");
      await axios.get("http://localhost:3000/api/auth/logout", {
        withCredentials: true,
      });
      toast.success("Logout Successful");
      setUser(null);
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 300);
    } catch (error) {
      console.log(error);
      toast.error("Logout failed");
    }
  }

  // useEffect(() => {
  //   socket.
  // },[socket])

  return (
    <div>
      <Link to={`/profile/${user?.id}`}>PROFILE</Link>
      <Link to={"/invite-request"}>Request</Link>
      <Link to={"/invited-projects"}>Invited Projects</Link>
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
};

export default Home;
