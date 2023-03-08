import classes from "./shiftsCalendar.module.css";

import { AiFillCaretLeft } from "react-icons/ai";
import { AiFillCaretRight } from "react-icons/ai";

function TopPanelOfCalendar({ displayedDate, updateDisplayedDate }) {
  const currentMonthAndYear = `${displayedDate.toLocaleString("pl", {
    month: "long",
  })} ${displayedDate.getFullYear()}`;

  const changeMonth = (addMonth = true) => {
    let value = 1;
    if (!addMonth) value = -1;
    const newDate = displayedDate.setMonth(displayedDate.getMonth() + value);
    updateDisplayedDate(new Date(newDate));
  };

  return (
    <div className={`${classes["calendarRight-topBar"]}`}>
      <button
        onClick={() => changeMonth(false)}
        className={`${classes["topBar-btn"]}`}
      >
        <AiFillCaretLeft />
      </button>
      <button className={`${classes["topBar-currentDate"]}`}>
        {currentMonthAndYear}
      </button>
      <button onClick={changeMonth} className={`${classes["topBar-btn"]}`}>
        <AiFillCaretRight />
      </button>
    </div>
  );
}

export default TopPanelOfCalendar;
