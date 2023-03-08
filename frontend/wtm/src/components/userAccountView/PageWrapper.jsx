import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";

import classes from "./UserAccountView.module.css";

const containerClasses = `${classes["userAccountView-pageContainer"]} d-flex flex-column justify-content-center col-12 col-md-11 col-lg-12 col-xl-11`;

const PageWrapper = (props) => {
  return (
    <Container fluid className={containerClasses}>
      {props.children}
    </Container>
  );
};

export default PageWrapper;
