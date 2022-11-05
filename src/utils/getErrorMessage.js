export const getErrorMessage = (error) => {
  if (error.message && error.response.data.message) {
    return error.response.data.message;
  } else {
    return "Network Error";
  }
};
