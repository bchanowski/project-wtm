import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import classes from "./shiftsCalendar.module.css";

const SkeletonMonthDays = () => {
  return Array.from(new Array(31), () => "").map((e, index) => (
    <div key={index} className={`${classes["month_day"]}`}>
      <div className={`${classes["month_day-value"]} `}>
        <Skeleton height="2vw" width="5vw"></Skeleton>
      </div>
    </div>
  ));
};

export default SkeletonMonthDays;
