import "bootstrap/dist/css/bootstrap.min.css";

import classes from "./shiftsCalendar.module.css";

import ShiftPreview from "./ShiftPreview";
import CenteredSpinner from "../../../common/UI/CenteredSpinner";

const SelectedShiftView = ({
  selectedShift,
  clickedDay,
  editShift,
  requestStatus,
  requestError,
  openDeleteModal,
  openForm,
}) => {
  const month = clickedDay.toLocaleString("pl", {
    month: "long",
  });
  const day = clickedDay.getDate();
  const year = clickedDay.getFullYear();
  const selectedDate = `${day} ${month.toUpperCase()} ${year}`;

  return (
    <div className="bg-dark position-relative col-12 col-xl-3 order-2 order-xl-1">
      {!requestError && requestStatus === "completed" && (
        <div className={`${classes["calendarLeft-container"]}`}>
          <div className={`${classes["calendarLeft-header-container"]}`}>
            <h4>Szczegóły</h4>
          </div>
          <div className={`${classes["manageShift-container"]}`}>
            {!!selectedShift && (
              <button
                onClick={editShift}
                className={`${classes["manageShift-btn"]} ${classes["editShift-btn"]}`}
              >
                Edytuj
              </button>
            )}

            {!!selectedShift && (
              <button
                onClick={openDeleteModal}
                className={`${classes["manageShift-btn"]} ${classes["deleteShift-btn"]}`}
              >
                Usuń
              </button>
            )}
            {!selectedShift && (
              <button
                onClick={openForm}
                className={`${classes["manageShift-btn"]} ${classes["addShiftBtn"]}`}
              >
                Dodaj dyżur
              </button>
            )}
          </div>

          <div className={`${classes["shiftInformation-container"]}`}>
            {!requestError && (
              <div className={`${classes["shiftInformation-header"]}`}>
                <span>wybrany dzień</span>
                <h5>{selectedDate}</h5>
              </div>
            )}

            {!!selectedShift && <ShiftPreview selectedShift={selectedShift} />}
            {!selectedShift && (
              <div className={`${classes["noShift-container"]}`}>
                <h6>W wybranym dniu nie ma dyżuru</h6>
              </div>
            )}
          </div>
        </div>
      )}
      {!requestError && requestStatus === "loading" && <CenteredSpinner />}
    </div>
  );
};

export default SelectedShiftView;
