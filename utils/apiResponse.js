exports.apiResponse = ({
    status = true,
    status_code = 200,
    message = "Success",
    errors = "",
    result = null,
    executionTime = 0
}) => {
    return {
        status,
        status_code,
        message,
        errors,
        result,
        executionTime
    };
};
