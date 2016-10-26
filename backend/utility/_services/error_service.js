const ERROR_TYPES = {
    VALIDATION_ERRORS: 1,
    UNIQUE_KEY_ERROR: 2
};

class ErrorService {
    createValidationError(validationErrors = {}) {
        return {error: validationErrors, type: ERROR_TYPES.VALIDATION_ERRORS}
    }

    isValidationError(errorObject = {}) {
        return errorObject.type === ERROR_TYPES.VALIDATION_ERRORS;
    }

    createUniqueKeyError(error = {}, errorMessage) {
        return {error: errorMessage, originalError: error, type: ERROR_TYPES.UNIQUE_KEY_ERROR}
    }

    isUniqueKeyConstraintError(errorObject = {}) {
        return errorObject.code === 11000 || errorObject.type === ERROR_TYPES.UNIQUE_KEY_ERROR;
    }

    resultToStatusCode(result = {}) {
        let {error} = result;
        return error ? 400 : 200;
    }
}

module.exports = new ErrorService();

