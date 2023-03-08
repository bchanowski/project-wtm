import "bootstrap/dist/css/bootstrap.min.css";

import classes from "./shiftsCalendar.module.css";

import SelectedShiftView from "./SelectedShiftView";
import CalendarView from "./CalendarView";
import { Col } from "react-bootstrap";

const ShiftsCalendar = ({
  displayedDate,
  updateDisplayedDate,
  shifts,
  previewShift,
  selectedShift,
  clickedDay,
  editShift,
  requestStatus,
  requestError,
  resetHookState,
  openDeleteModal,
  openForm,
}) => {
  return (
    <Col lg={12} xl={12} xxl={8}>
      <div
        className={`${classes["calendar-container"]} d-flex flex-column flex-xl-row col-12 `}
      >
        <SelectedShiftView
          {...{
            selectedShift,
            clickedDay,
            editShift,
            requestStatus,
            requestError,
            shifts,
            openDeleteModal,
            openForm,
          }}
        />

        <CalendarView
          {...{
            displayedDate,
            updateDisplayedDate,
            shifts,
            previewShift,
            requestStatus,
            requestError,
            resetHookState,
          }}
        />
      </div>
    </Col>
  );
};

export default ShiftsCalendar;
