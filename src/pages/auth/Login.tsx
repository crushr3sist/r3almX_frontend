import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { setToken, setTokenExpire, expTime } from "@/utils/login";
import { useDispatch } from "react-redux";
import { isAuthenticated, tokenChecked } from "@/state/userSlice";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loginUser = (data: { username: string; password: string }) => {
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
            console.log("tokens set");
            dispatch(isAuthenticated(true));
            dispatch(tokenChecked(true));
            console.log("states set");
          })();
          navigate("/");
        }
      })
      .catch((e) => console.log(e));
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-4/5 h-3/4">
        <CardHeader>fea</CardHeader>
        <CardBody className="px-10 pt-5">
          <p>Make beautiful websites regardless of your design experience.</p>
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
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="Enter your password"
          />
          <Button
            onClick={() => {
              loginUser({
                username,
                password,
              });
            }}
            color="primary"
          >
            login
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}

export default LoginPage;
