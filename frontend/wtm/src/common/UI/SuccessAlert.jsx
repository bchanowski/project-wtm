import "bootstrap/dist/css/bootstrap.min.css";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";

const SuccessAlert = ({ successMessage, onCloseModal }) => {
  return (
    <Alert variant="success">
      <Alert.Heading>{successMessage || "Success!"}</Alert.Heading>
      <div className="d-flex justify-content-end">
        <Button onClick={onCloseModal} variant="outline-success">
          Super
        </Button>
      </div>
    </Alert>
  );
};
export default SuccessAlert;
