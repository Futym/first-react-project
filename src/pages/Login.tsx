import { auth, provider } from "../configs/firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

export const Login = () => {
    const navigate = useNavigate()

    const SignInWithGoogle = async () => {
        const result = await signInWithPopup(auth, provider);
        console.log(result)
        navigate("/");
    }

  return <div>
    <h1>Sign in with Google to continue.</h1>
    <button onClick={SignInWithGoogle}>Sign in with Google</button>
    </div>

};
