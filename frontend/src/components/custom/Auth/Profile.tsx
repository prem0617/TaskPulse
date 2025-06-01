import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

interface User {
  id: string;
  email: string;
  name: string;
}

const Profile = () => {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  async function fetchUser() {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/users/getUser",
        { userId: id },
        { withCredentials: true }
      );
      setUser(response.data.user || null);
    } catch (error) {
      console.log(error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) return <div>LOADING</div>;
  if (!user) return <div>User not Found</div>;

  return (
    <div>
      {user.name} {user.email}
    </div>
  );
};

export default Profile;
