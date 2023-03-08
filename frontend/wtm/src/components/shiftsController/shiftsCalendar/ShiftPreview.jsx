import classes from "./shiftsCalendar.module.css";

import { convertDate } from "../../../shared/helpers";

function ShiftPreview({ selectedShift }) {
  const startDate = convertDate(selectedShift.start_date);
  const endDate = convertDate(selectedShift.end_date);

  return (
    <div className={`${classes["shiftInformation-main"]}`}>
      <div className={`${classes["shiftInformation-team-container"]}`}>
        <span>ZESPÓŁ</span>
        <h6>{selectedShift?.team_id?.team_name}</h6>
      </div>
      <div className={`${classes["shiftInformation-dateRange-container"]}`}>
        <div className={`${classes["shiftInformation-dateRange-startDate"]}`}>
          <span>POCZĄTEK</span>
          <h6>{`${startDate[0]}-${startDate[1]}-${startDate[2]}`}</h6>
        </div>
        <div className={`${classes["shiftInformation-dateRange-endDate"]}`}>
          <span>KONIEC</span>
          <h6>{`${endDate[0]}-${endDate[1]}-${endDate[2]}`}</h6>
        </div>
      </div>
    </div>
  );
}

export default ShiftPreview;
