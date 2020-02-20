/**
 * @author aramsey
 *
 * Standardizes API calls and errors returned by it.
 *
 * @module callApi
 */

/**
 * A function which should help standardize how fetch calls are handled.
 * The promise returned from fetch is returned to the caller so more
 * can be chained to it.
 *
 * @example <caption>Basic GET request</caption>
 * callApi({
 *     endpoint: "/api/apps"
 * }).then(resp => {
 *     setAppListing(resp.apps)
 * }
 *
 * @example <caption>POST request with callbacks</caption>
 * callApi({
 *     endpoint `/api/apps/${appId}/publish`,
 *     method: "POST",
 *     body: appInfo,
 *     setLoading,
 *     setError,
 * }).then(resp => {
 *     showPublishMessage()
 * }
 *
 * @param props
 * @returns {Promise<any>}
 */
const callApi = (props) => {
    const {
        method = "GET",
        endpoint,
        body = false,
        headers,
        setLoading,
        setError,
    } = props;

    setLoading && setLoading(true);

    return fetch(endpoint, {
        method,
        body: body ? JSON.stringify(body) : null,
        headers: headers
            ? headers
            : {
                  "Content-Type": "application/json",
              },
        credentials: "include",
    })
        .then((resp) => checkForError(resp, props))
        .then((resp) => resp.json())
        .catch((error) => {
            setError && setError(error);
        })
        .finally(() => {
            setLoading && setLoading(false);
        });
};

export default callApi;

/**
 * A resuable handler that will throw an APIError if the response is not okay,
 * otherwise it returns the response unchanged. Separated out for the rare
 * instances when the callApi() function isn't sufficient and fetch() is used
 * directly (i.e. file uploads).
 *
 * @param {object} resp - The fetch response object.
 * @param {object} props - An object containing method, endpoint, and headers fields.
 * @returns {object}
 */
export const checkForError = async (resp, { method, endpoint, headers }) => {
    if (!resp.ok) {
        throw await getAPIErrorFromResponse(resp, method, endpoint, headers);
    }

    return resp;
};

/**
 * @typedef ErrorDetails
 * @property {string} code - The error_code returned by the API.
 * @property {Object} context - Extra details about the error returned as a map.
 * @property {{method: string, endpoint: string, headers: Object}} request - Details about the API request.
 * @property {{url: string, status: number, statusText: string, headers: Object}} response - Details about the response from the API.
 */

/**
 * An Error returned from calls to the API. Indicates whether the message
 * is parseable as JSON or not.
 *
 * @extends Error
 */
export class APIError extends Error {
    /**
     * @param {ErrorDetails} details - Extended information about the Error. Added to prevent the constructor args from being long.
     */
    constructor(details, ...args) {
        super(...args);
        this.details = details;
    }
}

/**
 * Returns a new APIError. Needed because it's technically possible for
 * the api to not return a JSON-encoded error message. Not a constructor
 * because we don't want to tie APIError to responses directly.
 *
 * @param {Object} resp - The Response object returned by fetch().
 * @param {string} method - The request method.
 * @param {string} endpoint - The path the request was sent to.
 * @param {Object} headers - The headers associated with the request.
 * @returns {APIError}
 *
 */
export const getAPIErrorFromResponse = async (
    resp,
    method,
    endpoint,
    headers
) => {
    let errorMessage = await resp.text();
    let apiError;

    try {
        apiError = JSON.parse(errorMessage);
    } catch (_) {
        return new APIError({}, errorMessage);
    }

    // It's easier to work with if the error_code is separate
    // from the error context.
    const {
        error_code: code,
        ...context // separate the error context into a new object.
    } = apiError;

    // We need an object, but Error() only accepts strings, so serialize
    // it and throw it up.
    const details = {
        code,
        context,

        request: {
            method,
            endpoint,
            headers,
        },

        response: {
            url: resp.url,
            status: resp.status,
            statusText: resp.statusText,

            // turns headers into a POO (plain old object)
            headers: resp.headers,
        },
    };

    return new APIError(details, code);
};
