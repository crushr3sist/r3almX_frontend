// src/components/LoginPage.jsx

import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { setToken, setTokenExpire, expTime } from "@/utils/login";
import { useDispatch } from "react-redux";
import { GoogleLogin } from "@react-oauth/google";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Function to handle login with username and password
  const loginUser = (data: { username: any; password: any }) => {
    axios
      .post(
        "http://10.1.1.207:8000/auth/token",
        new URLSearchParams({
          username: data.username,
          password: data.password,
        })
      )
      .then((e) => {
        if (e.status === 200) {
          (async () => {
            await setToken(e.data.access_token);
            await setTokenExpire(expTime().toString());
          })();
          navigate("/");
        }
      })
      .catch((e) => console.log(e));
  };

  // Function to handle Google login
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      console.log(credentialResponse);

      // Sending the credential received from Google to the backend for validation and token exchange
      const response = await axios.post(
        "http://10.1.1.207:8000/auth/google/callback",
        {
          code: credentialResponse.credential, // Use the credential from Google response
        },
        { headers: { "Content-Type": "application/json" } } // Make sure to set the correct content type
      );

      // On successful response, handle the login success (store token and navigate)
      handleLoginSuccess(response.data.access_token);
    } catch (e) {
      console.log("Google login failed", e);
    }
  };

  // Function to handle login success
  const handleLoginSuccess = async (token: string) => {
    await setToken(token);
    await setTokenExpire(expTime().toString());
    navigate("/");
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-4/5 h-3/4">
        <CardHeader>Login</CardHeader>
        <CardBody className="px-10 pt-5">
          <p>Welcome! Please log in to continue.</p>
          <Input
            className="pt-2"
            type="username"
            label="Username"
            placeholder="Enter your username"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <Input
            className="pt-2"
            type="password"
            label="Password"
            placeholder="Enter your password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <Button
            onClick={() => {
              loginUser({ username, password });
            }}
            color="primary"
          >
            Login
          </Button>
          <div className="mt-4">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => console.log("Google Login Failed")}
              useOneTap={true}
              auto_select={true}
            />
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default LoginPage;
