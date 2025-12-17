import { Button, Modal } from "react-bootstrap";
import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import ErrorToast from "../../shared/ErrorToast";
import DatePicker, { registerLocale } from "react-datepicker";
import pl from "date-fns/locale/pl";
import AppContext from "../../shared/context/app-context";
registerLocale("pl", pl);

export default function ModalEditAddHO({
  show,
  onHide,
  editDate,
  today,
  user_detail,
}) {
  const dateRef = useRef("");
  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState(
    "Coś poszło nie tak! Spróbuj ponownie za moment!"
  );
  const [showDate, setShowDate] = useState(new Date());
  const BASE_URL = import.meta.env.VITE_API_URL + "/api/";
  const { token } = useContext(AppContext);
  const auth = {
    headers: { Authorization: "Bearer " + token },
  };

  useEffect(() => {
    if (editDate) {
      const newDate = new Date(editDate.date);
      setShowDate(newDate);
    }
  }, [editDate]);

  const handleSubmit = () => {
    console.log(dateRef.current.input.value);
    if (today > dateRef.current.input.value) {
      setMessage("Mozesz tylko dodać dni zdalne na przyszłe dni!");
      setShowToast(true);
    } else {
      axios
        .get(
          BASE_URL +
            "homeoffice/user/" +
            user_detail[0].user_id.user_id +
            "/" +
            dateRef.current.input.value,
          auth
        )
        .then((response) => {
          if (response.data.length !== 0) {
            setMessage("Ten użytkownik ma już przypisany ten dzień zdalny");
            setShowToast(true);
          } else {
            const body = {
              date: dateRef.current.input.value,
              conversation: "Lista zdalnej pracy",
              user_id_fk: user_detail[0].user_id.user_id,
            };
            axios
              .post(BASE_URL + "homeoffice", body, auth)
              .then((response) => {
                console.log(response);
                onHide();
              })
              .catch((err) => {
                setMessage("Coś poszło nie tak! Spróbuj ponownie za moment!");
                setShowToast(true);
                console.log(err);
              });
          }
        })
        .catch((err) => {
          setMessage("Coś poszło nie tak! Spróbuj ponownie za moment!");
          setShowToast(true);
          console.log(err);
        });
    }
  };

  const handleEdit = () => {
    console.log(dateRef);
    axios
      .get(
        BASE_URL +
          "homeoffice/user/" +
          user_detail[0].user_id.user_id +
          "/" +
          dateRef.current.input.value,
        auth
      )
      .then((response) => {
        if (response.data.length !== 0) {
          setMessage("Ten użytkownik ma już przypisany ten dzień zdalny");
          setShowToast(true);
        } else {
          const newDate = {
            date: dateRef.current.input.value,
          };
          axios
            .put(
              BASE_URL + "homeoffice/" + editDate.homeoffice_id,
              newDate,
              auth
            )
            .then((response) => {
              console.log(response);
              onHide();
            })
            .catch((err) => {
              setMessage("Coś poszło nie tak! Spróbuj ponownie za moment!");
              setShowToast(true);
              console.log(err);
            });
        }
      })
      .catch((err) => {
        setMessage("Coś poszło nie tak! Spróbuj ponownie za moment!");
        setShowToast(true);
        console.log(err);
      });
  };
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        {editDate ? (
          <Modal.Title>Edytuj dzień!</Modal.Title>
        ) : (
          <Modal.Title>Dodaj dzień!</Modal.Title>
        )}
      </Modal.Header>
      <Modal.Body>
        <DatePicker
          locale="pl"
          selected={showDate}
          ref={dateRef}
          dateFormat="yyyy-MM-dd"
          onChange={(date) => {
            console.log(dateRef);
            setShowDate(date);
          }}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Wróć
        </Button>
        {editDate ? (
          <Button variant="info" onClick={handleEdit}>
            Edytuj
          </Button>
        ) : (
          <Button variant="success" onClick={handleSubmit}>
            Dodaj
          </Button>
        )}
      </Modal.Footer>
      <ErrorToast
        onClose={() => setShowToast(false)}
        show={showToast}
        message={message}
      />
    </Modal>
  );
}
