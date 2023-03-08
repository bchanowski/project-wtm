import "bootstrap/dist/css/bootstrap.min.css";
import Spinner from "react-bootstrap/Spinner";

const CenteredSpinner = () => {
  return (
    <div className="position-absolute start-50 top-50">
      <Spinner animation="border" variant={"light"} />
    </div>
  );
};
export default CenteredSpinner;
