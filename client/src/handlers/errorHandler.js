export const sendError = (error) => {
  return error.response.data.error.message;
};
