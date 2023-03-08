import { Fragment, useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import AppContext from "../../shared/context/app-context";
import classes from "./Navigation.module.css";

const Navigation = () => {
  const navLinkClasses = `${classes["navLink"]}  ${classes["active"]} ${classes["nav-list"]}`;

  const { token, logout, role } = useContext(AppContext);

  return (
    <nav>
      <ul className={classes["nav-list"]}>
        {!!token && role === "ADMIN" && (
          <Fragment>
            <li>
              <NavLink
                to={"/shifts"}
                className={({ isActive }) =>
                  !!isActive ? navLinkClasses : classes["navLink"]
                }
              >
                Dyżury
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"/users"}
                className={({ isActive }) =>
                  !!isActive ? navLinkClasses : classes["navLink"]
                }
              >
                Użytkownicy
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"/teams"}
                className={({ isActive }) =>
                  !!isActive ? navLinkClasses : classes["navLink"]
                }
              >
                Zespoły
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"/homeoffice"}
                className={({ isActive }) =>
                  !!isActive ? navLinkClasses : classes["navLink"]
                }
              >
                Dni zdalne
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"/czaspracy"}
                className={({ isActive }) =>
                  !!isActive ? navLinkClasses : classes["navLink"]
                }
              >
                Czas pracy
              </NavLink>
            </li>
          </Fragment>
        )}

        {!!token && role === "USER" && (
          <li>
            <NavLink
              to={"/user_account"}
              className={({ isActive }) =>
                !!isActive ? navLinkClasses : classes["navLink"]
              }
            >
              Profil Użytkownika
            </NavLink>
          </li>
        )}
      </ul>

      {!token && (
        <Link className={classes["login-btn"]} to="/login">
          Logowanie
        </Link>
      )}
      {!!token && (
        <Link onClick={logout} className={classes["login-btn"]} to="/login">
          Wyloguj się
        </Link>
      )}
    </nav>
  );
};

export default Navigation;
