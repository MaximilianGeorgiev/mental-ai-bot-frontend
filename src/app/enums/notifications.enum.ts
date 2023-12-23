export enum Notifications {
    INVALID_FORM_REQUIRED = "Please fill all form values before proceeding.",
    LOGIN_SUCCESS = "Login successful.",
    LOGIN_FAILURE = "Unable to login. Please double check your credentials.",
    REGISTER_SUCCESS = "Registration successful.",
    REGISTER_FAILURE = "Unable to register. Please double check your information.",
    PASSWORD_MISMATCH = "Password do not match.",
    CREATEPLAN_SUCCESS = "Self care plan successfully created.",
    CREATEPLAN_FAILURE = "Self care plan creation failed.",
    CREATEPLAN_NOT_APPROVED = "You cannot create the plan before approving the generated activities.",
    CREATEPLAN_ACTIVITIES_GENERATED = "Proposed activities generated.",
    CREATEPLAN_ACTIVITIES_REGENERATED = "Regenerated other proposed activities.",
};