const CustomError = require("../errors/custom-error");

const errorHandler = (err, req, res, next) => {
  console.error(err.message);
  
  if(err instanceof CustomError) {
    return res.status(err.code).send(err.serializeErrors());
  } 

  console.error(err);

  return res.status(500).send({
    error: {
      code: 500,
      errors: [{ message: "Internal Server Error" }]
    }
  });
};

module.exports = errorHandler;