export class LateValidationCheckInError extends Error {
  constructor() {
    super("Check in validation time expired.");
  }
}
