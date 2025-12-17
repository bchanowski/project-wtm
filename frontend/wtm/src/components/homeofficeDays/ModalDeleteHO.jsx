import { Button, Modal } from "react-bootstrap";
import axios from "axios";
import ErrorToast from "../../shared/ErrorToast";
import { useContext, useState } from "react";
import AppContext from "../../shared/context/app-context";

export default function ModalDeleteHO({ show, onHide, deleteId }) {
  const [showToast, setShowToast] = useState(false);
  const BASE_URL = import.meta.env.VITE_API_URL + "/api/";
  const { token } = useContext(AppContext);
  const auth = {
    headers: { Authorization: "Bearer " + token },
  };
  const handleDelete = () => {
    axios
      .delete(BASE_URL + "homeoffice/" + deleteId.target.value, auth)
      .then((response) => {
        console.log(response);
        onHide();
      })
      .catch((err) => {
        setShowToast(true);
        console.log(err);
      });
  };
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Usuń dzień</Modal.Title>
      </Modal.Header>
      <Modal.Body>Czy na pewno chcesz usunąć ten dzień?</Modal.Body>
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
