import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/react";
import { useState } from "react";
import { AxiosResponse, AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import routes from "@/utils/routes";
import instance from "@/utils/axios_instance";
import { useAuth } from "@/utils/AuthContext";
import { IGoogleLoginReq, IGoogleLoginRes } from "./interfaces";

interface ICredLoginReq {
  username?: string;
  email?: string;
  password: string;
}
interface ICredLoginRes {
  status_code: number;
  access_token: string;
  token_type: string;
  // Backend likely returns string/number; do not assume Date object
  expire_time: string | number;
}

interface IRegisterReq {
  username: string;
  email: string;
  password: string;
}
interface IRegisterRes {
  status_code: number;
  detail?: string;
}

function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const auth = useAuth();

  const GoogleLoginReq = async (credentialResponse) => {
    try {
      setSubmitting(true);
      const googleLoginResposne = await instance.post<
        IGoogleLoginReq,
        AxiosResponse<IGoogleLoginRes>,
        IGoogleLoginReq
      >(
        routes.googleCallback,
        {
          code: credentialResponse.credential,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const rawExp = googleLoginResposne.data.expire_time as unknown as
        | string
        | number
        | Date;
      const expISO =
        typeof rawExp === "number"
          ? new Date(rawExp).toISOString()
          : typeof rawExp === "string"
          ? rawExp
          : new Date(rawExp).toISOString();

      await auth?.login(googleLoginResposne.data.access_token, expISO);

      navigate("/");
    } catch (e) {
      const err = e as AxiosError<any>;
      console.log(err)
      setErrorMessage(
        err.response?.data?.detail || "Google login failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const credLogin = async (creds: ICredLoginReq) => {
    try {
      setSubmitting(true);
      setErrorMessage("");
      // FastAPI endpoint expects query params for primitives
      const res = await instance.post<
        ICredLoginRes,
        AxiosResponse<ICredLoginRes>,
        any
      >(
        routes.login,
        {},
        {
          params: {
            email: creds.email || null,
            username: creds.username || null,
            password: creds.password,
          },
        }
      );

      if (res.data.status_code === 200) {
        const exp = res.data.expire_time;
        await auth?.login(
          res.data.access_token,
          typeof exp === "number" ? new Date(exp).toISOString() : exp
        );
        navigate("/");
      } else {
        setErrorMessage("Login failed. Please check your credentials.");
      }
    } catch (e) {
      const err = e as AxiosError<any>;
      setErrorMessage(
        err.response?.data?.detail || "Login failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const register = async (payload: IRegisterReq) => {
    try {
      setSubmitting(true);
      setErrorMessage("");
      setSuccessMessage("");

      const res = await instance.post<
        IRegisterRes,
        AxiosResponse<IRegisterRes>,
        IRegisterReq
      >(
        routes.register,
        {
          username: payload.username,
          email: payload.email,
          password: payload.password,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data.status_code === 200) {
        setSuccessMessage("Registration successful. You can now log in.");
        // Prefill login fields and switch to login mode
        setMode("login");
      } else {
        setErrorMessage(res.data.detail || "Registration failed.");
      }
    } catch (e) {
      const err = e as AxiosError<any>;
      setErrorMessage(err.response?.data?.detail || "Registration failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const onSubmit = () => {
    if (mode === "register") {
      if (!username || !email || !password) {
        setErrorMessage("Please enter username, email and password.");
        return;
      }
      register({ username, email, password });
    } else {
      if ((!username && !email) || !password) {
        setErrorMessage("Enter username or email, and your password.");
        return;
      }
      credLogin({
        username: username || undefined,
        email: email || undefined,
        password,
      });
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-4/5 max-w-xl">
        <CardHeader>{mode === "login" ? "Login" : "Register"}</CardHeader>
        <CardBody className="px-10 pt-5 space-y-3">
          {/* Unified form */}
          <Input
            className="pt-2"
            type="text"
            label="Username"
            placeholder={
              mode === "login"
                ? "Enter your username (or use email)"
                : "Choose a username"
            }
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            className="pt-2"
            type="email"
            label="Email"
            placeholder={
              mode === "login"
                ? "Enter your email (or use username)"
                : "Enter your email"
            }
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            className="pt-2"
            type="password"
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button onClick={onSubmit} color="primary" isLoading={submitting}>
            {mode === "login" ? "Login" : "Register"}
          </Button>

          {/* Google login remains available for either mode */}
          <div className="mt-4">
            <GoogleLogin
              onSuccess={GoogleLoginReq}
              onError={() => setErrorMessage("Google Login Failed")}
              useOneTap={true}
              auto_select={true}
            />
          </div>

          <div className="flex items-center justify-between pt-2 text-sm">
            <span>
              {mode === "login"
                ? "Don't have an account?"
                : "Already have an account?"}
            </span>
            <Button
              variant="light"
              color="secondary"
              size="sm"
              onClick={() => {
                setErrorMessage("");
                setSuccessMessage("");
                setMode(mode === "login" ? "register" : "login");
              }}
            >
              {mode === "login" ? "Register" : "Back to Login"}
            </Button>
          </div>

          {errorMessage ? (
            <p className="text-red-500 mt-2">{errorMessage}</p>
          ) : null}
          {successMessage ? (
            <p className="text-green-600 mt-2">{successMessage}</p>
          ) : null}
        </CardBody>
      </Card>
    </div>
  );
}

export default LoginPage;
