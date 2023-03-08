import classes from "./ShiftsTable.module.css";

import { AiOutlineCaretRight } from "react-icons/ai";
import { AiOutlineCaretLeft } from "react-icons/ai";

const PaginationComponent = ({ numberOfPages, currentPage, movePage }) => {
  const changeCurrentPage = (e) => {
    const enteredNumber = +e.target.value;
    if (enteredNumber > numberOfPages) return;
    if (enteredNumber <= 0) return;
    if (enteredNumber === currentPage) return;
    movePage(enteredNumber, false);
  };

  return (
    <div
      className={`${classes["pagination-wrapper"]} d-flex justify-content-around  mt-4`}
    >
      <div className={classes["pagination-element"]}>
        {currentPage !== 1 && (
          <button
            title="Poprzednia strona"
            className={classes["pagination-btn"]}
            onClick={() => movePage(-1)}
          >
            <AiOutlineCaretLeft />
          </button>
        )}
      </div>
      <div className={`${classes["pagination-element"]} `}>
        <div
          title="Aktualna strona"
          className={`${classes["pagination-element-content"]}`}
        >
          {currentPage}
        </div>
      </div>

      <div className={classes["pagination-goTo-input"]}>
        <input
          title="Przejdź do strony"
          onChange={changeCurrentPage}
          type="number"
          step="1"
          min="1"
          max={numberOfPages}
        />
      </div>

      <div className={classes["pagination-element"]}>
        <div
          onClick={() => movePage(numberOfPages, false)}
          title="Ostatnia strona"
          className={`${classes["pagination-element-content"]}`}
        >
          {numberOfPages}
        </div>
      </div>

      <div title="Ostatnia strona" className={classes["pagination-element"]}>
        {currentPage !== numberOfPages && (
          <button
            title="Następna strona"
            className={classes["pagination-btn"]}
            onClick={() => movePage(1)}
          >
            <AiOutlineCaretRight />
          </button>
        )}
      </div>
    </div>
  );
};

export default PaginationComponent;
