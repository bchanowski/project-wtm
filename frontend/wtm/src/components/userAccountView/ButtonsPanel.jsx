import "bootstrap/dist/css/bootstrap.min.css";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import classes from "./UserAccountView.module.css";

const ButtonsPanel = ({ openRemoteDayForm, openWorkTimeForm }) => {
  return (
    <Row>
      <Col className="col-12 col-xl-11">
        <div className={classes["buttonsPanel-container"]}>
          <button
            onClick={() => openRemoteDayForm()}
            className={`${classes["userPage-btn"]} ${classes["remoteBtn"]}`}
          >
            Dodaj dzień zdalny
          </button>
          <button
            onClick={() => openWorkTimeForm()}
            className={`${classes["userPage-btn"]} ${classes["statusBtn"]}`}
          >
            Dodaj status
          </button>
        </div>
      </Col>
    </Row>
  );
};

export default ButtonsPanel;
