import { Fragment, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import CenteredSpinner from "../../common/UI/CenteredSpinner";
import ErrorAlert from "../../common/UI/ErrorAlert";
import SuccessAlert from "../../common/UI/SuccessAlert";
import useHttp from "../../shared/useHttp";

const DeleteController = ({
  requestData,
  setRequestData,
  userId,
  closeModal,
  token,
}) => {
  const [isDeleting, setIsDeleting] = useState(null);

  const { requestStatus, requestError, sendRequest } = useHttp();

  const deleteObject = async () => {
    try {
      const responseData = await sendRequest(
        import.meta.env.VITE_API_URL + `/api/${requestData?.endPoint}`,
        {
          method: "DELETE",
          body: JSON.stringify({
            id: requestData?.object_id,
            user_id_fk: userId,
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      console.log(responseData);
      if (!responseData) throw "";
      setRequestData((props) => ({
        ...props,
        responseMessage: responseData.message,
        data: responseData.data,
      }));
      setIsDeleting(false);
    } catch (err) {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if (!isDeleting) return;
    deleteObject();
  }, [isDeleting]);

  return (
    <Fragment>
      {!requestData?.responseMessage && (
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
      {!requestError &&
        requestStatus === "completed" &&
        !!requestData?.responseMessage && (
          <SuccessAlert
            successMessage={
              requestData?.responseMessage || "Operacja zakończona sukcesem"
            }
            onCloseModal={closeModal}
          />
        )}
    </Fragment>
  );
};

export default DeleteController;
