import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";

function Logout() {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout()); // Clears Redux + localStorage
  };

  return <button onClick={handleLogout}>Logout</button>;
}

export default Logout;
