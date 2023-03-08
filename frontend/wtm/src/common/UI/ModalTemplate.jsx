import "bootstrap/dist/css/bootstrap.min.css";
import Modal from "react-bootstrap/Modal";

function ModalTemplate(props) {
  return (
    <Modal
      show={props.modalState}
      onHide={props.closeModal}
      fullscreen={!!props?.fullscreen}
    >
      <Modal.Header closeButton>
        <Modal.Title className="fs-3">{props.modalHeading}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{props.children}</Modal.Body>
    </Modal>
  );
}

export default ModalTemplate;
