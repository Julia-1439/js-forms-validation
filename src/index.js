import "./style.css";

const doc = document;
const form = doc.querySelector("form");
const highFive = doc.querySelector("#high-five");

const emailValidator = (() => {
  const emailInput = doc.querySelector("#form-email");
  const emailError = doc.querySelector("#form-email + .error-msg");

  function init() {
    emailInput.addEventListener("input", setErrorMsg);
  }

  function setErrorMsg() {
    // no custom error validations; just use default
    emailError.textContent = emailInput.validationMessage;
  }

  function handleFormSubmit() {
    setErrorMsg();
    const isValid = emailInput.reportValidity();
    return isValid;
  }

  return {
    init,
    handleFormSubmit,
  };
})();

const pwValidator = (() => {
  const pwInput = doc.querySelector("#form-pw");
  const pwConfInput = doc.querySelector("#form-pw-confirm");
  const pwError = doc.querySelector("#form-pw + .error-msg");
  const pwConfError = doc.querySelector("#form-pw-confirm + .error-msg");
  const regExp = /[!@]/;

  function init() {
    pwInput.addEventListener("input", () => {
      setPwErrorMsg();
      setPwConfErrorMsg();
    });
    pwConfInput.addEventListener("input", setPwConfErrorMsg);
  }

  function setPwErrorMsg() {
    pwInput.setCustomValidity(""); // reset previous custom message set
    let errorMsg;

    // important: list custom validation BEFORE checking the built-in validation
    if (!regExp.test(pwInput.value)) {
      errorMsg = "Password must contain either '!' or '@'.";
      pwInput.setCustomValidity(errorMsg);
    } else if (!pwInput.checkValidity()) {
      errorMsg = pwInput.validationMessage;
    } else {
      errorMsg = "";
    }

    pwError.textContent = errorMsg;
  }

  function setPwConfErrorMsg() {
    pwConfInput.setCustomValidity(""); // reset previous custom message set
    let errorMsg;

    // important: list custom validation BEFORE checking the built-in validation
    if (pwConfInput.value !== pwInput.value) {
      errorMsg = "Both passwords must match.";
      pwConfInput.setCustomValidity(errorMsg);
    } else {
      errorMsg = "";
    }

    pwConfError.textContent = errorMsg;
  }

  function handleFormSubmit() {
    setPwErrorMsg();
    setPwConfErrorMsg();
    const isValid = pwConfInput.reportValidity() && pwInput.reportValidity(); // the ordering here ensures pwInput is the one to be visibly reported on if both pwInput and pwConfInput are invalid.
    return isValid;
  }

  return {
    init,
    handleFormSubmit,
  };
})();

const countryValidator = (() => {
  const countryInput = doc.querySelector("#form-country");
  const countryError = doc.querySelector("#form-country + .error-msg");

  function init() {
    countryInput.addEventListener("input", setErrorMsg);
  }

  function setErrorMsg() {
    // no custom error validations; just use default
    countryError.textContent = countryInput.validationMessage;
  }

  function handleFormSubmit() {
    setErrorMsg();
    const isValid = countryInput.reportValidity();
    return isValid;
  }

  return {
    init,
    handleFormSubmit,
  };  
})();

const inputValidators = [
  emailValidator,
  pwValidator,
  countryValidator,
];

inputValidators.forEach((validator) => validator.init());
form.addEventListener("submit", handleSubmit);

function handleSubmit(evt) {
  evt.preventDefault();
  highFive.textContent = "";

  let formValid = true;
  inputValidators.reverse(); // for `reportValidity` to report on the first invalid field
  for (const inputValidator of inputValidators) {
    const inputValid = inputValidator.handleFormSubmit();
    if (!inputValid) formValid = false;
  }

  // simulate the data being submitted
  if (formValid) {
    highFive.textContent = "High five!";
    form.reset();
  }
}
