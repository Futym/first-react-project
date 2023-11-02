import { Link } from "react-router-dom";
import { auth } from "../configs/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";

export const NavBar = () => {
  const [user] = useAuthState(auth);

  const logUserOut = async () => {
    await signOut(auth);
  };

  return (
    <div>
      <div>
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
      </div>
      
        <div>
        {user && (
            <>
          <p>{user?.displayName}</p>
          <img src={user?.photoURL || ""} width="100" height="100" />
          <button onClick={logUserOut}>Log out</button>
            </>
        )}
          </div>
    </div>
  );
};
