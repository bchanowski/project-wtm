import { Button, Modal } from "react-bootstrap";
import axios from "axios";
import ErrorToast from "../../../shared/ErrorToast";
import { useContext, useState } from "react";
import AppContext from "../../../shared/context/app-context";

export default function ModalDeleteUser({
  show,
  onHide,
  deleteId,
  deleteUserId,
}) {
  const BASE_URL = import.meta.env.VITE_API_URL + "/api/";
  const [showToast, setShowToast] = useState(false);
  const { token } = useContext(AppContext);
  const auth = {
    headers: { Authorization: "Bearer " + token },
  };

  const handleDelete = () => {
    axios
      .delete(BASE_URL + "userdetail/" + deleteId, auth)
      .then((response) => {
        console.log(response);
        axios
          .delete(BASE_URL + "homeoffice/user/" + deleteUserId, auth)
          .then((response) => {
            axios
              .delete(BASE_URL + "work-time/user/" + deleteUserId, auth)
              .then((response) => {
                axios
                  .delete(BASE_URL + "users/" + deleteUserId, auth)
                  .then((response) => {
                    onHide();
                  })
                  .catch((err) => {
                    console.log(err);
                    setShowToast(true);
                  });
              })
              .catch((err) => {
                console.log(err);
                setShowToast(true);
              });
          })
          .catch((err) => {
            console.log(err);
            setShowToast(true);
          });
      })
      .catch((err) => {
        console.log(err);
        setShowToast(true);
      });
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Usuń użytkownika</Modal.Title>
      </Modal.Header>
      <Modal.Body>Czy na pewno chcesz usunąć użytkownika?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Wróć
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          Usuń
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
