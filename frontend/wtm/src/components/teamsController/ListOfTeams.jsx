import { useEffect, useState, useContext } from "react";
import { Button, Table } from "react-bootstrap";
import ManageTeamForm from "./ManageTeamForm";

import classes from "./CSS/Menage.module.css";
import ManageUserForm from "./ManageUserForm";
import Backdrop from "./Backdrop";
import axios from "axios";
import ListTeam from "./listUsers";

import {
  AiOutlineCloudSync,
  AiOutlineUserAdd,
  AiOutlineUserDelete,
  AiOutlineTool,
  AiOutlineCloudDownload,
} from "react-icons/ai";
import EditTeamForm from "./EditTeamForm";
import AppContext from "../../shared/context/app-context";

import { CSVLink, CSVDownload } from "react-csv";

function ListOfUsers({ setList, setNameButton }) {
  const dataTable = [];

  const [data, setData] = useState(dataTable);
  const [modalIsOpen, setModalStatus] = useState(false);
  const [name, setName] = useState("");
  const [teamName, setNameOfTeam] = useState("");
  const [teamId, setTeamId] = useState("");
  const [add, setAdd] = useState("");
  const [teamList, setTeamList] = useState("");
  const [listIsOpen, setListIsOpen] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [createAt, setCreatedAt] = useState("");
  const [editedAt, setEditedAt] = useState("");
  const [number, setNumber] = useState(0);
  const { token, role } = useContext(AppContext);
  const auth = {
    headers: { Authorization: "Bearer " + token },
  };

  const headers = [
    { label: "ID", key: "user_detail_id" },
    { label: "Imie", key: "name" },
    { label: "Nazwisko", key: "surname" },
    { label: "Nr Telefonu", key: "phone_number" },
    { label: "Email", key: "user_id.email" },
    { label: "Utworzony", key: "created_at" },
    { label: "Edytowany", key: "edited_at" },
    { label: "Team", key: "team_id.team_name" },
  ];
  const headers1 = [
    { label: "ID", key: "user_detail_id" },
    { label: "Nazwa", key: "team_name" },
    { label: "Utworzony", key: "created_at" },
    { label: "Edytowany", key: "edited_at" },
  ];

  function addUser(event, team_name, team_id) {
    setModalStatus(true);
    setNameOfTeam(team_name);
    setTeamId(team_id);
    setAdd(1);
    setName("Dodaj do drużyny");
  }
  function hideForm() {
    setModalStatus(false);
    setEditModal(false);
  }

  function delUser(e, team_name, team_id) {
    setModalStatus(true);
    setNameOfTeam(team_name);
    setTeamId(team_id);
    setName("Usuń z drużyny");
    setAdd(0);
  }
  function editUser(e, team_name, team_id, created_at, edited_at) {
    setEditModal(true);
    setNameOfTeam(team_name);
    setTeamId(team_id);
    setCreatedAt(created_at);
    setEditedAt(edited_at);
  }

  async function refreshList() {
    const dataFromDb = await axios.get(
      "http://localhost:5000/api/teams/all",
      auth
    );
    setData(dataFromDb.data);
    dataTable.push(dataFromDb.data);
  }
  async function showList(event, id) {
    setListIsOpen(true);

    const listOfUser = await axios.get(
      `http://localhost:5000/api/userdetail/team/${id}`,
      auth
    );
    setTeamList(listOfUser.data);
  }

  const pullData = (dataFromChild) => {
    setData(dataFromChild);
  };

  useEffect(() => {
    refreshList();
  }, []);

  return (
    <div>
      <div id="search">
        <ManageTeamForm name="Szukaj" func={pullData} />
        <Button onClick={refreshList}>
          <AiOutlineCloudSync size="2em" />
        </Button>
      </div>
      <div id="table">
        <Table className="mx-auto mt-4 lg " bordered hover size="xl">
          <thead>
            <tr>
              <th>#</th>
              <th>Nazwa zespołu</th>
              <th>Data utworzenia</th>
              <th>Godzina utworzenia</th>
              <th>Data aktualizacji </th>
              <th>Godzina aktualizacji</th>
              <th>Dodaj do zespołu</th>
              <th>Edycja</th>
            </tr>
          </thead>
          <tbody>
            {data.map((value, key) => {
              return (
                <tr
                  key={key}
                  onClick={(event) => showList(event, value.team_id)}
                >
                  <td>#{key + 1}</td>
                  <td>
                    <b>{value.team_name}</b>
                  </td>
                  <td>
                    <b>{value.created_at.split("T")[0]}</b>
                  </td>
                  <td>
                    <b>{value.created_at.split("T")[1].substring(0, 8)}</b>
                  </td>
                  <td>
                    <b>{value.edited_at.split("T")[0]}</b>
                  </td>
                  <td>
                    <b>{value.edited_at.split("T")[1].substring(0, 8)}</b>
                  </td>
                  <td>
                    <Button
                      className={classes.buttonG}
                      onClick={(event) =>
                        addUser(event, value.team_name, value.team_id)
                      }
                      variant="light"
                    >
                      <AiOutlineUserAdd size="2em" />
                    </Button>
                    <Button
                      className={classes.buttonG}
                      onClick={(event) =>
                        delUser(event, value.team_name, value.team_id)
                      }
                      variant="light"
                    >
                      <AiOutlineUserDelete size="2em" />
                    </Button>
                    <Button variant="light">
                      {console.log(teamList)}
                      <CSVLink
                        className={classes.user}
                        data={teamList}
                        filename={`Tabela Uzytkowników ${value.team_name}`}
                        headers={headers}
                      >
                        <AiOutlineCloudDownload size="2em" />
                      </CSVLink>
                    </Button>
                  </td>
                  <td>
                    <Button
                      className={classes.buttonG}
                      onClick={(event) =>
                        editUser(
                          event,
                          value.team_name,
                          value.team_id,
                          value.created_at,
                          value.edited_at
                        )
                      }
                      variant="light"
                    >
                      <AiOutlineTool size="2em" />
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
            refresh={showList}
          />
        )}
        {modalIsOpen && <Backdrop onClick={hideForm} />}
        {listIsOpen && <ListTeam data={teamList} />}

        {editModal && (
          <EditTeamForm
            id={teamId}
            name={teamName}
            create={createAt}
            edit={editedAt}
            hideFunc={hideForm}
            refresh={refreshList}
          />
        )}

        {editModal && <Backdrop onClick={hideForm} />}
      </div>
    </div>
  );
}
export default ListOfUsers;
