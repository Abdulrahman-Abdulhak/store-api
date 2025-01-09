import NotFoundError from "../NotFoundError.js";

export default class NotFoundValueErrorDB extends NotFoundError {
  constructor(msg) {
    super(msg);
  }
}
