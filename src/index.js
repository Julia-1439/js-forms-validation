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

const pwConfValidator = (() => {
  const pwInput = form.querySelector("#form-pw");
  const pwConfInput = form.querySelector("#form-pw-confirm");
  const pwConfError = form.querySelector("#form-pw-confirm + .error-msg");
  const regExp = /[!@]/;

  function init() {
    pwConfInput.addEventListener("input", setErrorMsg);
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
    else if (!pwConfInput.checkValidity()) {
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

// the dependency allows the confirm-password field to be validated at the same time as the regular password field (particularly important in the case of checking if they match)
const pwValidator = ((_pwConfValidator) => {
  const pwInput = form.querySelector("#form-pw");
  const pwError = form.querySelector("#form-pw + .error-msg");
  const regExp = /[!@]/;

  // @todo change to use custom events for password confirmation
  function init() {
    pwInput.addEventListener("input", () => {
      setErrorMsg();
      _pwConfValidator.setErrorMsg();
    });
  }

  function setErrorMsg() {
    pwInput.setCustomValidity(""); // reset previous custom message set
    let errorMsg;

    if (!pwInput.checkValidity()) {
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
})(pwConfValidator);

const countryValidator = (() => {
  const countryInput = form.querySelector("#form-country");
  const countryError = form.querySelector("#form-country + .error-msg");
  const postalInput = form.querySelector("#form-postal-code");

  function init() {
    countryInput.addEventListener("input", setErrorMsg);

    if (postalInput)
      countryInput.addEventListener("input", () => {
        postalInput.dispatchEvent(new CustomEvent("custom:countryInput"));
      });
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
    if (constraint === undefined) {
      errorMsg = "";
    }
    else if (!constraint.regExp.test(postalInput.value)) {
      errorMsg = constraint.message;
      postalInput.setCustomValidity(errorMsg);
    } else {
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
