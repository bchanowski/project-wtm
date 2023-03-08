import { Button, Modal } from "react-bootstrap";
import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import ErrorToast from "../../shared/ErrorToast";
import ReactDatePicker, { registerLocale } from "react-datepicker";
import TimePicker from "rc-time-picker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import "rc-time-picker/assets/index.css";
import pl from "date-fns/locale/pl";
import AppContext from "../../shared/context/app-context";
registerLocale("pl", pl);

export default function ModalEditAddWorkTime({
  show,
  onHide,
  editMessage,
  timeNow,
  todayDate,
  user_detail,
}) {
  const [showToast, setShowToast] = useState(false);
  const [radioValue, setRadioValue] = useState(true);
  const messageRef = useRef("");
  const dateRef = useRef("");
  const timeRef = useRef("");
  const [showDate, setShowDate] = useState(new Date());
  const BASE_URL = "http://localhost:5000/api/";
  const { token } = useContext(AppContext);
  const auth = {
    headers: { Authorization: "Bearer " + token },
  };

  const handleRadioChange = () => {
    setRadioValue(!radioValue);
  };

  useEffect(() => {
    if (todayDate) {
      const newDate = new Date(todayDate);
      setShowDate(newDate);
    }
  }, [todayDate]);
  const handleSubmit = () => {
    let messageType = "quit";
    if (radioValue) messageType = "start";
    const body = {
      message: messageType,
      message_sent_at:
        dateRef.current.input.value + " " + timeRef.current.picker.value,
      user_id_fk: user_detail[0].user_id,
      full_work_time: 0,
    };
    if (editMessage) {
      body.work_time_id = editMessage.work_time_id;
      axios
        .patch(BASE_URL + "work-time/update", body, auth)
        .then((response) => {
          console.log(response);
          onHide();
        })
        .catch((err) => {
          console.log(err);
          setShowToast(true);
        });
    } else {
      axios
        .post(BASE_URL + "work-time/userAccount", body, auth)
        .then((response) => {
          console.log(response);
          onHide();
        })
        .catch((err) => {
          console.log(err);
          setShowToast(true);
        });
    }
  };
  return (
    <Modal className="modal-test" show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>
          {editMessage ? "Edytuj wiadomość" : "Dodaj wiadomość"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <label>
          <input
            type="radio"
            checked={radioValue}
            onChange={handleRadioChange}
          />
          Start
        </label>
        <label>
          <input
            type="radio"
            checked={!radioValue}
            onChange={handleRadioChange}
          />
          Quit
        </label>
        <ReactDatePicker
          locale="pl"
          className="select-nav-item"
          selected={showDate}
          ref={dateRef}
          dateFormat="yyyy-MM-dd"
          onChange={(date) => {
            setShowDate(date);
          }}
        />
        <TimePicker
          className="timepicker-worktime"
          ref={timeRef}
          defaultValue={moment(timeNow, "HH:mm")}
          showSecond={false}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Wróć
        </Button>
        <Button
          variant={editMessage ? "info" : "success"}
          onClick={handleSubmit}
        >
          Zapisz zmiany
        </Button>
      </Modal.Footer>
      <ErrorToast
        onClose={() => setShowToast(false)}
        show={showToast}
        message="Coś poszło nie tak! Spróbuj ponownie za moment!"
      />
    </Modal>
  );
}
