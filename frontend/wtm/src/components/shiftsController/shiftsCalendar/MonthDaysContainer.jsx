import MonthDays from "./MonthDays";
import classes from "./shiftsCalendar.module.css";
import SkeletonMonthDays from "./SkeletonMonthDays";

function MonthDaysContainer({
  displayedDate,
  shifts,
  previewShift,
  requestStatus,
  requestError,
}) {
  let content;

  // list of empty strings if the first day of the month is not a monday and every day of the month (by default it is a current month)
  const monthDays = getAllDaysInMonth(
    displayedDate.getFullYear(),
    displayedDate.getMonth()
  );

  function getAllDaysInMonth(year, month) {
    const date = new Date(year, month, 1);
    const dates = [];
    while (date.getMonth() === month) {
      const currentWeekday = date.toLocaleString("pl", {
        weekday: "long",
      });

      // check first day of the month
      if (date.getDate() === 1 && currentWeekday !== "poniedziałek") {
        const emptyElements = createArrayWithEmptyStrings(currentWeekday);
        dates.push(...emptyElements);
      }

      dates.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return dates;
  }

  function createArrayWithEmptyStrings(currentWeekday) {
    const numberOfEmptyElements = countEmptyElements(currentWeekday);
    return Array.from(new Array(numberOfEmptyElements), () => "");
  }

  function countEmptyElements(weekday) {
    let numberOfEmptyElements;
    switch (weekday) {
      case "wtorek":
        numberOfEmptyElements = 1;
        break;
      case "środa":
        numberOfEmptyElements = 2;
        break;
      case "czwartek":
        numberOfEmptyElements = 3;
        break;
      case "piątek":
        numberOfEmptyElements = 4;
        break;
      case "sobota":
        numberOfEmptyElements = 5;
        break;
      case "niedziela":
        numberOfEmptyElements = 6;
        break;
      default:
        numberOfEmptyElements = 0;
    }
    return numberOfEmptyElements;
  }

  content = <SkeletonMonthDays />;

  if (!!shifts && !requestError && requestStatus === "completed") {
    content = (
      <MonthDays
        monthDays={monthDays}
        shifts={shifts}
        previewShift={previewShift}
      />
    );
  }

  return <div className={`${classes["monthDays-container"]}`}>{content}</div>;
}

export default MonthDaysContainer;
