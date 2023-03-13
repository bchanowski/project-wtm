import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import classes from "./AddShiftForm.module.css";

import { Formik } from "formik";
import * as yup from "yup";

import { validationTemplates } from "../../../shared/yupHelper";
import CenteredSpinner from "../../../common/UI/CenteredSpinner";
import ErrorAlert from "../../../common/UI/ErrorAlert";
import RenderOptions from "./RenderOptions";

import ReactDatePicker, { registerLocale } from "react-datepicker";

import pl from "date-fns/locale/pl";

registerLocale("pl", pl);

const AddShiftForm = ({
  setFormData,
  shiftToEdit,
  requestStatus,
  requestError,
}) => {
  const { validateSelectField, validateDateField } = validationTemplates;

  const validationSchema = {
    team_id: validateSelectField,
    start_date: validateDateField.test(
      "",
      "Dyżur musi rozpocząć się od poniedziałku",
      (selectedDate) =>
        selectedDate?.toLocaleString("pl", {
          weekday: "long",
        }) === "poniedziałek"
    ),
  };

  const schema = yup.object().shape(validationSchema);

  const initialValues = {
    start_date: "",
    team_id: "",
  };

  if (!!shiftToEdit) {
    initialValues.start_date = new Date(shiftToEdit.start_date);
    initialValues.team_id = shiftToEdit?.team_id?.team_id;
  }

  const formFieldClasses = `mb-2 mb-md-3 mb-xl-4`;
  const formLabelClasses = `${classes["addShiftform-label"]}`;
  const formInputClasses = `${classes["addShiftform-input"]}`;
  const formMessageClasses = `${classes["addShiftform-message"]}`;

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
        handleChange,
        setFieldTouched,
        setFieldValue,
        values,
        touched,
        errors,
      }) => (
        <Form noValidate onSubmit={handleSubmit}>
          <Form.Group className={formFieldClasses} controlId="team_id">
            <Form.Label className={formLabelClasses}>Wybierz zespół</Form.Label>

            <RenderOptions
              className={formInputClasses}
              name="team_id"
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={errors.team_id && touched.team_id}
              isValid={!errors.team_id && values.team_id}
              error={errors.team_id}
              disabled={disableInputs}
              autoFocus
              value={values.team_id}
            />

            <Form.Control.Feedback
              type="invalid"
              className={formMessageClasses}
            >
              {errors.team_id}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className={formFieldClasses} controlId="start_date">
            <Form.Label className={formLabelClasses}>
              Data początkowa dyżuru
            </Form.Label>
            <ReactDatePicker
              id="start_date"
              locale="pl"
              className="select-nav-item"
              selected={values.start_date}
              placeholderText={"YYYY-MM-DD"}
              dateFormat="yyyy-MM-dd"
              onBlur={handleBlur}
              onChange={(date) => {
                setFieldTouched("start_date", true);
                setFieldValue("start_date", date);
              }}
              disabled={disableInputs}
            />

            {!!errors.start_date && !!touched.start_date && (
              <p className="position-relative text-danger px-1 is-invalid">
                {errors.start_date}
              </p>
            )}
            <Form.Control.Feedback className={formMessageClasses}>
              Wygląda dobrze
            </Form.Control.Feedback>
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

export default AddShiftForm;
