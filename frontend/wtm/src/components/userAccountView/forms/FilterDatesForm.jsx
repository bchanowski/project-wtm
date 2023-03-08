import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

import { Formik } from "formik";
import * as yup from "yup";

import classes from "../UserAccountView.module.css";

import { validationTemplates } from "../../../shared/yupHelper";

import ReactDatePicker, { registerLocale } from "react-datepicker";

import pl from "date-fns/locale/pl";

registerLocale("pl", pl);

const FilterDatesForm = ({
  setFormData,
  requestStatus,
  lastFilteredDay = new Date(),
}) => {
  const { validateDateField } = validationTemplates;

  const validationSchema = {
    start: validateDateField,
    end: validateDateField,
  };

  const schema = yup.object().shape(validationSchema);

  const initialValues = {
    start: new Date(),
    end: lastFilteredDay,
  };

  const disableInputs = requestStatus === "loading";

  return (
    <Formik
      validationSchema={schema}
      onSubmit={setFormData}
      initialValues={initialValues}
    >
      {({ handleSubmit, values, setFieldValue, setFieldTouched, errors }) => (
        <Form
          noValidate
          className={`d-flex align-items-center gap-3`}
          onSubmit={handleSubmit}
        >
          <div>
            <ReactDatePicker
              id="start"
              locale="pl"
              className={classes["filter-form_input"]}
              selected={values.start}
              placeholderText={"YYYY-MM-DD"}
              dateFormat="yyyy-MM-dd"
              onChange={(date) => {
                setFieldTouched("start", true);
                setFieldValue("start", date);
              }}
              disabled={disableInputs}
            />

            {!!errors.start && (
              <p className="position-absolute text-danger is-invalid">
                {errors.start}
              </p>
            )}
          </div>

          <div>
            <ReactDatePicker
              id="end"
              locale="pl"
              className={classes["filter-form_input"]}
              selected={values.end}
              placeholderText={"YYYY-MM-DD"}
              dateFormat="yyyy-MM-dd"
              onChange={(date) => {
                setFieldTouched("end", true);
                setFieldValue("end", date);
              }}
              disabled={disableInputs}
            />

            {!!errors.end && (
              <p className="position-absolute text-danger is-invalid">
                {errors.end}
              </p>
            )}
          </div>

          <Button disabled={disableInputs} type="submit">
            {!disableInputs && "Filtruj"}
            {disableInputs && <Spinner animation="border" size="sm" />}
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default FilterDatesForm;
