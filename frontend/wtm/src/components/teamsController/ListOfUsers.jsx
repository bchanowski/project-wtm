import { useLayOutEffect, useState, useContext } from "react";
import { Button, Table } from "react-bootstrap";
import ManageTeamForm from "./ManageTeamForm";

import classes from "./CSS/Manage.module.css";
import ManageUserForm from "./ManageUserForm";
import Backdrop from "./Backdrop";
import axios from "axios";
import ListTeam from "./listTeam";
import AppContext from "../../shared/context/app-context";

function ListOfUsers() {
  const dataTable = [];

  const [data, setData] = useState(dataTable);
  const [modalIsOpen, setModalStatus] = useState(false);
  const [name, setName] = useState("");
  const [teamName, setNameOfTeam] = useState("");
  const [teamId, setTeamId] = useState("");
  const [add, setAdd] = useState("");
  const [teamList, setTeamList] = useState("");
  const [listIsOpen, setListIsOpen] = useState(false);
  const { token, role } = useContext(AppContext);
  const auth = {
    headers: { Authorization: "Bearer " + token },
  };

  function addUser(event, team_name, team_id) {
    setModalStatus(true);
    setNameOfTeam(team_name);
    setTeamId(team_id);
    setAdd(1);
    setName("Dodaj do drużyny");
  }
  function hideForm() {
    setModalStatus(false);
  }

  function delUser(e, team_name, team_id) {
    setModalStatus(true);
    setNameOfTeam(team_name);
    setTeamId(team_id);
    setName("Usuń z drużyny");
    setAdd(0);
  }

  async function refreshList() {
    const dataFromDb = await axios.get(
      import.meta.env.VITE_API_URL + "/api/teams/all",
      auth
    );
    setData(dataFromDb.data);
  }
  async function showList(event, id) {
    setListIsOpen(true);
    console.log(id);
    const listOfUser = await axios.get(
      import.meta.env.VITE_API_URL + `/api/userdetail/team/${id}`,
      auth
    );

    setTeamList(listOfUser.data);
  }

  useLayOutEffect(() => {
    refreshList();
  }, []);

  return (
    <div>
      <div id="search">
        <ManageTeamForm name="Szukaj" />
        <Button onClick={refreshList}>Odśwież</Button>
      </div>
      <div id="table">
        <Table
          className="table mx-auto mt-4 lg"
          striped
          bordered
          hover
          size="xl"
        >
          <thead>
            <tr>
              <th>#</th>
              <th>Nazwa zespołu</th>
              <th>Ilość członków</th>
              <th>Data utworzenia</th>
              <th>Data aktualizacji </th>
              <th>Dodaj do zespołu</th>
            </tr>
          </thead>
          <tbody>
            {data.map((value, key) => {
              return (
                <tr key={key} onClick={(event) => showList(event, value.id)}>
                  <td>{value.id}</td>
                  <td>{value.team_name}</td>
                  <td>{value.team_size}</td>
                  <td>{value.created_at}</td>
                  <td>{value.edited_at}</td>
                  <td>
                    <Button
                      className={classes.buttonG}
                      onClick={(event) =>
                        addUser(event, value.team_name, value.id)
                      }
                      variant="light"
                    >
                      Dodaj
                    </Button>
                    <Button
                      className={classes.buttonG}
                      onClick={(event) =>
                        delUser(event, value.team_name, value.id)
                      }
                      variant="light"
                    >
                      {" "}
                      Usuń
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        {modalIsOpen && (
          <ManageUserForm
            action={name}
            teamName={teamName}
            teamId={teamId}
            flag={add}
            hideFunc={hideForm}
          />
        )}
        {modalIsOpen && <Backdrop onClick={hideForm} />}
        {listIsOpen && <ListTeam data={teamList} />}
      </div>
    </div>
  );
}
export default ListOfUsers;
