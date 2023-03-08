import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { useEffect, useRef, useState, useContext } from "react";
import axios from "axios";
import { Input, Typeahead } from "react-bootstrap-typeahead";
import AppContext from "../../shared/context/app-context";

function ManageTeamForm(prop) {
  const [teamName, setTeamName] = useState("");
  const [teams, setTeams] = useState([]);

  const typeHeadRef = useRef();
  const inputRef = useRef();

  const { token, role } = useContext(AppContext);
  const auth = {
    headers: { Authorization: "Bearer " + token },
  };

  const getListOfTeam = async () => {
    await axios
      .get("http://localhost:5000/api/teams/all", auth)
      .then((response) => {
        setTeams(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getListOfTeam();
  }, []);

  async function clickHandler(e, buttonName, teamName) {
    //option is name of the button and that name will specify request
    e.preventDefault();

    const hasNumber = /\d/;
    const hasSpecialChar = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    const baseUrl = "http://localhost:5000/api/teams";
    let teamObj = {};
    if (buttonName === "Dodaj") {
      teamObj = { team_name: teamName.toLocaleLowerCase() };
    } else if (typeHeadRef.current.inputNode.value === "") {
      teamObj = { team_name: "" };
    } else {
      teamObj = {
        team_name: typeHeadRef.current.inputNode.value.toLocaleLowerCase(),
      };
    }

    if (hasNumber.test(teamName) || hasSpecialChar.test(teamName)) {
      alert(
        "Nieudało sie dodać zespołu sprawdz czy wprowadzona nazwa nie zawiera liczby lub znaku specjalnego. "
      );
    } else {
      if (buttonName.localeCompare("Dodaj") === 0) {
        console.log("There will be post request");
        let response = await axios.post(baseUrl, teamObj, auth);
        console.log(response);
        alert(response.data.response.error_mess);
        //if name is usun make del request
      } else if (buttonName.localeCompare("Usuń") === 0) {
        let response = await axios.put(baseUrl + "/delete", teamObj, auth);
        alert(response.data.response.error_mess);
        prop.setList();
        prop.setNameButton("");
      } else if (buttonName.localeCompare("Szukaj" === 0)) {
        console.log("searching");
        if (teamObj.team_name === "") {
          alert("Wpisz nazwe ");
        } else {
          try {
            let response = await axios.get(
              baseUrl + `/${teamObj.team_name}`,
              auth
            );
            prop.func(response.data);
          } catch (error) {
            alert(error.response.data.error_mess);
          }
        }
      } else {
        alert("Coś poszło nie tak :(");
      }
    }
  }

  return (
    <Form
      className="mx-auto mt-4 lg"
      style={{ width: 500 }}
      onSubmit={(e) => clickHandler(e, prop.name, teamName)}
    >
      <Row>
        <Col className="col-8">
          {prop.name === "Dodaj" ? (
            <Input
              onChange={(e) => {
                setTeamName(e.target.value);
              }}
            ></Input>
          ) : (
            <Typeahead
              ref={typeHeadRef}
              id="basic-typeahead-single"
              options={teams.map((value) => value.team_name)}
              placeholder="Nazwa zespołu"
              onChange={setTeamName}
            />
          )}
        </Col>
        <Col>
          <Button variant="primary" type="submit">
            {prop.name}
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

export default ManageTeamForm;
