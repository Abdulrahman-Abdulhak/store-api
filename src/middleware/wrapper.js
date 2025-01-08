export const asyncWrapper = (wrappedFunction) => {
  return async (req, res, next) => {
    try {
      await wrappedFunction(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};
