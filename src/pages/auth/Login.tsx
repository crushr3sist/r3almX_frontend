import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { setToken, setTokenExpire, fetchToken } from "@/utils/login";
import { GoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { setIsAuthenticated } from "@/state/userSlice";
import routes from "@/utils/routes";
import instance from "@/utils/axios_instance";
import { useAuth } from "@/utils/AuthContext";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authPhase, setAuthPhase] = useState(1); // Use useState for authPhase
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useAuth();
  // Handle input changes

  // Function to handle login with username and password
  const loginUser = async ({ username, password }) => {
    try {
      const response = await instance.post(routes.createToken, {
        username: username,
        password: password,
      });

      if (response.status === 200) {
        await handleLoginSuccess(response.data.access_token);
        window.location.href = "/";
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Login failed. Please check your credentials.");
    }
  };

  // Function to verify the token
  const verifyToken = () => {
    return instance.get(routes.checkToken);
  };

  // Function to handle Google login
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const response = await instance.post(
        routes.googleCallback,
        {
          code: credentialResponse.credential,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.username_set) {
        await handleLoginSuccess(response.data);
      } else {
        await auth?.login(
          response.data.access_token,
          localStorage.getItem("expire")
        );
        setAuthPhase(2); // Set authPhase to 2 using state setter
      }
    } catch (error) {
      console.error("Google login failed", error);
      setErrorMessage("Google login failed. Please try again.");
    }
  };

  // Function to handle login success
  const handleLoginSuccess = async (tokenResponse) => {
    const verifyTokenStatus = await verifyToken();

    if (verifyTokenStatus.status === 200) {
      auth?.login(
        tokenResponse.access_token,
        tokenResponse.expire_time.toString()
      );
      await dispatch(setIsAuthenticated(true));
      setTimeout(async () => await navigate("/"), 100);
    }
  };

  const finaliseAuth = async () => {
    if (newUsername) {
      try {
        const response = await instance.post(
          `${routes.changeUsername}?username=${newUsername}`
        );
        if (response.status === 200) {
          auth?.login(
            response.data.access_token,
            localStorage.getItem("expire")
          );
          await dispatch(setIsAuthenticated(true));
          navigate("/");
        }
      } catch (error) {
        console.error(error);
        setErrorMessage("Failed to set new username. Please try again.");
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-4/5 h-3/4">
        <CardHeader>Login</CardHeader>
        <CardBody className="px-10 pt-5">
          {authPhase === 1 ? (
            <>
              <p>Welcome! Please log in to continue.</p>
              <Input
                className="pt-2"
                type="username"
                label="Username"
                placeholder="Enter your username"
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                className="pt-2"
                type="password"
                label="Password"
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                onClick={() => loginUser({ username, password })}
                color="primary"
              >
                Login
              </Button>
              <div className="mt-4">
                <GoogleLogin
                  onSuccess={handleGoogleLogin}
                  onError={() => setErrorMessage("Google Login Failed")}
                  useOneTap={true}
                  auto_select={true}
                />
              </div>
            </>
          ) : (
            <>
              <p>Please set your new username.</p>
              <Input
                className="pt-2"
                type="username"
                label="New Username"
                placeholder="Enter your new username"
                startContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-500 text-small">@</span>
                  </div>
                }
                onChange={handleInputChange(setNewUsername)}
              />
              <Button onClick={finaliseAuth} color="primary">
                Set Username
              </Button>
            </>
          )}
          {errorMessage !== "" ? (
            <p className="text-red-500 mt-4">{errorMessage}</p>
          ) : (
            <></>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

export default LoginPage;
