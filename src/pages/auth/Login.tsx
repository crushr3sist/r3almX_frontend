import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { setToken, setTokenExpire, expTime, fetchToken } from "@/utils/login";
import { GoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { setAuthenticated } from "@/state/userSlice";
import routes from "@/utils/routes";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authPhase, setAuthPhase] = useState(1); // Use useState for authPhase
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Handle input changes
  const handleInputChange = (setter) => (event) => {
    setter(event.target.value);
  };

  // Function to handle login with username and password
  const loginUser = async ({ username, password }) => {
    try {
      const response = await axios.post(routes.createToken, {
        username: username,
        password: password,
      });

      if (response.status === 200) {
        await handleLoginSuccess(response.data.accessToken);
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Login failed. Please check your credentials.");
    }
  };

  // Function to verify the token
  const verifyToken = (token) => {
    return axios.get(routes.checkToken, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  // Function to handle Google login
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      console.log(credentialResponse);

      const response = await axios.post(
        routes.googleCallback,
        {
          code: credentialResponse.credential,
        },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log(response.data.username_set);

      if (response.data.username_set) {
        await handleLoginSuccess(response.data.accessToken);
        await dispatch(setAuthenticated());

        navigate("/");
      } else {
        await setToken(response.data.accessToken);
        setAuthPhase(2); // Set authPhase to 2 using state setter
      }
    } catch (error) {
      console.error("Google login failed", error);
      setErrorMessage("Google login failed. Please try again.");
    }
  };

  // Function to handle login success
  const handleLoginSuccess = async (token) => {
    const verifyTokenStatus = await verifyToken(token);

    if (verifyTokenStatus.status === 200) {
      await setToken(token);
      await setTokenExpire(expTime().toString());
      await dispatch(setAuthenticated());
    }
  };

  // Function to finalize authentication (set new username)
  const finaliseAuth = async () => {
    if (newUsername) {
      try {
        const token = await fetchToken();
        console.log(token);
        const response = await axios.patch(
          routes.changeUsername,
          { newUsername: newUsername }, // Request body
          {
            headers: {
              // Request headers
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.status);
        if (response.status === 200) {
          await setToken(response.data.accessToken);
          await dispatch(setAuthenticated());
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
                onChange={handleInputChange(setUsername)}
              />
              <Input
                className="pt-2"
                type="password"
                label="Password"
                placeholder="Enter your password"
                onChange={handleInputChange(setPassword)}
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
          {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
        </CardBody>
      </Card>
    </div>
  );
}

export default LoginPage;
