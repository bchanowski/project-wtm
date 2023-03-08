import Button from "react-bootstrap/Button";

import { Fragment, useEffect, useState } from "react";

import useHttp from "../../../shared/useHttp";

import SuccessAlert from "../../../common/UI/SuccessAlert";
import CenteredSpinner from "../../../common/UI/CenteredSpinner";
import ErrorAlert from "../../../common/UI/ErrorAlert";

const DeleteController = ({
  operationData,
  setOperationData,
  closeDeleteModal,
  selectedShift,
  token,
}) => {
  const [isDeleting, setIsDeleting] = useState(null);

  const { requestStatus, requestError, sendRequest } = useHttp();

  const deleteShift = async () => {
    const { service_id: id } = selectedShift;
    try {
      const responseData = await sendRequest(
        "http://localhost:5000/api/service",
        {
          method: "DELETE",
          body: JSON.stringify({ id }),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      if (!responseData) throw "";
      setOperationData(responseData);
      setIsDeleting(false);
    } catch (err) {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if (!isDeleting) return;
    deleteShift();
  }, [isDeleting]);

  return (
    <Fragment>
      {!operationData && (
        <div className="d-flex justify-content-end mb-4">
          <Button onClick={() => setIsDeleting(true)} variant="danger">
            {requestStatus !== "loading" && "Usuń"}
            {requestStatus === "loading" && <CenteredSpinner></CenteredSpinner>}
          </Button>
        </div>
      )}
      {!!requestError && requestStatus === "completed" && (
        <ErrorAlert requestError={requestError} />
      )}
      {!requestError && requestStatus === "completed" && !!operationData && (
        <SuccessAlert
          successMessage={
            operationData?.message || "Operacja zakończona sukcesem"
          }
          onCloseModal={closeDeleteModal}
        />
      )}
    </Fragment>
  );
};

export default DeleteController;
