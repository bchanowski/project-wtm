import axios from "axios";
import { Fragment, useContext, useEffect, useRef, useState } from "react";
import { Alert, Button, Form, Spinner } from "react-bootstrap";
import "./WorkTime.css";
import ModalDeleteWorkTime from "./ModalDeleteWorkTime";
import ModalEditAddWorkTime from "./ModalEditAddWorkTime";
import { Typeahead } from "react-bootstrap-typeahead";
import formatDate from "../../shared/formatDate";
import ReactDatePicker, { registerLocale } from "react-datepicker";
import pl from "date-fns/locale/pl";
import AppContext from "../../shared/context/app-context";
import jsPDF from "jspdf";
registerLocale("pl", pl);

export default function WorkTime() {
  const [showLoader, setShowLoader] = useState(true);
  const [users_detail, setUsersDetail] = useState(null);
  const [user_detail, setUserDetail] = useState(null);
  const [workTimeMessages, setWorkTimeMessages] = useState(null);
  const [show, setShow] = useState(false);
  const [fullWorkTime, setFullWorkTime] = useState(0);
  const [todayDate, setTodayDate] = useState("");
  const [nextDate, setNextDate] = useState("");
  const [timeNow, setTimeNow] = useState("");
  const [editMessage, setEditMessage] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const selectRef = useRef("");
  const BASE_URL = import.meta.env.VITE_API_URL + "/api/";
  const { token } = useContext(AppContext);
  const auth = {
    headers: { Authorization: "Bearer " + token },
  };

  const handleShow = (numberSelected) => {
    let result = workTimeMessages.find((obj) => {
      return obj.work_time_id == numberSelected.target.value;
    });
    setEditMessage(result);
    setShow(true);
  };
  const handleShowDelete = (numberSelected) => {
    setShowDelete(true);
    setDeleteId(numberSelected);
  };

  const handleTodayChange = (e) => {
    let newDate = formatDate(e);
    if (newDate >= nextDate) setTodayDate(newDate);
  };
  const handleNextChange = (e) => {
    let newDate = formatDate(e);
    if (newDate <= todayDate) setNextDate(newDate);
  };
  const calculateWorkTime = (data) => {
    let workTimeSeconds = 0;
    for (let i = 0; i < data.length; i++) {
      workTimeSeconds += data[i].full_work_time;
    }
    workTimeSeconds = workTimeSeconds / 1000;
    const result = new Date(workTimeSeconds * 1000).toISOString().slice(11, 16);
    setFullWorkTime(result);
  };

  const fetchUsers = (today, nextMonth) => {
    setShowLoader(true);
    axios
      .get(BASE_URL + "userdetail", auth)
      .then((response) => {
        setUsersDetail(response.data);
        setShowLoader(false);
        if (!response?.data?.length) throw "";
        handleSelectChange(
          null,
          today,
          nextMonth,
          response.data[0].user_detail_id
        );
      })
      .catch((err) => {
        setShowLoader(false);
      });
  };

  const handleSelectChange = (e, todayDateParam, nextDateParam, user_id) => {
    setShowLoader(true);
    let todaysDate = todayDateParam ? todayDateParam : todayDate;
    let nextsDate = nextDateParam ? nextDateParam : nextDate;
    let selectedValue = user_id ? user_id : "";
    if (selectRef.current.inputNode) {
      selectedValue = selectRef.current.inputNode.value.substring(
        0,
        selectRef.current.inputNode.value.indexOf(".")
      );
    }
    if (selectedValue !== "") {
      axios
        .get(BASE_URL + "userdetail/user/" + selectedValue, auth)
        .then((response) => {
          setUserDetail(response.data);
          axios
            .get(
              BASE_URL +
                "work-time/user/" +
                response.data[0].user_id.user_id +
                "/" +
                nextsDate +
                "/" +
                todaysDate,
              auth
            )
            .then((response) => {
              console.log(response);
              setWorkTimeMessages(response.data);
              calculateWorkTime(response.data);
              setShowLoader(false);
            })
            .catch((err) => {
              console.log(err);
              setShowLoader(false);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setUserDetail(null);
    }
  };

  const generateWorktimePdf = () => {
    var doc = new jsPDF("landscape", "px", "a4", "false");
    doc.setFontSize(25);
    doc.text(
      70,
      30,
      "Ewidencja czasu pracy - " +
        user_detail[0].name +
        " " +
        user_detail[0].surname +
        " - " +
        (user_detail[0].team_id_fk
          ? user_detail[0].team_id_fk.team_name
          : "Brak Teamu")
    );
    doc.setFontSize(12);
    doc.text(70, 45, "Dane dla dni od " + nextDate + " do " + todayDate);
    doc.text(70, 55, "Czas przepracowany: " + fullWorkTime);
    workTimeMessages.map((message, index) =>
      doc.text(
        70,
        65 + index * 10,
        index +
          1 +
          ". " +
          message.message +
          " godzina: " +
          message.message_sent_at.slice(11, 16) +
          " dnia: " +
          message.message_sent_at.slice(0, 10)
      )
    );
    doc.save(
      "czas_pracy_" +
        user_detail[0].name +
        "_" +
        user_detail[0].surname +
        "_" +
        todayDate +
        ".pdf"
    );
  };

  useEffect(() => {
    let today = new Date();
    let time =
      String(today.getHours()).padStart(2, "0") +
      ":" +
      String(today.getMinutes()).padStart(2, "0");
    today = formatDate(today);
    let nextMonth = new Date(today);
    nextMonth.setMonth(nextMonth.getMonth() - 1);
    nextMonth = formatDate(nextMonth);
    setNextDate(nextMonth);
    fetchUsers(today, nextMonth);
    setTimeNow(time);
    setTodayDate(today);
  }, []);

  return (
    <div className="worktime-container">
      {users_detail && users_detail.length > 0 ? (
        <div className="worktime-items-container">
          <div className="select-nav">
            <Fragment>
              <Form.Group>
                <Typeahead
                  ref={selectRef}
                  id="basic-typeahead-single"
                  onChange={handleSelectChange}
                  highlightOnlyResult={true}
                  paginate={true}
                  options={users_detail.map(
                    (user) =>
                      user.user_detail_id +
                      ". " +
                      user.name +
                      " " +
                      user.surname
                  )}
                  defaultSelected={users_detail
                    .map(
                      (user) =>
                        user.user_detail_id +
                        ". " +
                        user.name +
                        " " +
                        user.surname
                    )
                    .slice(0, 1)}
                  placeholder="Wybierz użytkownika..."
                />
              </Form.Group>
            </Fragment>
            {user_detail && user_detail.length > 0 ? (
              <div className="dates-list">
                <h1 className="h1-text">
                  {user_detail[0].name} {user_detail[0].surname} -{" "}
                  {user_detail[0].team_id_fk !== null
                    ? user_detail[0].team_id_fk.team_name
                    : "Brak teamu"}
                </h1>
                <Button
                  className="btn-add-ho"
                  variant="success"
                  onClick={handleShow}
                >
                  Dodaj wiadomość
                </Button>
                <ReactDatePicker
                  locale="pl"
                  selected={new Date(nextDate)}
                  dateFormat="yyyy-MM-dd"
                  className="select-nav-item"
                  onChange={handleNextChange}
                />
                <ReactDatePicker
                  locale="pl"
                  className="select-nav-item"
                  format="yyyy-MM-dd"
                  value={todayDate}
                  onChange={handleTodayChange}
                />
                <Button
                  className="select-nav-item"
                  variant="primary"
                  onClick={handleSelectChange}
                >
                  Szukaj
                </Button>
                <Button
                  variant="info"
                  className="btn-add-ho"
                  onClick={generateWorktimePdf}
                >
                  PDF
                </Button>
              </div>
            ) : (
              <div></div>
            )}
          </div>
          <div>
            {user_detail && user_detail.length > 0 ? (
              <>
                <div className="message-container">
                  {workTimeMessages && workTimeMessages.length > 0 ? (
                    <>
                      <h2>Czas pracy: {fullWorkTime}</h2>
                      <div className="work-time-messages">
                        {workTimeMessages.map((message, index) => (
                          <div className="message" key={index}>
                            <p className="select-nav-item">
                              {message.message}{" "}
                            </p>
                            <p className="select-nav-item">
                              {message.message_sent_at.slice(0, 10)}{" "}
                              {message.message_sent_at.slice(11, 16)}
                            </p>
                            <Button
                              value={message.work_time_id}
                              className="select-nav-item"
                              variant="outline-info"
                              size="sm"
                              onClick={handleShow}
                            >
                              Edytuj
                            </Button>
                            <Button
                              value={message.work_time_id}
                              className="select-nav-item"
                              variant="danger"
                              size="sm"
                              onClick={handleShowDelete}
                            >
                              Usuń
                            </Button>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div>Brak wiadomości tego dnia!</div>
                  )}
                </div>
              </>
            ) : (
              <div>Wybierz Użytkownika</div>
            )}
          </div>
        </div>
      ) : (
        <div>
          {showLoader ? (
            <Spinner
              animation="border"
              variant="success"
              style={{ width: "8rem", height: "8rem" }}
            >
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          ) : (
            <Alert variant="danger">
              <Alert.Heading>Wystąpił błąd przy wczytywaniu!</Alert.Heading>
              <p>Spróbuj ponownie później</p>
            </Alert>
          )}
        </div>
      )}
      <ModalEditAddWorkTime
        show={show}
        onHide={() => {
          handleSelectChange();
          setShow(false);
        }}
        editMessage={editMessage}
        todayDate={todayDate}
        timeNow={timeNow}
        user_detail={user_detail}
      />
      <ModalDeleteWorkTime
        show={showDelete}
        onHide={() => {
          handleSelectChange();
          setShowDelete(false);
        }}
        deleteId={deleteId}
      />
    </div>
  );
}
