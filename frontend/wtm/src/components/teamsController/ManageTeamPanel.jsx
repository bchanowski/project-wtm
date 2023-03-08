import { useEffect, useState } from "react";
import ListOfUsers from "./ListOfTeams";
import ManageTeamForm from "./ManageTeamForm";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import classes from "./CSS/Menage.module.css";
import { Container, Row } from "react-bootstrap";

function ManageTeamPanel() {
  const [clicked, setClick] = useState(0);
  const [nameButton, setNameButton] = useState("");

  function handleClick(e) {
    console.log(e.target.textContent);
    setNameButton(e.target.textContent);
    setClick(1);
  }

  function showList() {
    setClick(0);
  }

  return (
    <div className="container-md">
      <Container>
        <Row>
          <ButtonGroup>
            <Button
              className={classes.buttonG}
              onClick={handleClick}
              variant="light"
            >
              Dodaj
            </Button>
            <Button
              className={classes.buttonG}
              onClick={handleClick}
              variant="light"
            >
              Usuń
            </Button>
            <Button
              className={classes.buttonG}
              onClick={showList}
              variant="light"
            >
              Wyświetl tabele zespołów
            </Button>
          </ButtonGroup>
        </Row>
        <Row>
          {clicked ? (
            <ManageTeamForm
              setList={showList}
              setNameButton={setNameButton}
              name={nameButton}
            />
          ) : (
            <ListOfUsers />
          )}
        </Row>
      </Container>
    </div>
  );
}
export default ManageTeamPanel;
