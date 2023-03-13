import Skeleton from "react-loading-skeleton";
import { Link } from "react-router-dom";
import ErrorAlertWithRetry from "../../common/UI/ErrorAlertWithRetry";
import classes from "./UserAccountView.module.css";

export function PersonalDataView({
  userAccount,
  requestStatus,
  requestError,
  resetHookState,
}) {
  return (
    <div className={classes["userData-container"]}>
      <div className={classes["headerAndButton-container"]}>
        <h2>Dane Osobowe</h2>
        {!!userAccount && requestStatus === "completed" && !requestError && (
          <Link
            className="btn btn-light"
            state={{
              ...userAccount,
              user_id: {
                email: userAccount?.email,
                user_id: userAccount?.user_id,
              },
            }}
            to="/userForm"
          >
            Edytuj
          </Link>
        )}
      </div>
      {!requestError && requestStatus === "completed" && (
        <div className={classes["userData-wrapper"]}>
          <div className={classes["userData-field"]}>
            <span>Imię</span> {userAccount?.name}
          </div>
          <div className={classes["userData-field"]}>
            <span>Nazwisko</span>
            {userAccount?.surname}
          </div>
          <div className={classes["userData-field"]}>
            <span>Email</span>
            {userAccount?.email}
          </div>
          <div className={classes["userData-field"]}>
            <span>Numer telefonu</span>
            {userAccount?.phone_number}
          </div>
          <div className={classes["userData-field"]}>
            <span>Zespół</span>
            {userAccount?.team_id_fk?.team_name || ""}
          </div>
        </div>
      )}

      {requestStatus === "loading" && (
        <div className={classes["userData-wrapper"]}>
          <div className={classes["userData-field"]}>
            <span>Imię</span> {<Skeleton height="2rem" />}
          </div>
          <div className={classes["userData-field"]}>
            <span>Nazwisko</span>
            {<Skeleton height="2rem" />}
          </div>
          <div className={classes["userData-field"]}>
            <span>Email</span>
            {<Skeleton height="2rem" />}
          </div>
          <div className={classes["userData-field"]}>
            <span>Numer telefonu</span>
            {<Skeleton height="2rem" />}
          </div>
          <div className={classes["userData-field"]}>
            <span>Zespół</span>
            {<Skeleton height="2rem" />}
          </div>
        </div>
      )}

      {!userAccount && requestStatus === "completed" && !!requestError && (
        <ErrorAlertWithRetry
          requestError={requestError}
          retryRequest={resetHookState}
        />
      )}
    </div>
  );
}
