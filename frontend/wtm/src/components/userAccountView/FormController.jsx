import AddRemoteDayForm from "./forms/AddRemoteDayForm";
import SuccessAlert from "../../common/UI/SuccessAlert";

import useHttp from "../../shared/useHttp";
import { Fragment, useEffect, useState } from "react";
import AddWorkTimeForm from "./forms/AddWorkTimeForm";
import { convertDate } from "../../shared/helpers";

const FormController = ({
  requestData,
  closeModal,
  setRequestData,
  userId,
  token,
}) => {
  const { requestStatus, requestError, sendRequest } = useHttp();
  const [formData, setFormData] = useState(null);

  const submitForm = async () => {
    try {
      let data = {
        user_id_fk: userId,
      };

      if (requestData?.operation === "REMOTE_DAY") {
        const { remoteDay_date } = formData;
        const [year, month, day] = convertDate(remoteDay_date);
        data.date = `${year}-${month}-${day}`;
        console.log(data);
        if (requestData?.objectToEdit) {
          data.homeoffice_id = requestData?.objectToEdit?.homeoffice_id;
        }
      } else {
        const { status, arrival_time } = formData;
        let sent_at = new Date();
        sent_at.setHours(parseInt(arrival_time.substring(0, 2)) + 1);
        sent_at.setMinutes(arrival_time.substring(3, 5));
        sent_at.setSeconds(0);
        data.message_sent_at = sent_at;
        data.message = `${status}`;
        data.full_work_time = 0;
        if (requestData?.objectToEdit) {
          data.work_time_id = requestData?.objectToEdit?.work_time_id;
        }
      }

      const responseData = await sendRequest(
        `http://localhost:5000/api/${requestData?.endPoint}`,
        {
          method: requestData.method,
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      if (!responseData) throw "";
      setRequestData((props) => ({
        ...props,
        responseMessage: responseData.message,
        data: responseData.data,
      }));
    } catch (err) {
      setFormData(null);
    }
  };

  useEffect(() => {
    if (!formData) return;
    submitForm();
  }, [formData]);

  return (
    <Fragment>
      {!requestData?.responseMessage &&
        requestData?.operation === "REMOTE_DAY" && (
          <AddRemoteDayForm
            requestStatus={requestStatus}
            requestError={requestError}
            objectToEdit={requestData?.objectToEdit}
            setFormData={setFormData}
          />
        )}
      {!requestData?.responseMessage &&
        requestData?.operation === "WORK_TIME" && (
          <AddWorkTimeForm
            requestStatus={requestStatus}
            requestError={requestError}
            objectToEdit={requestData?.objectToEdit}
            setFormData={setFormData}
          />
        )}
      {!requestError &&
        requestStatus === "completed" &&
        !!requestData?.responseMessage && (
          <SuccessAlert
            successMessage={
              requestData.responseMessage || "Operacja zakończona sukcesem"
            }
            onCloseModal={closeModal}
          />
        )}
    </Fragment>
  );
};

export default FormController;
