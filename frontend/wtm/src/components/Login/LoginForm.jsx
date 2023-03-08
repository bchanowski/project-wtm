import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

import { Formik } from "formik";
import * as yup from "yup";

import { validationTemplates } from "../../shared/yupHelper";

import classes from "./Login.module.css";

const LoginForm = ({ setFormData, requestStatus, requestError }) => {
  const { validatePassword, validateEmail } = validationTemplates;

  const validationSchema = {
    email: validateEmail,
    password: validatePassword,
  };

  const schema = yup.object().shape(validationSchema);

  const initialValues = {
    email: "",
    password: "",
  };

  return (
    <Formik
      validationSchema={schema}
      onSubmit={setFormData}
      initialValues={initialValues}
    >
      {({ handleSubmit, handleChange, values, touched, errors }) => (
        <Form noValidate onSubmit={handleSubmit}>
          <h2 className="mb-4">Logowanie</h2>
          <Form.Group
            className={`${classes["loginForm-formField"]}`}
            controlId="email"
          >
            <Form.Label>Email</Form.Label>
            <Form.Control
              autoFocus
              type="text"
              name="email"
              onChange={handleChange}
              value={values.email}
              isInvalid={(touched.email && errors.email) || requestError}
              isValid={!errors}
            />
            <Form.Control.Feedback className="position-absolute" type="invalid">
              {errors.email || "Błędny email lub hasło"}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group
            className={`${classes["loginForm-formField"]}`}
            controlId="password"
          >
            <Form.Label>Hasło</Form.Label>
            <Form.Control
              type="password"
              name="password"
              onChange={handleChange}
              isInvalid={(touched.password && errors.password) || requestError}
            />
            <Form.Control.Feedback className="position-absolute" type="invalid">
              {errors.password || "Błędny email lub hasło"}
            </Form.Control.Feedback>
          </Form.Group>
          <div className="d-grid mb-2 mt-5">
            <Button type="submit">
              {requestStatus !== "loading" && "Zaloguj się"}
              {requestStatus === "loading" && (
                <Spinner animation="border" size="sm" />
              )}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
