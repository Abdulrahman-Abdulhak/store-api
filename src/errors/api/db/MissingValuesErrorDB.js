import CustomApiError from "../CustomApiError.js";

export default class MissingValuesErrorDB extends CustomApiError {
  constructor(msg) {
    super(msg, 400);
  }
}
