import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "../UserContext.jsx";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();


  const showToastMessage = (message, type, redirectToLogin = false) => {
    toast[type](message, {
      position: toast.POSITION.TOP_RIGHT,
      onClose: () => {
        if (redirectToLogin) {
          // Redirect to the login page after the toast is closed
          navigate('/login');
        }
      },
    });
  };

  async function handleLoginSubmit(ev) {
    ev.preventDefault();
    try {
      const { data } = await axios.post("/login",{
         email,
        password
       });
      setUser(data);
      navigate('/');
    } catch (e) {
      showToastMessage("login failed.", "error");

    }
  }

  return (
    <div>
      {redirect ? (
        <Navigate to={"/"} />
      ) : (
        <div className="mt-4 grow flex items-center justify-around">
          <div className="mb-64">
            <h1 className="text-4xl text-center mb-4">Login</h1>
            <form className="max-w-md mx-auto" onSubmit={handleLoginSubmit}>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
              />
              <input
                type="password"
                placeholder="password"
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
              />
              <button className="primary">Login</button>
              <div className="text-center py-2 text-gray-500">
                Don't have an account yet?{" "}
                <Link className="underline text-black" to={"/register"}>
                  Register now
                </Link>
              </div>
            </form>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}