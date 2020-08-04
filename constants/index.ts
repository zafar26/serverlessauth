//  Validation
export const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// Request Method Type
export const authRequestType = "POST";
export const confirmRequestType = "GET";

// Headers
export const authRequestHeaderContentType = "application/json";

// Modes
export const validSigninMode = "signin";
export const validSignupMode = "signup";

// Error Code
export const forbiddenRequest = 403;
export const serverError = 502;
export const clientError = 400;
export const okRequest = 200;

// M
export const forProject = "demoauth";

// Time Constants
export const timezone = "Asia/Kolkata";
export const sessionExpiryHours = 24;
export const sessionExpiryInWords = "24 hours";
export const verificationRequestExpiryMinutes = 5;
