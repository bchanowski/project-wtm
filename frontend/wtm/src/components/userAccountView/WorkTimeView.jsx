import { WorkTimeTableSkeleton } from "./WorkTimeTableSkeleton";
import classes from "./UserAccountView.module.css";
import Table from "react-bootstrap/Table";
import { Button } from "react-bootstrap";

import FilterDatesController from "./FilterDatesController";
import ErrorAlertWithRetry from "../../common/UI/ErrorAlertWithRetry";
import PaginationComponent from "../shiftsController/shiftsTable/PaginationComponent";

import usePagination from "../../shared/paginationHook";
import { useRef } from "react";

export function WorkTimeView({
  workTimeMessages,
  editWorkTimeMessage,
  setWorkTimeMessages,
  openDeleteWorkTimeModal,
  userId,
  requestStatus,
  requestError,
  resetHookState,
}) {
  const { movePage, pageElements, currentPage, numberOfPages } = usePagination(
    workTimeMessages,
    4
  );
  let fullWorkTime = useRef();
  fullWorkTime.current = 0;
  const initEditWorkTimeForm = (e) => {
    const dayToEdit = getClickedWorkTimeMsg(e);
    editWorkTimeMessage(dayToEdit, "PATCH");
  };

  const initDeleteWorkTimeModal = (e) => {
    const dayToEdit = getClickedWorkTimeMsg(e);
    openDeleteWorkTimeModal(
      dayToEdit?.work_time_id,
      "work-time/userAccount",
      "Potwierdź usunięcie statusu",
      setWorkTimeMessages
    );
  };

  const getClickedWorkTimeMsg = (e) => {
    const clickedWorkTimeMessageId = e.target.closest("td").dataset?.id;
    if (!clickedWorkTimeMessageId) return console.log("no id");
    const dayToEdit = workTimeMessages.find(
      (day) => +day.work_time_id === +clickedWorkTimeMessageId
    );
    if (!dayToEdit) return console.log("found no message");
    return dayToEdit;
  };

  let content = <WorkTimeTableSkeleton />;

  if (
    !!workTimeMessages?.length &&
    !!pageElements?.length &&
    requestStatus === "completed" &&
    !requestError
  ) {
    content = (
      <Table>
        <thead>
          <tr>
            <th>Data wysłania</th>
            <th>Data edycji</th>
            <th>Treść</th>
            <th>Zarządzaj</th>
          </tr>
        </thead>
        <tbody>
          {pageElements.map(
            (
              {
                message_sent_at,
                edited_at,
                work_time_id,
                full_work_time,
                message,
              },
              index
            ) => {
              const getDateHourMinuteFromDbDateString = (dateString) => {
                // dateString looks like: 2022-08-25T10:49:40.873Z
                return dateString.slice(0, 10) + " " + dateString.slice(11, 16);
                // example returned string: 2022-08-25 10:49
              };
              fullWorkTime.current = fullWorkTime.current + full_work_time;

              const formated_msgSentAt =
                getDateHourMinuteFromDbDateString(message_sent_at);

              let editedAt = "-";

              if (message_sent_at !== edited_at) {
                editedAt = getDateHourMinuteFromDbDateString(edited_at);
              }

              return (
                <tr key={index}>
                  <td>{formated_msgSentAt}</td>
                  <td>{editedAt}</td>
                  <td>{message}</td>
                  <td data-id={work_time_id} className="d-flex gap-2">
                    <Button
                      onClick={initEditWorkTimeForm}
                      variant="warning"
                      className="p-1 fs-6"
                    >
                      Edytuj
                    </Button>
                    <Button
                      onClick={initDeleteWorkTimeModal}
                      variant="danger"
                      className="p-1 fs-6"
                    >
                      Usuń
                    </Button>
                  </td>
                </tr>
              );
            }
          )}
        </tbody>
      </Table>
    );
  }

  if (
    !requestError &&
    requestStatus === "completed" &&
    !workTimeMessages?.length
  ) {
    content = (
      <div className={`${classes["no-remoteDays-message"]}`}>
        <p>Brak wiadomości</p>
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

  return (
    <div className={classes["workTime-container"]}>
      <div className={classes["workTime-header"]}>
        <h2>Czas pracy</h2>
      </div>
      <FilterDatesController
        endPoint={"work-time/filterWorkTime"}
        userId={userId}
        setData={setWorkTimeMessages}
      />
      <div>
        <h3>
          {fullWorkTime.current > 0
            ? "Czas przepracowany:" +
              new Date(fullWorkTime.current).toISOString().slice(11, 16)
            : ""}
        </h3>
      </div>
      <div className={classes["table-container"]}>{content}</div>
      {requestStatus === "completed" && !!workTimeMessages?.length && (
        <PaginationComponent
          movePage={movePage}
          currentPage={currentPage}
          numberOfPages={numberOfPages}
        />
      )}
    </div>
  );
}
