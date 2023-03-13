import { Button, Col, Form, Row } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import "./UserForm.css";
import { ErrorMessage, Formik } from "formik";
import * as yup from "yup";
import { validationTemplates } from "../../../shared/yupHelper";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import ErrorToast from "../../../shared/ErrorToast";
import AppContext from "../../../shared/context/app-context";

export default function UserForm() {
  const [show, setShow] = useState(false);
  const [teams, setTeams] = useState(null);
  const [message, setMessage] = useState(
    "Coś poszło nie tak! Spróbuj ponownie za moment!"
  );
  const location = useLocation();
  const user = location.state;
  const { token, role } = useContext(AppContext);
  const auth = {
    headers: { Authorization: "Bearer " + token },
  };
  const navigate = useNavigate();
  const BASE_URL = "http://localhost:5000/api/";
  const fetchTeams = () => {
    axios
      .get(BASE_URL + "teams/all", auth)
      .then((response) => {
        setTeams(response.data);
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    fetchTeams();
  }, []);
  const {
    validateSingleTextField,
    validatePassword,
    validateEmail,
    validateSelectTeamField,
    validatePasswordNotReq,
    validatePhoneNumber,
  } = validationTemplates;

  let validationSchema = {
    name: validateSingleTextField,
    surname: validateSingleTextField,
    phone_number: validatePhoneNumber,
    team_id_fk: validateSelectTeamField,
    email: validateEmail,
    password: validatePassword,
  };
  let initialValues = {
    name: "",
    surname: "",
    phone_number: "",
    team_id_fk: "",
    email: "",
    password: "",
  };
  if (user?.user_detail_id != null) {
    initialValues = {
      name: user.name,
      surname: user.surname,
      phone_number: user.phone_number,
      team_id_fk: user.team_id_fk !== null ? user.team_id_fk.team_id : "",
      email: user.user_id.email,
      password: "",
    };
    validationSchema.password = validatePasswordNotReq;
  }

  const schema = yup.object().shape(validationSchema);

  const handleSubmit = (values) => {
    let userDetail = {
      name: values.name,
      surname: values.surname,
      phone_number: values.phone_number,
      team_id_fk: values.team_id_fk !== "" ? values.team_id_fk : null,
    };
    let userInfo = {
      email: values.email,
      password: values.password,
    };
    if (values.password === "") {
      userInfo = {
        email: values.email,
      };
    }
    if (user.user_id == null) {
      axios
        .get(BASE_URL + "users/user/email/" + values.email, auth)
        .then((response) => {
          console.log(response);
          console.log(Object.keys(response.data).length);
          if (Object.keys(response.data).length > 0) {
            setMessage("Konto z takim adresem email już istnieje");
            setShow(true);
          } else {
            axios
              .post(BASE_URL + "users", userInfo, auth)
              .then((response) => {
                console.log(response);
                const userDetail = {
                  name: values.name,
                  surname: values.surname,
                  phone_number: values.phone_number,
                  team_id_fk:
                    values.team_id_fk !== "" ? values.team_id_fk : null,
                  user_id: response.data.user_id,
                };
                axios
                  .post(BASE_URL + "userdetail", userDetail, auth)
                  .then((res) => {
                    console.log(res);
                    navigate("/users");
                  })
                  .catch((err) => {
                    console.log(err);
                    setShow(true);
                  });
              })
              .catch((err) => {
                setMessage("Coś poszło nie tak! Spróbuj ponownie za moment!");
                setShow(true);
              });
          }
        })
        .catch((err) => {
          console.log(err);
          setShow(true);
        });
    } else {
      axios
        .put(
          BASE_URL + "userdetail/edit/" + user.user_detail_id,
          userDetail,
          auth
        )
        .then((response) => {
          console.log(response);
        })
        .catch((err) => {
          console.log(err);
          setShow(true);
        });
      axios
        .put(BASE_URL + "users/" + user.user_id.user_id, userInfo, auth)
        .then((response) => {
          console.log(response);
          if (role === "ADMIN") navigate("/users");
          else navigate("/user_account");
        })
        .catch((err) => {
          console.log(err);
          setShow(true);
        });
    }
  };
  return (
    <Formik
      validationSchema={schema}
      initialValues={initialValues}
      onSubmit={handleSubmit}
    >
      {({ handleSubmit, handleChange, values, touched, errors }) => (
        <Form className="user-form-container" onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="name">
              <Form.Label>Imię</Form.Label>
              <Form.Control
                name="name"
                placeholder="Imię"
                value={values.name}
                onChange={handleChange}
              />
              <ErrorMessage
                name="name"
                render={(msg) => <div className="form-message">{msg}</div>}
              />
            </Form.Group>

            <Form.Group as={Col} controlId="surname">
              <Form.Label>Nazwisko</Form.Label>
              <Form.Control
                value={values.surname}
                name="surname"
                placeholder="Nazwisko"
                onChange={handleChange}
              />
              <ErrorMessage
                name="surname"
                render={(msg) => <div className="form-message">{msg}</div>}
              />
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} controlId="phone_number">
              <Form.Label>Numer Telefonu</Form.Label>
              <Form.Control
                value={values.phone_number}
                name="phone_number"
                placeholder="Numer Telefonu"
                onChange={handleChange}
              />
              <ErrorMessage
                name="phone_number"
                render={(msg) => <div className="form-message">{msg}</div>}
              />
            </Form.Group>

            <Form.Group as={Col} controlId="team_id_fk">
              <Form.Label>Team</Form.Label>
              <Form.Select
                value={values.team_id_fk}
                name="team_id_fk"
                onChange={handleChange}
                isInvalid={errors.team_id_fk && touched.team_id_fk}
                isValid={!errors.team_id_fk && values.team_id_fk}
                error={errors.team_id_fk}
              >
                <option value=""></option>
                {teams && teams.length > 0
                  ? teams.map((team, index) => (
                      <option value={team.team_id} key={index}>
                        {team.team_name}
                      </option>
                    ))
                  : ""}
              </Form.Select>
              <ErrorMessage
                name="team_id"
                render={(msg) => <div className="form-message">{msg}</div>}
              />
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                value={values.email}
                name="email"
                type="email"
                placeholder="Adres email"
                onChange={handleChange}
              />
              <ErrorMessage
                name="email"
                render={(msg) => <div className="form-message">{msg}</div>}
              />
            </Form.Group>

            <Form.Group as={Col} controlId="password">
              <Form.Label>Hasło</Form.Label>
              <Form.Control
                value={values.password}
                name="password"
                type="password"
                onChange={handleChange}
                placeholder="Hasło"
              />
              <ErrorMessage
                name="password"
                render={(msg) => <div className="form-message">{msg}</div>}
              />
            </Form.Group>
          </Row>
          <Button
            className="btn-form"
            variant="success"
            type="submit"
            size="lg"
          >
            Zapisz zmiany
          </Button>
          <Button
            onClick={() => navigate(-1)}
            variant="danger"
            size="lg"
            className="btn-form"
          >
            Wróć
          </Button>
          <ErrorToast
            onClose={() => setShow(false)}
            show={show}
            message={message}
          />
        </Form>
      )}
    </Formik>
  );
}
