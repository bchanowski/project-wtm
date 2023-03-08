import { WorkTimeView } from "../components/userAccountView/WorkTimeView";
import { RemoteDaysView } from "../components/userAccountView/RemoteDaysView";
import { PersonalDataView } from "../components/userAccountView/PersonalDataView";
import { Fragment, useContext, useEffect, useState } from "react";
import ButtonsPanel from "../components/userAccountView/ButtonsPanel";
import PageWrapper from "../components/userAccountView/PageWrapper";

import ModalTemplate from "../common/UI/ModalTemplate";
import FormController from "../components/userAccountView/FormController";

import useHttp from "../shared/useHttp";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import classes from "../components/userAccountView/UserAccountView.module.css";
import DeleteController from "../components/userAccountView/DeleteController";
import AppContext from "../shared/context/app-context";

const UserAccountView = () => {
  const [modalVisibility, setModalVisibility] = useState(false);
  const [deleteModalVisibility, setDeleteModalVisibility] = useState(false);
  const [requestData, setRequestData] = useState(null);
  const [userAccount, setUserAccount] = useState(null);
  const [remoteDays, setRemoteDays] = useState(null);
  const [workTimeMessages, setWorkTimeMessages] = useState(null);

  const [workTimeFilters, setWorkTimeFilters] = useState(null);
  const [homeOfficeFilters, setHomeOfficeFilters] = useState(null);

  const { user, token } = useContext(AppContext);

  const { requestStatus, requestError, sendRequest, resetHookState } =
    useHttp();

  const closeModal = () => {
    setModalVisibility(false);
    setDeleteModalVisibility(false);
    if (requestData?.data) requestData.updateState(requestData.data);
    setRequestData(null);
  };

  const openRemoteDayForm = (dayToEdit = null, method = "POST") => {
    setModalVisibility(true);
    setRequestData({
      modalHeading: `${!!dayToEdit ? "Edytuj" : "Dodaj"} dzień zdalny`,
      method,
      endPoint: "homeOffice/userAccount",
      responseMessage: "",
      data: null,
      objectToEdit: dayToEdit,
      operation: "REMOTE_DAY",
      updateState: setRemoteDays,
    });
  };

  const openWorkTimeForm = (msgToEdit = null, method = "POST") => {
    setModalVisibility(true);
    setRequestData({
      modalHeading: `${!!msgToEdit ? "Edytuj" : "Dodaj"} status`,
      method,
      endPoint: "work-time/userAccount",
      responseMessage: "",
      objectToEdit: msgToEdit,
      operation: "WORK_TIME",
      updateState: setWorkTimeMessages,
    });
  };

  const openDeleteForm = (object_id, endPoint, modalHeading, updateState) => {
    setDeleteModalVisibility(true);
    setRequestData({
      responseMessage: "",
      object_id,
      endPoint,
      modalHeading,
      updateState,
    });
  };

  const getUserAccount = async () => {
    try {
      const responseData = await sendRequest(
        `http://localhost:5000/api/users/account/${user?.email}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      if (!responseData) throw "";
      setUserAccount(responseData.data);
      setRemoteDays(responseData.data?.homeofficeDays);
      setWorkTimeMessages(responseData.data?.workTimeMessages);
    } catch (err) {
      setUserAccount(null);
      setRemoteDays(null);
      setWorkTimeMessages(null);
    }
  };

  // getUserAccount will be triggered only if requestError and requestStatus are null
  // to trigger request again, call resetHookState function
  useEffect(() => {
    if (!requestError && !requestStatus && !!user) getUserAccount();
  }, [requestError, requestStatus, user]);

  return (
    <Fragment>
      <PageWrapper>
        <ButtonsPanel
          openRemoteDayForm={openRemoteDayForm}
          openWorkTimeForm={openWorkTimeForm}
        />

        <Row>
          <Col>
            <div className={classes["userAccount-details-container"]}>
              <PersonalDataView
                requestError={requestError}
                requestStatus={requestStatus}
                userAccount={userAccount}
                resetHookState={resetHookState}
              />

              <RemoteDaysView
                openRemoteDayForm={openRemoteDayForm}
                openDeleteWorkTimeForm={openDeleteForm}
                remoteDays={remoteDays}
                setRemoteDays={setRemoteDays}
                requestStatus={requestStatus}
                requestError={requestError}
                resetHookState={resetHookState}
                userId={userAccount?.user_id}
              />

              <WorkTimeView
                workTimeMessages={workTimeMessages}
                setWorkTimeMessages={setWorkTimeMessages}
                openDeleteWorkTimeModal={openDeleteForm}
                editWorkTimeMessage={openWorkTimeForm}
                requestStatus={requestStatus}
                requestError={requestError}
                resetHookState={resetHookState}
                userId={userAccount?.user_id}
              />
            </div>
          </Col>
        </Row>
      </PageWrapper>
      {!!requestData && (
        <ModalTemplate
          modalHeading={requestData?.modalHeading}
          modalState={modalVisibility}
          closeModal={closeModal}
        >
          <FormController
            token={token}
            closeModal={closeModal}
            userId={userAccount}
            requestData={requestData}
            setRequestData={setRequestData}
          />
        </ModalTemplate>
      )}
      {!!requestData && (
        <ModalTemplate
          modalState={deleteModalVisibility}
          modalHeading={requestData?.modalHeading}
          closeModal={closeModal}
        >
          <DeleteController
            token={token}
            requestData={requestData}
            setRequestData={setRequestData}
            userId={userAccount?.user_id}
            closeModal={closeModal}
          />
        </ModalTemplate>
      )}
    </Fragment>
  );
};

export default UserAccountView;
