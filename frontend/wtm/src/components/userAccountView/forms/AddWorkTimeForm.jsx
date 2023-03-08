import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import classes from "../UserAccountView.module.css";

import { Formik } from "formik";
import * as yup from "yup";

import { validationTemplates } from "../../../shared/yupHelper";
import CenteredSpinner from "../../../common/UI/CenteredSpinner";
import ErrorAlert from "../../../common/UI/ErrorAlert";

import { registerLocale } from "react-datepicker";

import pl from "date-fns/locale/pl";
import TimePicker from "react-time-picker";

registerLocale("pl", pl);

const AddWorkTimeForm = ({
  setFormData,
  requestStatus,
  requestError,
  objectToEdit,
}) => {
  const { validateSelectField } = validationTemplates;

  const validationSchema = {
    status: validateSelectField,
    arrival_time: yup
      .string("Pole wymagane")
      .required("Godzina rozpoczęcia jest wymagana"),
  };

  const schema = yup.object().shape(validationSchema);

  let currentTime = new Date().toLocaleString("pl", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const initialValues = {
    status: "",
    arrival_time: currentTime,
  };

  if (objectToEdit) {
    const { message } = objectToEdit;
    if (!message) return console.log("no message");
    const enteredValues = message.split(" ");
    initialValues.status = enteredValues[0];
  }

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
          <Form.Group
            className={`${classes["addStatus-form-field"]} position-relative`}
            controlId="status"
          >
            <Form.Label>Wybierz status</Form.Label>
            <Form.Select
              id="status"
              name="status"
              onBlur={handleBlur}
              onChange={(e) => {
                setFieldTouched("status", true);
                setFieldValue("status", e.target.value);
              }}
              isInvalid={errors.status && touched.status}
              isValid={!errors.status && values.status}
              disabled={disableInputs}
              value={values.status}
            >
              <option value=""></option>
              <option value="start">Start</option>
              <option value="quit">Koniec</option>
            </Form.Select>

            {!!errors.status && !!touched.status && (
              <p
                className={`${classes["form-error"]} position-absolute text-danger py-2 is-invalid`}
              >
                {errors.status}
              </p>
            )}
          </Form.Group>

          <Form.Group
            className={`${classes["addStatus-form-field"]} ${classes["marginTop"]} position-relative d-grid`}
            controlId="arrival_time"
          >
            <Form.Label>Godzina statusu</Form.Label>

            <TimePicker
              locale="pl"
              onBlur={handleBlur}
              onChange={(date) => {
                setFieldTouched("arrival_time", true);
                if (!date) return setFieldValue("arrival_time", "");
                setFieldValue("arrival_time", date);
              }}
              showSecond={false}
              value={values.arrival_time}
            />

            {!!errors.arrival_time && !!touched.arrival_time && (
              <p
                className={`${classes["form-error"]} position-absolute text-danger py-2 is-invalid`}
              >
                {errors.arrival_time}
              </p>
            )}
          </Form.Group>

          <div className="d-grid gap-1 mt-5 mb-2">
            <Button disabled={disableInputs} type="submit">
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

export default AddWorkTimeForm;
