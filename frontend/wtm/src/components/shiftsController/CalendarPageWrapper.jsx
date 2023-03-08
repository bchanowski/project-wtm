import Container from "react-bootstrap/Container";
import classes from "./ShiftsController.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Row } from "react-bootstrap";

const containerClasses = `${classes["shifts_controller-container"]} d-flex flex-column justify-content-center col-11 col-md-8 col-xl-12`;

const CalendarPageWrapper = (props) => {
  return (
    <Container fluid className={containerClasses}>
      <Row className="col-12">{props.children}</Row>
    </Container>
  );
};

export default CalendarPageWrapper;

//
