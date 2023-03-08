import classes from "./shiftsCalendar.module.css";

const MonthDays = ({ monthDays, shifts, previewShift }) => {
  return monthDays.map((monthDay, index) => {
    let content = "";
    let assignedShiftId;
    if (monthDay !== "") {
      content = monthDay?.getDate();

      const day = monthDay.getDate();
      const month = monthDay.getMonth();
      const year = monthDay.getFullYear();
      // check if day has a shift
      const foundShift = shifts.find(({ shift_days }) =>
        shift_days.find(
          (shiftDay) =>
            shiftDay.getDate() === day &&
            shiftDay.getMonth() === month &&
            shiftDay.getFullYear() === year
        )
      );
      if (foundShift) assignedShiftId = foundShift.service_id;
    }
    const datasetValue = !!assignedShiftId ? assignedShiftId : "";
    const monthDayClass = datasetValue ? "day-withShift" : "day-withoutShift";
    return (
      <div key={index} className={`${classes["month_day"]}`}>
        <div
          onClick={previewShift}
          data-shiftid={datasetValue}
          data-month_day={monthDay}
          className={`${classes["month_day-value"]} ${classes[monthDayClass]}`}
        >
          {content}
        </div>
      </div>
    );
  });
};

export default MonthDays;
