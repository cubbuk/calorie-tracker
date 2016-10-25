const ERROR_TYPES = {
    VALIDATION_ERRORS: 1
};

class ErrorService {
    createValidationError(validationErrors = {}) {
        return {error: validationErrors, type: ERROR_TYPES.VALIDATION_ERRORS}
    }

    resultToStatusCode(result = {}) {
        let {error} = result;
        return error ? 400 : 200;
    }
}

module.exports = new ErrorService();

