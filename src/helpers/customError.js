const apiError = (errObject) => {
  const err = new Error(errObject.message);
  err.status = errObject.code;
  return err;
};

module.exports = apiError;
