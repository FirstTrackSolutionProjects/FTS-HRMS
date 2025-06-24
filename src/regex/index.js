export const EMPLOYEE_REGEX = Object.freeze({
    FIRST_NAME: /^[A-Za-z]{3,50}$/,
    LAST_NAME: /^$|^[A-Za-z][A-Za-z ]{2,49}$/,
    EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    MOBILE: /^[6-9]\d{9}$/
})

export const JOIN_US_REQUEST_REGEX = Object.freeze({
    REASON: /^[\s\S]{20,250}$/
})