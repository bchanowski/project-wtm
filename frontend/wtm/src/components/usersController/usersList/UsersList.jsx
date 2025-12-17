import { Fragment, useContext, useEffect, useRef, useState } from "react";
import { Button, ListGroup, Alert, Spinner, Form } from "react-bootstrap";
import "./UsersList.css";
import { Link } from "react-router-dom";
import axios from "axios";
import UserListPagination from "./UserListPagination";
import Pagination from "./Pagination";
import { UserContext } from "../context/UserFilterContext";
import { Typeahead } from "react-bootstrap-typeahead";
import AppContext from "../../../shared/context/app-context";

export default function UsersList() {
  const [user_detail, setUserDetail] = useState(null);
  const [teams, setTeams] = useState(null);
  const [showLoader, setShowLoader] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);
  const { surname, setSurname, teamName, setTeamName } =
    useContext(UserContext);
  const surnameRef = useRef("");
  const teamRef = useRef("");
  const BASE_URL = import.meta.env.VITE_API_URL + "/api/";
  const { token } = useContext(AppContext);
  const auth = {
    headers: { Authorization: "Bearer " + token },
  };

  const fetchUsers = () => {
    setShowLoader(true);
    axios
      .get(BASE_URL + "userdetail", auth)
      .then((response) => {
        setUserDetail(response.data);
        setShowLoader(false);
      })
      .catch((err) => {
        console.log(err);
        setShowLoader(false);
      });
  };

  const fetchTeams = () => {
    axios
      .get(BASE_URL + "teams/all", auth)
      .then((response) => {
        setTeams(response.data);
        filterUsers();
      })
      .catch((err) => console.log(err));
  };

  const filterUsers = () => {
    paginate(1);
    let keyword = surnameRef.current.value;
    let teamid = teamName;
    if (teamRef.current.inputNode) teamid = teamRef.current.inputNode.value;
    keyword = keyword.charAt(0).toUpperCase() + keyword.slice(1).toLowerCase();
    console.log(teamid);
    console.log(keyword);
    setShowLoader(true);
    if (keyword !== "" && teamid === "") {
      axios
        .get(BASE_URL + "userdetail/" + keyword, auth)
        .then((response) => {
          setUserDetail(response.data);
          setShowLoader(false);
        })
        .catch((err) => {
          console.log(err);
          setShowLoader(false);
        });
    } else if (keyword === "" && teamid !== "") {
      axios
        .get(BASE_URL + "userdetail/teamname/" + teamid, auth)
        .then((response) => {
          setUserDetail(response.data);
          setShowLoader(false);
        })
        .catch((err) => {
          console.log(err);
          setShowLoader(false);
        });
      setShowLoader(false);
    } else if (keyword !== "" && teamid !== "") {
      axios
        .get(BASE_URL + "userdetail/teamname/" + keyword + "/" + teamid, auth)
        .then((response) => {
          setUserDetail(response.data);
          setShowLoader(false);
        })
        .catch((err) => {
          console.log(err);
          setShowLoader(false);
        });
      setShowLoader(false);
    } else {
      fetchUsers();
    }
    if (teamid !== "") setTeamName(teamid);
    setSurname(keyword);
  };

  useEffect(() => {
    fetchUsers();
    fetchTeams();
  }, []);

  const paginate = (number) => {
    setCurrentPage(number);
  };

  const onClear = () => {
    teamRef.current.inputNode.value = "";
    teamRef.current.clear();
    setTeamName("");
    filterUsers();
  };
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  return (
    <div className="user-list-container">
      <div className="search-bar">
        <input
          ref={surnameRef}
          type="search"
          className="search-input"
          placeholder="Wyszukaj nazwisko..."
          value={surname}
          onChange={filterUsers}
        />
        {teams && teams.length > 0 ? (
          <Fragment>
            <Form.Group>
              <Typeahead
                className="team-select-container"
                ref={teamRef}
                id="basic-typeahead-single"
                onChange={filterUsers}
                highlightOnlyResult={true}
                options={teams.map((team) => team.team_name)}
                defaultInputValue={teamName !== 0 ? teamName : ""}
                placeholder="Wybierz team..."
              >
                <Button variant="danger" onClick={onClear}>
                  X
                </Button>
              </Typeahead>
            </Form.Group>
          </Fragment>
        ) : (
          ""
        )}
        <Link
          to="/userform"
          state={{
            user: {
              user_id: null,
            },
          }}
        >
          <Button variant="success">Dodaj nowego użytkownika</Button>
        </Link>
      </div>
      <ListGroup as="ol" className="user-list" variant="flush">
        <ListGroup.Item as="li" variant="success" className="user-item-list">
          <span className="user-item-id">ID</span>
          <span className="user-item">Imię</span>
          <span className="user-item">Nazwisko</span>
          <span className="user-item">Team</span>
          <span className="user-item">Stworzony</span>
          <span className="user-item">Edytowany</span>
        </ListGroup.Item>
        {user_detail && user_detail.length > 0 ? (
          <>
            <UserListPagination
              users_detail={user_detail.slice(
                indexOfFirstPost,
                indexOfLastPost
              )}
              showLoader={showLoader}
              fetchUsers={fetchUsers}
            />
            <Pagination
              postsPerPage={postsPerPage}
              totalPosts={user_detail.length}
              paginate={paginate}
              currentPage={currentPage}
            />
          </>
        ) : (
          <div>
            {showLoader ? (
              <Spinner
                animation="border"
                variant="success"
                className="spin-user-load"
                style={{ width: "8rem", height: "8rem" }}
              >
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            ) : (
              <Alert variant="danger" className="no-results-text">
                <Alert.Heading>Brak wyników!</Alert.Heading>
              </Alert>
            )}
          </div>
        )}
      </ListGroup>
    </div>
  );
}
