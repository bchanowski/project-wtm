import * as yup from "yup";

const isRequiredErrorMessage = "Pole wymagane";
const tooLongErrorMessage = "Fraza za długa";
const tooShortErrorMessage = "Fraza za krótka";

const regexForSpecialCharacters = /[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/;

export const validationTemplates = {
  validateSingleTextField: yup
    .string()
    .trim()
    .min(3, tooShortErrorMessage)
    .max(40, tooLongErrorMessage)
    .required(isRequiredErrorMessage),
  validateSelectField: yup
    .string()
    .trim()
    .min(1, tooShortErrorMessage)
    .max(40, tooLongErrorMessage)
    .required(isRequiredErrorMessage),
  validateSelectTeamField: yup
    .string()
    .trim()
    .min(1, tooShortErrorMessage)
    .max(40, tooLongErrorMessage),
  validateMultilineTextField: yup
    .string()
    .trim()
    .min(1, tooShortErrorMessage)
    .max(300, tooLongErrorMessage)
    .required(isRequiredErrorMessage),
  validateNumberField: yup
    .number()
    .max(1000000000, tooLongErrorMessage)
    .required(),
  validateDateField: yup.date().required(isRequiredErrorMessage),
  validatePassword: yup
    .string("Pole wymagane")
    .trim()
    .max(30, tooLongErrorMessage)
    .required(isRequiredErrorMessage),
  validatePasswordNotReq: yup
    .string()
    .trim()
    .min(2, tooShortErrorMessage)
    .max(30, tooLongErrorMessage),
  validateEmail: yup
    .string()
    .email("Format wprowadzonego maila jest nieprawidłowy")
    .required(isRequiredErrorMessage),
  validatePhoneNumber: yup
    .string()
    .trim()
    .min(8, tooShortErrorMessage)
    .max(14, tooLongErrorMessage)
    .nullable(),
};
