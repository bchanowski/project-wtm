import "bootstrap/dist/css/bootstrap.min.css";
import Col from "react-bootstrap/Col";

import classes from "./shiftsCalendar.module.css";

import WeekdaysBar from "./WeekdaysBar";
import TopPanelOfCalendar from "./TopPanelOfCalendar";
import MonthDaysContainer from "./MonthDaysContainer";
import ErrorAlertWithRetry from "../../../common/UI/ErrorAlertWithRetry";

const CalendarView = ({
  displayedDate,
  updateDisplayedDate,
  shifts,
  previewShift,
  requestStatus,
  requestError,
  resetHookState,
}) => {
  return (
    <div
      className={`${classes["calendarRight-container"]} col-12 col-xl-9 order-1 order-xl-2`}
    >
      <TopPanelOfCalendar
        {...{
          displayedDate,
          updateDisplayedDate,
        }}
      />
      <WeekdaysBar />
      {!requestError && (
        <MonthDaysContainer
          {...{
            displayedDate,
            shifts,
            previewShift,
            requestStatus,
            requestError,
          }}
        />
      )}
      {!!requestError && requestStatus === "completed" && (
        <div className={classes["error-msg-container"]}>
          <ErrorAlertWithRetry
            requestError={requestError}
            retryRequest={resetHookState}
          />
        </div>
      )}
    </div>
  );
};

export default CalendarView;
