import { useContext, useEffect, useState } from "react";
import useHttp from "../../../shared/useHttp";

import Form from "react-bootstrap/Form";
import AppContext from "../../../shared/context/app-context";

const RenderOptions = (props) => {
  const { requestStatus, requestError, sendRequest } = useHttp();
  const [teamNames, setTeamNames] = useState([]);

  const { token } = useContext(AppContext);

  const getTeamNames = async () => {
    try {
      const responseData = await sendRequest(
        "http://localhost:5000/api/teams/all",
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      if (!responseData) throw "";

      setTeamNames(responseData);
    } catch (err) {}
  };

  useEffect(() => {
    if (!requestError && !requestStatus) getTeamNames();
  }, [requestStatus, requestError]);

  if (!requestError && requestStatus === "completed") {
    return (
      <Form.Select {...props}>
        <option value=""></option>
        {teamNames.map((element, index) => (
          <option key={index} value={element.team_id}>
            {element.team_name}
          </option>
        ))}
      </Form.Select>
    );
  }
};

export default RenderOptions;
