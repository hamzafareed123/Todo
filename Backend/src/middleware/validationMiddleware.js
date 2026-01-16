import { customError } from "../lib/customError.js";

export const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body,{abortEarly:false});

    if (error) {
      const errors = {};

      error.details.forEach((detail) => {
        errors[detail.path[0]] = detail.message;
      });

      res.status(400).json({
        errors: errors,
      });
    }

    req.validatedData = value;
    next();
  };
};
