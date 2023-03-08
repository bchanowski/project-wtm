import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import classes from "../../shiftsController/forms/AddShiftForm.module.css";

import { Formik } from "formik";
import * as yup from "yup";

import { validationTemplates } from "../../../shared/yupHelper";
import CenteredSpinner from "../../../common/UI/CenteredSpinner";
import ErrorAlert from "../../../common/UI/ErrorAlert";

import DatePicker, { registerLocale } from "react-datepicker";

import pl from "date-fns/locale/pl";
import { useRef } from "react";
import { convertDate } from "../../../shared/helpers";

registerLocale("pl", pl);

const AddRemoteDayForm = ({
  setFormData,
  requestStatus,
  requestError,
  objectToEdit,
}) => {
  const { validateDateField } = validationTemplates;
  const dateRef = useRef("");

  const validationSchema = {
    remoteDay_date: validateDateField.test(
      "",
      "Dzień zdalny nie może być w sobotę lub niedzielę",
      (selectedDate) => {
        const chosenWeekday = selectedDate?.toLocaleString("pl", {
          weekday: "long",
        });
        if (chosenWeekday === "sobota" || chosenWeekday === "niedziela")
          return false;
        return true;
      }
    ),
  };

  const schema = yup.object().shape(validationSchema);

  const initialValues = {
    remoteDay_date: "",
  };

  if (objectToEdit) {
    initialValues.remoteDay_date = new Date(objectToEdit.date);
  }

  const formFieldClasses = `mb-2 mb-md-3 mb-xl-4`;
  const formLabelClasses = `${classes["addShiftform-label"]}`;

  const disableInputs = requestStatus === "loading";

  return (
    <Formik
      validationSchema={schema}
      onSubmit={setFormData}
      initialValues={initialValues}
    >
      {({
        handleSubmit,
        handleBlur,
        setFieldTouched,
        setFieldValue,
        values,
        touched,
        errors,
      }) => (
        <Form noValidate onSubmit={handleSubmit}>
          <Form.Group className={formFieldClasses} controlId="remoteDay_date">
            <Form.Label className={formLabelClasses}>Wybierz dzień</Form.Label>

            <DatePicker
              ref={dateRef}
              id="remoteDay_date"
              locale="pl"
              className="select-nav-item"
              selected={values.remoteDay_date}
              placeholderText={"YYYY-MM-DD"}
              dateFormat="yyyy-MM-dd"
              onBlur={handleBlur}
              onChange={(date) => {
                setFieldTouched("remoteDay_date", true);
                setFieldValue("remoteDay_date", date);
              }}
              disabled={disableInputs}
            />

            {!!errors.remoteDay_date && !!touched.remoteDay_date && (
              <p className="position-relative text-danger px-1 is-invalid">
                {errors.remoteDay_date}
              </p>
            )}
          </Form.Group>

          <div className="d-grid gap-1 mt-4 mb-2">
            <Button
              className={classes["addShiftForm-submitBtn"]}
              disabled={disableInputs}
              type="submit"
            >
              {!disableInputs && "WYŚLIJ"}
              {disableInputs && <CenteredSpinner />}
            </Button>
          </div>

          {!!requestError && requestStatus !== "loading" && (
            <ErrorAlert {...{ requestError }} />
          )}
        </Form>
      )}
    </Formik>
  );
};

export default AddRemoteDayForm;
