import { Navigate, Route, Routes } from "react-router-dom";
import Navigation from "./common/NavApp/Navigation";
import UserListController from "./pages/UserListController";
import UserFormController from "./pages/UserFormController";
import ShiftsController from "./pages/ShiftsController";
import UserAccountView from "./pages/UserAccountView";
import LoginController from "./pages/LoginController";

import { Fragment, useContext } from "react";

import AppContext from "./shared/context/app-context";
import { UserProvider } from "./components/usersController/context/UserFilterContext";
import HomeofficeController from "./pages/HomeofficeController";
import WorkTimeController from "./pages/WorkTimeController";
import ManageTeamPanel from "./components/teamsController/ManageTeamPanel";

function App() {
  const { token, role } = useContext(AppContext);

  const adminIsLogged = !!token && role === "ADMIN";
  const userIsLogged = !!token && role === "USER";

  return (
    <Fragment>
      <UserProvider>
        <Navigation />
        <Routes>
          {adminIsLogged && (
            <Fragment>
              <Route path="/shifts" element={<ShiftsController />} />
              <Route path="/users" element={<UserListController />} />
              <Route path="/homeoffice" element={<HomeofficeController />} />
              <Route path="/teams" element={<ManageTeamPanel />} />
              <Route path="/user/:id/*" element={<UserAccountView />} />
              <Route path="/czaspracy" element={<WorkTimeController />} />
            </Fragment>
          )}
          {(adminIsLogged || userIsLogged) && (
            <Route path="/userform" element={<UserFormController />} />
          )}
          {userIsLogged && (
            <Route path="/user_account" element={<UserAccountView />} />
          )}
          <Route path="/login" element={<LoginController />} />
          <Route path="*" element={<Navigate replace to="/login" />} />
        </Routes>
      </UserProvider>
    </Fragment>
  );
}

export default App;
