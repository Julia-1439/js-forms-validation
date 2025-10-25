import "./style.css";

const doc = document;
const form = doc.querySelector("form");
const highFive = form.querySelector("#high-five");

const emailValidator = (() => {
  const emailInput = doc.querySelector("#form-email");
  const emailError = doc.querySelector("#form-email + .error-msg");

  function init() {
    emailInput.addEventListener("input", setErrorMsg);
  }

  function setErrorMsg() {
    emailError.textContent = emailInput.validationMessage; // no custom error validations; just use default
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
  const pwInput = form.querySelector("#form-pw");
  const pwError = form.querySelector("#form-pw + .error-msg");
  const pwConfInput = form.querySelector("#form-pw-confirm");
  const regExp = /[!@]/;

  function init() {
    pwInput.addEventListener("input", () => {
      setErrorMsg();
      if (pwConfInput)
        pwConfInput.dispatchEvent(new CustomEvent("custom:pwInput"));
    });
  }

  function setErrorMsg() {
    pwInput.setCustomValidity(""); // reset previous custom message set
    let errorMsg;

    if (!pwInput.checkValidity()) { // since custom validity is reset, .checkValidity always just checks the vanilla HTML condition
      errorMsg = pwInput.validationMessage;
    } else if (!regExp.test(pwInput.value)) {
      errorMsg = "Password must contain either '!' or '@'.";
      pwInput.setCustomValidity(errorMsg);
    } else {
      errorMsg = "";
    }

    pwError.textContent = errorMsg;
  }

  function handleFormSubmit() {
    setErrorMsg();
    const isValid = pwInput.reportValidity();
    return isValid;
  }

  return {
    init,
    handleFormSubmit,
  };
})();

const pwConfValidator = (() => {
  const pwInput = form.querySelector("#form-pw");
  const pwConfInput = form.querySelector("#form-pw-confirm");
  const pwConfError = form.querySelector("#form-pw-confirm + .error-msg");
  const regExp = /[!@]/;

  function init() {
    pwConfInput.addEventListener("input", setErrorMsg);
    pwConfInput.addEventListener("custom:pwInput", setErrorMsg);
  }

  function setErrorMsg() {
    pwConfInput.setCustomValidity(""); // reset previous custom message set
    let errorMsg;

    if (pwConfInput.value !== pwInput.value) {
      // put this conditional first, since it's the most expected
      errorMsg = "Both passwords must match.";
      pwConfInput.setCustomValidity(errorMsg);
    }
    // it is necessary to mirror the conditions of `pwInput` to prevent `pwConfInput` being marked valid when `pwInput` is not valid.
    else if (!pwConfInput.checkValidity()) { // since custom validity is reset, .checkValidity always just checks the vanilla HTML condition
      errorMsg = pwConfInput.validationMessage;
    } else if (!regExp.test(pwConfInput.value)) {
      errorMsg = "Password must contain either '!' or '@'.";
      pwConfInput.setCustomValidity(errorMsg);
    } else {
      errorMsg = "";
    }

    pwConfError.textContent = errorMsg;
  }

  function handleFormSubmit() {
    setErrorMsg();
    const isValid = pwConfInput.reportValidity();
    return isValid;
  }

  return {
    init,
    setErrorMsg,
    handleFormSubmit,
  };
})();

const countryValidator = (() => {
  const countryInput = form.querySelector("#form-country");
  const countryError = form.querySelector("#form-country + .error-msg");
  const postalInput = form.querySelector("#form-postal-code");

  function init() {
    countryInput.addEventListener("input", () => {
      setErrorMsg();
      if (postalInput)
        postalInput.dispatchEvent(new CustomEvent("custom:countryInput"));
    });
  }

  function setErrorMsg() {
    countryError.textContent = countryInput.validationMessage; // no custom error validations; just use default
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

const postalValidator = (() => {
  const postalInput = form.querySelector("#form-postal-code");
  const postalError = form.querySelector("#form-postal-code + .error-msg");
  const countryInput = form.querySelector("#form-country");
  const constraints = {
    // @see https://en.wikipedia.org/wiki/List_of_postal_codes
    us: {
      regExp: new RegExp("^\\d{5}(?:-\\d{4})?$"),
      message:
        "United States postal codes must have exactly 5 digits, optionally followed by a '-' and 4 digits.",
    },
    cn: {
      regExp: new RegExp("^\\d{6}$"),
      message: "China postal codes must have exactly 6 digits.",
    },
    vn: {
      regExp: new RegExp("^\\d{5}$"),
      message: "Vietnam postal codes must have exactly 5 digits.",
    },
  };

  function init() {
    postalInput.addEventListener("input", setErrorMsg);
    postalInput.addEventListener("custom:countryInput", setErrorMsg);
  }

  function setErrorMsg() {
    postalInput.setCustomValidity(""); // reset previous custom message set
    let errorMsg;

    const country = countryInput.value;
    const constraint = constraints[country];

    if (!postalInput.checkValidity()) { // since custom validity is reset, .checkValidity always just checks the vanilla HTML condition
      errorMsg = postalInput.validationMessage;
    } 
    else if (!country) {
      errorMsg = "The country must be selected before entering a postal code."; 
      postalInput.setCustomValidity(errorMsg);
    }
    else if (!constraint.regExp.test(postalInput.value)) {
      errorMsg = constraint.message;
      postalInput.setCustomValidity(errorMsg);
    } 
    else {
      errorMsg = "";
    }

    postalError.textContent = errorMsg;
  }

  function handleFormSubmit() {
    setErrorMsg();
    const isValid = postalInput.reportValidity();
    return isValid;
  }

  return {
    init,
    handleFormSubmit,
  };
})();

emailValidator.init();
pwValidator.init();
pwConfValidator.init();
countryValidator.init();
postalValidator.init();
form.addEventListener("submit", handleSubmit);

function handleSubmit(evt) {
  evt.preventDefault();
  highFive.textContent = "";

  let formValid = true;
  const inputValidators = [
    emailValidator,
    pwValidator,
    pwConfValidator,
    countryValidator,
    postalValidator,
  ].reverse(); // reverse for `reportValidity` to report on the first invalid field
  inputValidators.forEach((validator) => {
    const inputValid = validator.handleFormSubmit();
    if (!inputValid) formValid = false;
  });

  // simulate the data being submitted
  if (formValid) {
    highFive.textContent = "High five!";
    form.reset();
  }
}
