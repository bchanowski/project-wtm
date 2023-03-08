import { useCallback, useState } from "react";
import { Button, ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import ModalDeleteUser from "./ModalDeleteUser";
import "./UsersList.css";

export default function UserListPagination({ users_detail, fetchUsers }) {
  const [show, setShow] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const [deleteUserId, setDeleteUserId] = useState();
  const handleShow = useCallback(
    (id, detail_id) => () => {
      setDeleteId(detail_id);
      setDeleteUserId(id);
      setShow(true);
    },
    []
  );
  return (
    <div className="user-list-pagination">
      {users_detail.map((user, index) => (
        <ListGroup.Item
          as="li"
          variant="light"
          className="user-item-list"
          key={index}
        >
          <span className="user-item-id">{user.user_id.user_id}.</span>
          <span className="user-item">{user.name}</span>
          <span className="user-item">{user.surname}</span>
          <span className="user-item">
            {user.team_id !== null ? user.team_id.team_name : "Brak"}
          </span>
          <span className="user-item">
            {user.created_at.slice(0, 10)} {user.created_at.slice(11, 16)}
          </span>
          <span className="user-item">
            {user.edited_at.slice(0, 10)} {user.edited_at.slice(11, 16)}
          </span>
          <span>
            <Link to="/userform" state={user}>
              <Button variant="outline-primary" className="btn-list">
                Edytuj
              </Button>
            </Link>
          </span>
          <span>
            <Button
              variant="outline-danger"
              className="btn-list"
              onClick={handleShow(user.user_id.user_id, user.user_detail_id)}
            >
              Usuń
            </Button>
          </span>
        </ListGroup.Item>
      ))}
      <ModalDeleteUser
        show={show}
        onHide={() => {
          setShow(false);
          fetchUsers();
        }}
        deleteId={deleteId}
        deleteUserId={deleteUserId}
      />
    </div>
  );
}
