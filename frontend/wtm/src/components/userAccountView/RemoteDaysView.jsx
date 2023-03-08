import { RemoteDaysSkeleton } from "./RemoteDaysSkeleton";
import classes from "./UserAccountView.module.css";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";

import ErrorAlertWithRetry from "../../common/UI/ErrorAlertWithRetry";
import FilterDatesController from "./FilterDatesController";

import usePagination from "../../shared/paginationHook";
import PaginationComponent from "../shiftsController/shiftsTable/PaginationComponent";
import { Fragment } from "react";

export function RemoteDaysView({
  remoteDays,
  openRemoteDayForm,
  openDeleteWorkTimeForm,
  setRemoteDays,
  requestStatus,
  requestError,
  resetHookState,
  userId,
}) {
  const { movePage, pageElements, currentPage, numberOfPages } = usePagination(
    remoteDays,
    4
  );

  const initRemoteDayForm = (e) => {
    const dayToEdit = getClickedRemoteDay(e);
    openRemoteDayForm(dayToEdit, "PATCH");
  };

  const initDeleteRemoteDayModal = (e) => {
    const dayToDelete = getClickedRemoteDay(e);
    openDeleteWorkTimeForm(
      dayToDelete?.homeoffice_id,
      "homeOffice/userAccount",
      "Potwierdź usunięcie dnia zdalnego",
      setRemoteDays
    );
  };

  const getClickedRemoteDay = (e) => {
    const clickedRemoteDayId = e.target.closest("td").dataset?.id;
    if (!clickedRemoteDayId) return console.log("no id");
    const dayToEdit = remoteDays.find(
      (day) => +day.homeoffice_id === +clickedRemoteDayId
    );
    if (!dayToEdit) return console.log("found no day");
    return dayToEdit;
  };

  let content = <RemoteDaysSkeleton />;

  if (!remoteDays?.length && !requestError && requestStatus === "completed") {
    content = (
      <div className={`${classes["no-remoteDays-message"]}`}>
        <p>Brak dni zdalnych</p>
      </div>
    );
  }

  if (!!requestError && requestStatus === "completed") {
    content = (
      <ErrorAlertWithRetry
        requestError={requestError}
        retryRequest={resetHookState}
      />
    );
  }

  if (
    !!remoteDays?.length &&
    !!pageElements?.length &&
    requestStatus === "completed" &&
    !requestError
  ) {
    content = (
      <Table>
        <thead>
          <tr>
            <th>#</th>
            <th>Dzień zdalny</th>
            <th>Zarządzaj</th>
          </tr>
        </thead>
        <tbody>
          {pageElements.map((remoteDay, index) => {
            const lastMillisecondOfCurrentDayTimestamp = new Date().setHours(
              23,
              59,
              59,
              999
            );

            const dateFromRemoteDay = new Date(remoteDay.date).setHours(0);

            const displayOperationBtns =
              lastMillisecondOfCurrentDayTimestamp < dateFromRemoteDay;

            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{remoteDay?.date}</td>
                <td
                  data-id={remoteDay?.homeoffice_id}
                  className={`${classes["rowCell"]} d-flex gap-2`}
                >
                  {!!displayOperationBtns && (
                    <Fragment>
                      <Button
                        onClick={initRemoteDayForm}
                        variant="warning"
                        className="p-1 fs-6"
                      >
                        Edytuj
                      </Button>
                      <Button
                        onClick={initDeleteRemoteDayModal}
                        variant="danger"
                        className="p-1 fs-6"
                      >
                        Usuń
                      </Button>
                    </Fragment>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
  }

  return (
    <div className={classes["remoteDays-container"]}>
      <div className={classes["remoteDays-header"]}>
        <h2>Dni zdalne</h2>
      </div>
      <FilterDatesController
        endPoint={"homeOffice/filterRemoteDays"}
        userId={userId}
        setData={setRemoteDays}
        lastFilteredDay={new Date(new Date().setDate(new Date().getDate() + 5))}
      />
      <div className={classes["table-container"]}>{content}</div>
      {requestStatus === "completed" && !!remoteDays?.length && (
        <PaginationComponent
          movePage={movePage}
          currentPage={currentPage}
          numberOfPages={numberOfPages}
        />
      )}
    </div>
  );
}
