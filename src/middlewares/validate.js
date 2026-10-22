// export const validate = (schema) => (req, res, next) => {
//   const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true });

//   if (error) {
//     // Clean and user-friendly messages
//     const errors = error.details.map((detail) => {
//       return detail.message.replace(/["]/g, ''); // remove extra quotes
//     });

//     // If only one error, show as single string; otherwise show list
//     return res.status(400).json({
//       error: errors.length === 1 ? errors[0] : errors
//     });
//   }

//   next();
// };


export const validate = (schema) => (req, res, next) => {
  for (const key of ["params", "body"]) {
    if (schema[key]) {
      const { error, value } = schema[key].validate(req[key], {
        abortEarly: false,
      });

      if (error) {
        return res.status(400).json({
          status: "Error",
          message: error.details.map((d) => d.message),
        });
      }

      req[key] = value;
    }
  }

  next();
};


// const options = {
//   abortEarly: false,
//   stripUnknown: true,
//   convert: true,
// };

// export const validate = (schema) => (req, res, next) => {
//   const details = [];
//   const value = {};

//   for (const key of ["body", "params", "query"]) {
//     if (!schema[key]) {
//       continue;
//     }

//     const result = schema[key].validate(req[key], options);
//     if (result.error) {
//       details.push(...result.error.details.map((detail) => detail.message));
//     } else {
//       value[key] = result.value;
//     }
//   }

//   if (details.length > 0) {
//     return res.status(400).json({
//       status: "ERROR",
//       message: "Validation failed",
//       details,
//     });
//   }

//   if (value.body) {
//     req.body = value.body;
//   }
//   if (value.params) {
//     Object.assign(req.params, value.params);
//   }
//   if (value.query) {
//     Object.assign(req.query, value.query);
//   }

//   next();
// };
