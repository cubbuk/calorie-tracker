const ERROR_TYPES = {
    VALIDATION_ERRORS: 1
};

class ErrorService {
    createValidationError(validationErrors = {}) {
        return {error: validationErrors, type: ERROR_TYPES.VALIDATION_ERRORS}
    }

    isValidationError(errorObject = {}) {
        return errorObject.type === ERROR_TYPES.VALIDATION_ERRORS;
    }

    isUniqueKeyConstraintError(errorObject = {}){
        return errorObject.code === 11000;
    }

    resultToStatusCode(result = {}) {
        let {error} = result;
        return error ? 400 : 200;
    }
}

module.exports = new ErrorService();

