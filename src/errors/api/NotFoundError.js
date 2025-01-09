import CustomApiError from "./CustomApiError.js";

export default class NotFoundValueErrorDB extends CustomApiError {
  constructor(msg) {
    super(msg, 404);
  }
}
