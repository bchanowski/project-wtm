import { Fragment, useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Alert, Button, Form, Spinner } from "react-bootstrap";
import "./Homeoffice.css";
import ModalDeleteHO from "./ModalDeleteHO";
import ModalEditAddHO from "./ModalEditAddHO";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { Typeahead } from "react-bootstrap-typeahead";
import ReactDatePicker, { registerLocale } from "react-datepicker";
import formatDate from "../../shared/formatDate";
import pl from "date-fns/locale/pl";
import AppContext from "../../shared/context/app-context";
import jsPDF from "jspdf";
registerLocale("pl", pl);

export default function HomeofficeDays() {
  const [users_detail, setUsersDetail] = useState(null);
  const [user_detail, setUserDetail] = useState(null);
  const [homeoffice_days, setHomeofficeDays] = useState(null);
  const [showLoader, setShowLoader] = useState(true);
  const [show, setShow] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editDate, setEditDate] = useState("");
  const [todayDate, setTodayDate] = useState("");
  const [nextDate, setNextDate] = useState("");
  const { token } = useContext(AppContext);
  const auth = {
    headers: { Authorization: "Bearer " + token },
  };

  const handleTodayChange = (e) => {
    let newDate = formatDate(e);
    if (newDate <= nextDate) setTodayDate(newDate);
  };
  const handleNextChange = (e) => {
    let newDate = formatDate(e);
    if (newDate >= todayDate) setNextDate(newDate);
  };
  const handleShow = (numberSelected) => {
    let result = homeoffice_days.find((obj) => {
      return obj.homeoffice_id == numberSelected.target.value;
    });
    setEditDate(result);
    setShow(true);
  };
  const handleShowDelete = (numberSelected) => {
    setShowDelete(true);
    setDeleteId(numberSelected);
  };
  const selectRef = useRef("");
  const BASE_URL = "http://localhost:5000/api/";
  let today = new Date();
  today = formatDate(today);

  const fetchUsers = (today, nextMonth) => {
    setShowLoader(true);
    axios
      .get(BASE_URL + "userdetail", auth)
      .then((response) => {
        setUsersDetail(response.data);
        setShowLoader(false);
        if (!response.data.length) throw "";
        handleSelectChange(
          null,
          today,
          nextMonth,
          response.data[0].user_detail_id
        );
      })
      .catch((err) => {
        console.log(err);
        setShowLoader(false);
      });
  };

  useEffect(() => {
    setTodayDate(today);
    let nextMonth = new Date(today);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    nextMonth = formatDate(nextMonth);
    setNextDate(nextMonth);
    fetchUsers(today, nextMonth);
  }, []);

  const generateHomeofficePdf = () => {
    var doc = new jsPDF("landscape", "px", "a4", "false");
    doc.setFontSize(25);
    doc.text(
      70,
      30,
      "Dni zdalne - " +
        user_detail[0].name +
        " " +
        user_detail[0].surname +
        " - " +
        (user_detail[0].team_id_fk
          ? user_detail[0].team_id_fk.team_name
          : "Brak teamu")
    );
    doc.setFontSize(12);
    doc.text(70, 40, "W przedziale od " + todayDate + " do " + nextDate);
    homeoffice_days.map((day, index) =>
      doc.text(70, 55 + index * 10, index + 1 + ". " + day.date)
    );
    doc.save(
      "dni_zdalne_" +
        user_detail[0].name +
        "_" +
        user_detail[0].surname +
        "_" +
        todayDate +
        "_" +
        nextDate +
        ".pdf"
    );
  };

  const handleSelectChange = (e, todayDateParam, nextDateParam, user_id) => {
    setShowLoader(true);
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
          let axiosDate = todayDateParam ? todayDateParam : todayDate;
          let axiosNextDate = nextDateParam ? nextDateParam : nextDate;
          axios
            .get(
              BASE_URL +
                "homeoffice/between/" +
                response.data[0].user_id.user_id +
                "/" +
                axiosDate +
                "/" +
                axiosNextDate,
              auth
            )
            .then((response) => {
              setHomeofficeDays(response.data);
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

  return (
    <div className="homeoffice-container">
      {users_detail && users_detail.length > 0 ? (
        <div className="homeoffice-container">
          <div className="homeoffice-container-data">
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
              <>
                <h1>
                  {user_detail[0].name} {user_detail[0].surname} -{" "}
                  {user_detail[0].team_id_fk !== null
                    ? user_detail[0].team_id_fk.team_name
                    : "Brak teamu"}
                </h1>
                <div className="dates-list">
                  <Button
                    variant="success"
                    onClick={handleShow}
                    className="btn-add-ho"
                  >
                    Dodaj dzień
                  </Button>
                  <ReactDatePicker
                    locale="pl"
                    selected={new Date(todayDate)}
                    dateFormat="yyyy-MM-dd"
                    className="select-user-ho"
                    onChange={handleTodayChange}
                  />
                  <ReactDatePicker
                    locale="pl"
                    selected={new Date(nextDate)}
                    dateFormat="yyyy-MM-dd"
                    className="select-user-ho"
                    onChange={handleNextChange}
                  />
                  <Button
                    variant="primary"
                    onClick={handleSelectChange}
                    className="btn-add-ho"
                  >
                    Szukaj
                  </Button>
                  <Button
                    variant="info"
                    onClick={generateHomeofficePdf}
                    className="btn-add-ho"
                  >
                    PDF
                  </Button>
                </div>
                <div className="dates-list">
                  {homeoffice_days && homeoffice_days.length > 0 ? (
                    <>
                      <h2 className="h2-text">Dni zdalne:</h2>
                      <div className="list-dates-container">
                        {homeoffice_days.map((day, index) => (
                          <div className="dates-list" key={index}>
                            <p className="date-list">{day.date}</p>
                            <Button
                              value={day.homeoffice_id}
                              variant="outline-info"
                              size="sm"
                              className="btn-del-ho"
                              onClick={handleShow}
                            >
                              Edytuj
                            </Button>
                            <Button
                              value={day.homeoffice_id}
                              variant="danger"
                              size="sm"
                              className="btn-del-ho"
                              onClick={handleShowDelete}
                            >
                              Usuń
                            </Button>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div>Brak dni zdalnych!</div>
                  )}
                </div>
              </>
            ) : (
              <div></div>
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
      <ModalEditAddHO
        show={show}
        onHide={() => {
          setShow(false);
          handleSelectChange();
        }}
        editDate={editDate}
        user_detail={user_detail}
        today={today}
      />
      <ModalDeleteHO
        show={showDelete}
        onHide={() => {
          setShowDelete(false);
          handleSelectChange();
        }}
        deleteId={deleteId}
      />
    </div>
  );
}
