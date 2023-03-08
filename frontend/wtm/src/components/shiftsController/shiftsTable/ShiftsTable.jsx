import "bootstrap/dist/css/bootstrap.min.css";
import Table from "react-bootstrap/Table";
import Col from "react-bootstrap/Col";

import classes from "./ShiftsTable.module.css";
import TableSkeleton from "./TableSkeleton";
import PaginationComponent from "./PaginationComponent";
import ErrorAlertWithRetry from "../../../common/UI/ErrorAlertWithRetry";

import { convertDate } from "../../../shared/helpers";

import { AiFillDelete, AiOutlineDownload } from "react-icons/ai";
import { AiFillSetting } from "react-icons/ai";
import usePagination from "../../../shared/paginationHook";
import jsPDF from "jspdf";

function ShiftsTable({
  shifts,
  editShift,
  setSelectedShift,
  openDeleteModal,
  setDisplayedDate,
  setClickedDay,
  openForm,
  requestError,
  requestStatus,
  resetHookState,
}) {
  const { movePage, pageElements, currentPage, numberOfPages } = usePagination(
    shifts,
    5
  );

  const getClickedShift = (e) => {
    const clickedShiftId = e.target.closest("tr").dataset.id;
    if (!clickedShiftId) return;
    const shift = shifts.find(
      ({ service_id }) => +service_id === +clickedShiftId
    );
    if (!shift) return;
    return shift;
  };

  const openEditingShiftForm = (e) => {
    const shift = getClickedShift(e);
    if (!shift) return;
    editShift(shift);
  };

  const openDeleteShiftModal = (e) => {
    const shift = getClickedShift(e);
    if (!shift) return;
    setSelectedShift(shift);
    openDeleteModal();
  };

  const setCurrentDate = (e) => {
    if (e.target.tagName === "BUTTON") return;
    const shift = getClickedShift(e);
    if (!shift) return;
    setClickedDay(new Date(shift.start_date));
    setDisplayedDate(new Date(shift.start_date));
    setSelectedShift(shift);
  };

  const generateShiftsPdf = () => {
    var doc = new jsPDF("landscape", "px", "a4", "false");
    doc.setFontSize(25);
    doc.text(70, 30, "Nadchodzace dyzury");
    doc.setFontSize(12);
    shifts.map((shift, index) =>
      doc.text(
        70,
        45 + index * 10,
        index +
          1 +
          ". Od " +
          shift.start_date.slice(0, 10) +
          " Do " +
          shift.end_date.slice(0, 10) +
          " - " +
          shift.team_id.team_name
      )
    );
    doc.save("nadchodzace_dyzury.pdf");
  };

  return (
    <Col>
      <div
        className={`${classes["addBtn-wrapper"]} d-flex pb-2 justify-content-center`}
      >
        {!requestError && requestStatus === "completed" && (
          <>
            <button
              onClick={openForm}
              className={`${classes["addShift-tableBtn"]}`}
            >
              +
            </button>
            <button
              onClick={generateShiftsPdf}
              className={`${classes["addShift-tableBtn"]}`}
            >
              <AiOutlineDownload />
            </button>
          </>
        )}
      </div>

      <div className={classes["shifts-container"]}>
        <div className={classes["table-wrapper"]}>
          <Table className={classes["shifts-table"]}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Zespół</th>
                <th>Początek dyżuru</th>
                <th>Koniec dyżuru</th>
                <th>Zarządzaj</th>
              </tr>
            </thead>
            <tbody>
              {!requestError &&
                requestStatus === "completed" &&
                !!pageElements?.length &&
                pageElements.map((shift, index) => {
                  const startDateList = convertDate(shift.start_date);
                  const endDateList = convertDate(shift.end_date);

                  return (
                    <tr
                      key={index}
                      data-id={shift.service_id}
                      onClick={setCurrentDate}
                      className={classes["table-row"]}
                    >
                      <td>{shift.service_id}</td>
                      <td>{shift.team_id.team_name}</td>
                      <td>{`${startDateList[0]}-${startDateList[1]}-${startDateList[2]}`}</td>
                      <td>{`${endDateList[0]}-${endDateList[1]}-${endDateList[2]}`}</td>
                      <td>
                        <button
                          onClick={openEditingShiftForm}
                          className={`${classes["manageShift-btn"]} ${classes["editShift-btn"]}`}
                        >
                          <AiFillSetting />
                        </button>

                        <button
                          onClick={openDeleteShiftModal}
                          className={`${classes["manageShift-btn"]} ${classes["deleteShift-btn"]}`}
                        >
                          <AiFillDelete />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              {!requestError && requestStatus === "loading" && (
                <TableSkeleton />
              )}
            </tbody>
          </Table>
          {!requestError &&
            requestStatus === "completed" &&
            !pageElements?.length && <p>Brak dyżurów</p>}

          {!!requestError && requestStatus === "completed" && (
            <div className={classes["error-msg-container"]}>
              <ErrorAlertWithRetry
                requestError={requestError}
                retryRequest={resetHookState}
              />
            </div>
          )}
        </div>
        {numberOfPages !== null &&
          !requestError &&
          requestStatus === "completed" && (
            <PaginationComponent
              movePage={movePage}
              currentPage={currentPage}
              numberOfPages={numberOfPages}
            />
          )}
      </div>
    </Col>
  );
}
export default ShiftsTable;
