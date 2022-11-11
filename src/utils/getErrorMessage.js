export const getErrorMessage = (error) => {
    console.log(error)
  if (error.response && error.response.data.message) {
    return error.response.data.message;
  } else {
    return "Network Error";
  }
};
