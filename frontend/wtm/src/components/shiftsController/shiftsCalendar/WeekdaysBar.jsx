import classes from "./shiftsCalendar.module.css";

function WeekdaysBar() {
  return (
    <div className={`${classes["main-calendar-container"]}`}>
      <div className={`${classes["weekdays-container"]}`}>
        <div className={`${classes["weekday-abbr"]}`}>PN</div>
        <div className={`${classes["weekday-abbr"]}`}>WT</div>
        <div className={`${classes["weekday-abbr"]}`}>ŚR</div>
        <div className={`${classes["weekday-abbr"]}`}>CZ</div>
        <div className={`${classes["weekday-abbr"]}`}>PT</div>
        <div className={`${classes["weekday-abbr"]}`}>SB</div>
        <div className={`${classes["weekday-abbr"]}`}>ND</div>
      </div>
    </div>
  );
}

export default WeekdaysBar;
