import "bootstrap/dist/css/bootstrap.min.css";

import ShiftsTable from "../components/shiftsController/shiftsTable/ShiftsTable";
import ShiftsCalendar from "../components/shiftsController/shiftsCalendar/ShiftsCalendar";
import CalendarPageWrapper from "../components/shiftsController/CalendarPageWrapper";
import ControlAddingShift from "../components/shiftsController/forms/ControlAddingShift";
import DeleteController from "../components/shiftsController/forms/DeleteController";

import ModalTemplate from "../common/UI/ModalTemplate";

import { Fragment, useContext, useEffect, useState } from "react";

import useHttp from "../shared/useHttp";

import AppContext from "../shared/context/app-context";

const ShiftsController = () => {
  // modal and form visibility state
  const [addShiftFormVisibility, setAddShiftFormVisibility] = useState(false);
  // this state is responsible for displaying currently chosen month and year
  const [displayedDate, setDisplayedDate] = useState(new Date());
  // this keeps day which is already selected
  const [clickedDay, setClickedDay] = useState(new Date());
  // all shifts from database
  const [shifts, setShifts] = useState([]);

  const [selectedShift, setSelectedShift] = useState(null);

  const [shiftToEdit, setShiftToEdit] = useState(null);
  // this helps to manage whether user is adding shift or editing
  const [operationData, setOperationData] = useState(null);

  const [deleteModal, setDeleteModal] = useState(false);

  const { token } = useContext(AppContext);

  const { requestStatus, requestError, sendRequest, resetHookState } =
    useHttp();

  const closeAddingShiftForm = () => {
    setAddShiftFormVisibility(false);
    clearParentStates();
  };

  const closeDeleteModal = () => {
    setDeleteModal(false);
    clearParentStates();
  };

  const clearParentStates = () => {
    if (!!operationData) {
      resetHookState();
      setSelectedShift(null);
    }
    setOperationData(null);
    setShiftToEdit(null);
  };

  const openAddingShiftForm = () => setAddShiftFormVisibility(true);

  const openDeleteModal = () => setDeleteModal(true);

  const updateDisplayedDate = (date) => setDisplayedDate(date);

  const editShift = (clickedShift = false) => {
    let shiftToEdit;
    if (clickedShift?.target) shiftToEdit = selectedShift;
    if (!clickedShift?.target) shiftToEdit = clickedShift;
    if (!selectedShift && !shiftToEdit) return;
    setShiftToEdit(shiftToEdit);
    openAddingShiftForm();
  };

  const previewShift = (e) => {
    const { shiftid, month_day } = e.target.dataset;
    if (!month_day) return;
    setClickedDay(new Date(month_day));
    if (!shiftid) return setSelectedShift(null);
    const foundShift = shifts.find((shift) => +shift.service_id === +shiftid);
    if (!foundShift) return;
    setSelectedShift(foundShift);
  };

  const getAllShifts = async () => {
    try {
      const responseData = await sendRequest(
        "http://localhost:5000/api/service",
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      if (!responseData) return;

      const { data: shifts } = responseData;
      if (!shifts.length) return setShifts([]);
      const editedShifts = addAllShiftDays(shifts);
      setShifts(editedShifts);
      setDefaultSelectedShift(editedShifts);
    } catch (err) {}
  };

  const setDefaultSelectedShift = (editedShifts) => {
    const foundShift = editedShifts.find(({ shift_days }) =>
      shift_days.find(
        (shiftDay) =>
          shiftDay.getDate() === clickedDay.getDate() &&
          shiftDay.getMonth() === clickedDay.getMonth() &&
          shiftDay.getFullYear() === clickedDay.getFullYear()
      )
    );

    if (!foundShift) return;
    setSelectedShift(foundShift);
  };

  const addAllShiftDays = (shifts) => {
    return shifts.map((shift) => {
      const shiftDays = [];
      for (let i = 0; i < 5; i++) {
        const startDate = new Date(shift.start_date);
        const addDay = new Date(startDate.setDate(startDate.getDate() + i));
        shiftDays.push(addDay);
      }

      return { ...shift, shift_days: shiftDays };
    });
  };

  useEffect(() => {
    if (!requestError && !requestStatus) getAllShifts();
  }, [requestError, requestStatus]);

  return (
    <Fragment>
      <CalendarPageWrapper>
        <ShiftsCalendar
          {...{
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
            openForm: openAddingShiftForm,
          }}
        />

        {
          <ShiftsTable
            editShift={editShift}
            openDeleteModal={openDeleteModal}
            setSelectedShift={setSelectedShift}
            shifts={shifts}
            setDisplayedDate={setDisplayedDate}
            setClickedDay={setClickedDay}
            openForm={openAddingShiftForm}
            requestError={requestError}
            requestStatus={requestStatus}
            resetHookState={resetHookState}
          />
        }
      </CalendarPageWrapper>
      <ModalTemplate
        modalState={addShiftFormVisibility}
        closeModal={closeAddingShiftForm}
        modalHeading={shiftToEdit ? "Edytuj dyżur" : "Dodaj dyżur"}
      >
        <ControlAddingShift
          token={token}
          operationData={operationData}
          setOperationData={setOperationData}
          closeForm={closeAddingShiftForm}
          shiftToEdit={shiftToEdit}
        />
      </ModalTemplate>

      <ModalTemplate
        closeModal={closeDeleteModal}
        modalState={deleteModal}
        modalHeading={"Usuń dyżur"}
      >
        <DeleteController
          token={token}
          operationData={operationData}
          setOperationData={setOperationData}
          closeDeleteModal={closeDeleteModal}
          selectedShift={selectedShift}
        />
      </ModalTemplate>
    </Fragment>
  );
};

export default ShiftsController;
