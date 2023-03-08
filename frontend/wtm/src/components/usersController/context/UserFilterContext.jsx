import { useState, createContext } from "react";

const UserContext = createContext();

const UserProvider = (props) => {
  const [surname, setSurname] = useState("");
  const [teamName, setTeamName] = useState("");

  return (
    <UserContext.Provider
      value={{ surname, setSurname, teamName, setTeamName }}
    >
      {props.children}
    </UserContext.Provider>
  );
};
export { UserContext, UserProvider };
