import AddShiftForm from "./AddShiftForm";
import { Fragment, useEffect, useState, useCallback } from "react";

import useHttp from "../../../shared/useHttp";
import SuccessAlert from "../../../common/UI/SuccessAlert";
import { convertDate } from "../../../shared/helpers";

const ControlAddingShift = ({
  shiftToEdit,
  setOperationData,
  closeForm,
  operationData,
  token,
}) => {
  const [formData, setFormData] = useState(null);

  const { requestStatus, requestError, sendRequest } = useHttp();

  const requestMethod = !!shiftToEdit ? "PATCH" : "POST";

  const submitForm = async () => {
    const { start_date } = formData;
    const end_date = countEndDate(start_date);
    console.log(end_date);
    const [year, month, day] = convertDate(start_date);
    const updatedFormData = {
      start_date: `${year}-${month}-${day}`,
      end_date,
      ...formData,
    };

    if (shiftToEdit) updatedFormData.service_id = shiftToEdit.service_id;

    try {
      const responseData = await sendRequest(
        import.meta.env.VITE_API_URL + "/api/service",
        {
          method: requestMethod,
          body: JSON.stringify(updatedFormData),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      if (!responseData) throw "";
      setOperationData(responseData);
    } catch (err) {
      setFormData(null);
    }
  };

  const countEndDate = (date) => {
    const selectedDate = new Date(new Date(date).setHours(0, 0, 0, 0));
    const remainingDays = 4;
    const endDay = selectedDate.getDate() + remainingDays;
    const end_at = new Date(selectedDate.setDate(endDay));
    return `${String(end_at.getFullYear()).padStart(2, 0)}-${String(
      end_at.getMonth() + 1
    ).padStart(2, 0)}-${String(end_at.getDate()).padStart(2, 0)}`;
  };

  useEffect(() => {
    if (!formData) return;
    submitForm();
  }, [formData]);

  return (
    <Fragment>
      {!operationData && (
        <AddShiftForm
          requestStatus={requestStatus}
          requestError={requestError}
          setFormData={setFormData}
          shiftToEdit={shiftToEdit}
        />
      )}
      {!requestError && requestStatus === "completed" && !!operationData && (
        <SuccessAlert
          successMessage={
            operationData?.message || "Operacja zakończona sukcesem"
          }
          onCloseModal={closeForm}
        />
      )}
    </Fragment>
  );
};

export default ControlAddingShift;
