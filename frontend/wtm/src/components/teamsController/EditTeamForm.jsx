import { useEffect, useContext, useRef, useState } from "react";
import { Form, Card, Button, Col, Row } from "react-bootstrap";
import { Input } from "react-bootstrap-typeahead";
import classes from "./CSS/Manage.module.css";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TimePicker from "rc-time-picker";
import moment from "moment";
import "rc-time-picker/assets/index.css";
import AppContext from "../../shared/context/app-context";

function EditTeamForm(props) {
  const [id, setId] = useState("");
  const nameRef = useRef("");
  const createDateRef = useRef("");
  const createHourRef = useRef("");
  const [startDate, setStartDate] = useState(new Date(props.create));
  const [time, setTime] = useState();

  const { token, role } = useContext(AppContext);
  const auth = {
    headers: { Authorization: "Bearer " + token },
  };

  useEffect(() => {
    setId(props.id);
  });

  async function updateTeam(e, id) {
    e.preventDefault();
    const hasNumber = /\d/;
    const hasSpecialChar = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

    let todayDate = new Date().toISOString().slice(0, 10);
    let date = new Date();
    let seconds, minutes, hours;
    seconds = date.getSeconds();
    minutes = date.getMinutes();
    hours = date.getHours();

    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    if (hours < 10) {
      hours = "0" + hours;
    }

    let todayTime = hours + ":" + minutes + ":" + seconds;
    console.log(todayTime);

    let years, month, days;
    years = startDate.getFullYear();
    month = startDate.getMonth() + 1;
    days = startDate.getDate();
    if (month < 10) {
      month = "0" + month;
    }
    if (days < 10) {
      days = "0" + days;
    }

    let createDate = years + "-" + month + "-" + days;
    console.log("creation year " + createDate);

    const createDateConcate =
      createDate + "T" + createHourRef.current.picker.value + "Z";

    const editDateConcate = todayDate + "T" + todayTime + "Z";

    console.log("Displaying edited time :" + time);

    const updateObj = {
      team_id: id,
      team_name: nameRef.current.value,
      created_at: createDateConcate,
      edited_at: editDateConcate,
    };

    if (
      hasNumber.test(nameRef.current.value) ||
      hasSpecialChar.test(nameRef.current.value)
    ) {
      alert("Team nie moze zawierać cyfry ani znaku specjalnego !");
    } else {
      console.log(updateObj);
      const updateReq = async () => {
        await axios
          .put("http://localhost:5000/api/teams/edit", updateObj, auth)
          .catch((error) => {
            console.log(error);
          });
      };
      updateReq();
      props.hideFunc();
    }
    props.refresh();
  }

  function delTeam(e, name) {
    e.preventDefault();
    console.log(name);

    axios
      .put("http://localhost:5000/api/teams/delete", { team_name: name }, auth)
      .then((response) => {
        console.log(response);
      });
    props.hideFunc();
    props.refresh();
  }

  return (
    <div>
      {console.log(props.id, props.name, props.create, props.edit)}
      <div className={classes.modal}>
        <Card style={{ width: 300, position: "relative", left: 70 }}>
          <Card.Body>
            <Form>
              <Form.Group className="mb-3">
                <h3>
                  Edytuj : {props.name}{" "}
                  <Button
                    variant="light"
                    onClick={(e) => delTeam(e, props.name)}
                  >
                    Usuń
                  </Button>
                </h3>
                <Form.Control
                  style={{ width: 255 }}
                  ref={nameRef}
                  type="text"
                  placeholder={props.name}
                  defaultValue={props.name}
                />
                <Form.Text className="text-muted">Nazwa zespołu</Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <DatePicker
                  style={{ width: 255 }}
                  ref={createDateRef}
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  dateFormat="yyyy-MM-dd"
                />
                <Form.Text className="text-muted">Data utworzenia </Form.Text>
              </Form.Group>
              <Form.Group className="mb-3">
                <Row style={{ width: 280 }}>
                  <TimePicker
                    style={{ width: 300 }}
                    className="timepicker-worktime"
                    ref={createHourRef}
                    defaultValue={moment(
                      props.create.split("T")[1].substring(0, 8),
                      "HH:mm:ss"
                    )}
                  />
                </Row>
                <Row style={{ height: 20 }}> </Row>
                <Row style={{ height: 40, width: 200 }}>
                  <Col style={{ width: 50 }}></Col>
                  <Col style={{ width: 140 }}>
                    <Button
                      style={{ width: 250, position: "relative", right: 60 }}
                      variant="primary"
                      type="submit"
                      onClick={(e) => updateTeam(e, props.id, props.name)}
                    >
                      Zapisz zmiany
                    </Button>
                  </Col>
                </Row>
              </Form.Group>
              <Row>
                <Col></Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
export default EditTeamForm;
