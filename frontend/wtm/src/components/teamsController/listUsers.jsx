import { Table } from "react-bootstrap";
import EmptyTeam from "./EmptyTeam";

function ListTeam(props) {
  const data = props.data;
  return (
    <div>
      {data.length === 0 ? (
        <EmptyTeam></EmptyTeam>
      ) : (
        <Table className="mx-auto mt-4 lg" striped bordered hover size="xl">
          <thead>
            <tr>
              <th>ID</th>
              <th>Imię</th>
              <th>Nazwisko </th>
              <th>Numer Telefonu</th>
              <th>E-mail</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0
              ? data.map((value, key) => {
                  return (
                    <tr key={key}>
                      <td>{value.user_detail_id}</td>
                      <td>{value.name}</td>
                      <td>{value.surname}</td>
                      <td>{value.phone_number}</td>
                      <td>{value.user_id.email}</td>
                    </tr>
                  );
                })
              : null}
          </tbody>
        </Table>
      )}
    </div>
  );
}
export default ListTeam;
