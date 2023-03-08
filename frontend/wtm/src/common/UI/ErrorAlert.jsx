import "bootstrap/dist/css/bootstrap.min.css";
import Alert from "react-bootstrap/Alert";

const ErrorAlert = ({ requestError }) => {
  return (
    <Alert variant="danger">
      <Alert.Heading>{requestError}</Alert.Heading>
    </Alert>
  );
};
export default ErrorAlert;
