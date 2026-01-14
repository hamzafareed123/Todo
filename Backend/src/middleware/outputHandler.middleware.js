import { ENV } from "../lib/env.js";

export const outputHandler = (status, req, res, next) => {
  if (res.headersSent) return;

  const result = req.result;
  const error = req.error;

  //   const userAgent = req.headers["user-agent"] || "";
  //   const isMobile = /mobile|android|iphone/i.test(userAgent);

  if (ENV.NODE_ENV == "development" && error) {
    console.log("error in development ", error);
  }

  let resultStatus = true;

  if (result && result.resultHasError) {
    resultStatus = false;
    delete result.resultHasError;
  }

  const prepareResponse = (status, resultStatus, data, error) => {
    switch (status) {
      case 200:
        return { success: resultStatus, data, message: findMessage(data) };
      case 201:
        return { success: true, data, message: findMessage(data) };
      case 404:
      case 400:
      case 401:
      case 403:
      case 409:
      case 500:
        return { success: false, message: error };
      default:
        return { success: false, message: error };
    }
  };

  return res
    .status(status)
    .json(prepareResponse(status, resultStatus, result, error));
};

const findMessage = (obj) => {
  let result = "";

  function recursiveSearch(value) {
    if (result !== "") return;

    if (typeof value === "object" && value !== null) {
      for (const key in value) {
        if (["message", "messages", "error", "errors"].includes(key)) {
          result = value[key];
          return;
        } else if (key == "data" && value[key] == "object" && value !== null) {
          recursiveSearch(value[key]);
        }
      }
    }
  }

  recursiveSearch(obj)
  return result || "";
};
