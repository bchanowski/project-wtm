import { Card, Form, Button } from "react-bootstrap";
import classes from "./CSS/Manage.module.css";
import { useLayoutEffect, useContext, useRef, useState } from "react";
import axios from "axios";
import { Typeahead } from "react-bootstrap-typeahead";

import AppContext from "../../shared/context/app-context";

function ManageUserForm(props) {
  const [name, setName] = useState("");
  const [surname, setSurName] = useState("");
  const [users, setUsers] = useState([]);
  const [surnameOpt, setSurnameOpt] = useState([]);

  const nameRef = useRef();
  const surnameRef = useRef();

  const { token, role } = useContext(AppContext);
  const auth = {
    headers: { Authorization: "Bearer " + token },
  };

  const fetchUsers = async () => {
    await axios
      .get("http://localhost:5000/api/userdetail", auth)
      .then((response) => {
        setUsers(response.data);
      });
  };
  const fetchSurnames = async (nameRef) => {
    console.log(nameRef);
    await axios
      .get(`http://localhost:5000/api/userdetail/one/${nameRef}`, auth)
      .then((response) => {
        setSurnameOpt(response.data);
      });
  };
  useLayoutEffect(() => {
    fetchUsers();
  }, []);

  async function handleSubmit(e, value, hideFunc) {
    e.preventDefault();
    // console.log(nameRef.current.inputNode.value);
    // console.log(surnameRef.current.inputNode.value);
    // console.log(props.flag);
    if (value === 1) {
      //console.log("adding");
      try {
        let response = await axios.put(
          "http://localhost:5000/api/userdetail/update",
          {
            name: nameRef.current.inputNode.value,
            surname: surnameRef.current.inputNode.value,
            team_id: props.teamId,
          },
          auth
        );
        alert(response.data.error_mess);
        hideFunc();
      } catch (error) {
        alert(error.response.data.error_mess);
      }
    } else if (value === 0) {
      console.log("delete");
      try {
        let response = await axios.put(
          "http://localhost:5000/api/userdetail/delete",
          {
            name: nameRef.current.inputNode.value,
            surname: surnameRef.current.inputNode.value,
            team_id: props.teamId,
          },
          auth
        );
        alert(response.data.error_mess);
      } catch (error) {
        alert(error.response.data.error_mess);
      }
      hideFunc();
    } else {
      console.log("error");
    }
  }

  return (
    <div className={classes.modal}>
      <Card>
        <Card.Body>
          <Form>
            <Form.Group className="mb-3">
              <h3>
                {props.action} : {props.teamName}
              </h3>
              <Typeahead
                ref={nameRef}
                id="basic-typeahead-single"
                placeholder="Imię"
                options={users
                  .map((value) => value.name)
                  .filter(
                    (value, index, self) => self.indexOf(value) === index
                  )}
                onChange={fetchSurnames}
              />
              <Form.Text className="text-muted">Imię</Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Typeahead
                ref={surnameRef}
                id="basic-typeahead-single"
                placeholder="Nazwisko"
                options={surnameOpt.map((value) => value.surname)}
              />
              <Form.Text className="text-muted">Nazwisko</Form.Text>
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              onClick={(event) =>
                handleSubmit(event, props.flag, props.hideFunc)
              }
            >
              {props.action}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}
export default ManageUserForm;
