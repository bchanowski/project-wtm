import {Toast, ToastContainer} from "react-bootstrap";

export default function ErrorToast({ show, onClose, message }) {
    return <ToastContainer position="top-center">
        <Toast
            onClose={onClose}
            show={show}
            delay={5000}
            bg="danger"
            autohide
        >
            <Toast.Header>
                <strong className="me-auto">BŁĄD</strong>
            </Toast.Header>
            <Toast.Body>
                {message}
            </Toast.Body>
        </Toast>
    </ToastContainer>;
}