import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import classes from "./Login.module.css";

function LoginPageWrapper(props) {
  return (
    <Container fluid className={`${classes["loginPage-container"]}`}>
      <Row className="col-12 col-sm-8 col-md-8 col-lg-6 col-xl-4">
        <Col>{props.children}</Col>
      </Row>
    </Container>
  );
}

export default LoginPageWrapper;
