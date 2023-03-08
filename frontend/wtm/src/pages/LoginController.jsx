import LoginPageWrapper from "../components/Login/LoginPageWrapper";

import classes from "../components/Login/Login.module.css";
import LoginForm from "../components/Login/LoginForm";

import useHttp from "../shared/useHttp";
import { useEffect, useState, useContext } from "react";

import AppContext from "../shared/context/app-context";

const LoginController = (props) => {
  const [formData, setFormData] = useState(null);

  const { logIn } = useContext(AppContext);

  const { requestStatus, requestError, sendRequest } = useHttp();

  const confirmCredentials = async () => {
    let responseData = "";
    try {
      const isUser = await sendRequest(
        "http://localhost:5000/api/users/mailExists",
        {
          method: "POST",
          body: JSON.stringify(formData),
          headers: { "Content-Type": "application/json" },
        }
      );
      if (isUser === true) {
        responseData = await sendRequest(
          "http://localhost:5000/api/users/login",
          {
            method: "POST",
            body: JSON.stringify(formData),
            headers: { "Content-Type": "application/json" },
          }
        );
      } else {
        responseData = await sendRequest(
          "http://localhost:5000/api/admin/login",
          {
            method: "POST",
            body: JSON.stringify(formData),
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      if (!responseData) throw "";
      logIn(responseData?.access_token);
    } catch (err) {
      setFormData(null);
    }
  };

  useEffect(() => {
    if (!formData) return;
    confirmCredentials();
  }, [formData]);

  return (
    <LoginPageWrapper>
      <div
        className={`${classes["loginForm-container"]} rounded shadow border`}
      >
        <LoginForm
          requestError={requestError}
          requestStatus={requestStatus}
          setFormData={setFormData}
        />
      </div>
    </LoginPageWrapper>
  );
};

export default LoginController;
