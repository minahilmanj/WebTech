// checkout-validation.js
$(document).ready(function () {
  // Find the checkout form 
  var $form = $("form.needs-validation").first();

  // If no id, give a predictable id so debugging is easier (doesn't change HTML file)
  if (!$form.attr("id")) $form.attr("id", "checkoutFormAuto");

  // Ensure each input/select/textarea that lacks a name gets a name = id
  $form.find("input, select, textarea").each(function () {
    var $el = $(this);
    if (!$el.attr("name")) {
      // If element has an id, use it as name; otherwise generate a unique name
      var id = $el.attr("id");
      if (id) {
        $el.attr("name", id);
      } else {
        // generate fallback name
        var fallback = "fld_" + Math.random().toString(36).substring(2, 9);
        $el.attr("name", fallback);
      }
    }
  });

  // Ensure payment radios have values (use their ids as values)
  $form.find("input[type=radio][name='paymentMethod']").each(function () {
    var $r = $(this);
    if (!$r.attr("value")) {
      var rid = $r.attr("id");
      if (rid) $r.val(rid);
    }
  });

  // Identify the card fields container (we can't change HTML, so set id here)
  // We look for the card number input by placeholder and mark its nearest row as card section
  var $cardNumber = $form.find("input[placeholder='xxxx-xxxx-xxxx-xxxx']");
  var $cardSection;
  if ($cardNumber.length) {
    $cardSection = $cardNumber.closest(".row");
    $cardSection.attr("id", "cardSection");
  } else {
    // fallback: try to find by labels (Cardholder Name text)
    $cardSection = $form.find("label:contains('Cardholder Name')").closest(".row");
    if ($cardSection.length) $cardSection.attr("id", "cardSection");
  }

  // Give sensible names to card inputs if they exist (so validation rules can reference them)
  // Prefer existing ids (they were missing in the provided HTML), else use name already added above
  var $cardHolder = $cardSection ? $cardSection.find("input").eq(0) : $();
  var $cardNum = $cardSection ? $cardSection.find("input").filter(function () {
    return $(this).attr("placeholder") && $(this).attr("placeholder").indexOf("xxxx") !== -1;
  }).first() : $();
  var $cardExpiry = $cardSection ? $cardSection.find("input[placeholder='MM/YY']") : $();
  var $cardCvv = $cardSection ? $cardSection.find("input[placeholder='123']") : $();

  if ($cardHolder.length && !$cardHolder.attr("name")) $cardHolder.attr("name", $cardHolder.attr("id") || "cardholderName");
  if ($cardNum.length && !$cardNum.attr("name")) $cardNum.attr("name", $cardNum.attr("id") || "cardNumber");
  if ($cardExpiry.length && !$cardExpiry.attr("name")) $cardExpiry.attr("name", $cardExpiry.attr("id") || "expiry");
  if ($cardCvv.length && !$cardCvv.attr("name")) $cardCvv.attr("name", $cardCvv.attr("id") || "cvv");

  // Create validation rules using the element names (we used id->name earlier)
  var rules = {};
  var messages = {};

  // Basic profile / address fields (use names generated above)
  rules[$("#firstName").attr("name")] = { required: true, minlength: 2 };
  messages[$("#firstName").attr("name")] = { required: "First name is required.", minlength: "At least 2 characters." };

  rules[$("#lastName").attr("name")] = { required: true, minlength: 2 };
  messages[$("#lastName").attr("name")] = { required: "Last name is required.", minlength: "At least 2 characters." };

  rules[$("#email").attr("name")] = { required: true, email: true };
  messages[$("#email").attr("name")] = { required: "Email required.", email: "Enter a valid email." };

  rules[$("#phone").attr("name")] = { required: true, digits: true, minlength: 10, maxlength: 15 };
  messages[$("#phone").attr("name")] = { required: "Phone number required.", digits: "Only digits.", minlength: "Enter at least 10 digits." };

  rules[$("#address").attr("name")] = { required: true };
  messages[$("#address").attr("name")] = { required: "Address required." };

  rules[$("#city").attr("name")] = { required: true };
  messages[$("#city").attr("name")] = { required: "City required." };

  rules[$("#postal").attr("name")] = { required: true, digits: true, minlength: 4, maxlength: 6 };
  messages[$("#postal").attr("name")] = { required: "Postal code required.", digits: "Only digits.", minlength: "At least 4 digits.", maxlength: "No more than 6 digits." };

  rules[$("#country").attr("name")] = { required: true };
  messages[$("#country").attr("name")] = { required: "Please select a country." };

  // Payment method (radio)
  var pmName = $form.find("input[type=radio][name='paymentMethod']").first().attr("name");
  if (pmName) {
    rules[pmName] = { required: true };
    messages[pmName] = { required: "Choose a payment method." };
  }

  // Card-specific rules (will be enforced only when card is chosen)
  if ($cardHolder.length) {
    rules[$cardHolder.attr("name")] = { required: function () { return $("input[type=radio][name='paymentMethod']:checked").val() === "card"; }, minlength: 3 };
    messages[$cardHolder.attr("name")] = { required: "Cardholder name required." };
  }
  if ($cardNum.length) {
    rules[$cardNum.attr("name")] = {
      required: function () { return $("input[type=radio][name='paymentMethod']:checked").val() === "card"; },
      creditcard: true
    };
    messages[$cardNum.attr("name")] = { required: "Card number required.", creditcard: "Enter a valid card number." };
  }
  if ($cardExpiry.length) {
    // simple MM/YY pattern
    rules[$cardExpiry.attr("name")] = {
      required: function () { return $("input[type=radio][name='paymentMethod']:checked").val() === "card"; },
      pattern: /^(0[1-9]|1[0-2])\/\d{2}$/
    };
    messages[$cardExpiry.attr("name")] = { required: "Expiry required.", pattern: "Use MM/YY format." };
  }
  if ($cardCvv.length) {
    rules[$cardCvv.attr("name")] = {
      required: function () { return $("input[type=radio][name='paymentMethod']:checked").val() === "card"; },
      digits: true,
      minlength: 3,
      maxlength: 4
    };
    messages[$cardCvv.attr("name")] = { required: "CVV required.", digits: "Only digits.", minlength: "3 or 4 digits.", maxlength: "3 or 4 digits." };
  }

  // Initialize jQuery Validate
  $form.validate({
    rules: rules,
    messages: messages,
    errorClass: "is-invalid",
    validClass: "is-valid",
    errorPlacement: function (error, element) {
      // Bootstrap-friendly placement: put the invalid-feedback after the input if no label exists
      if (element.closest(".input-group").length) {
        error.insertAfter(element.closest(".input-group"));
      } else {
        error.insertAfter(element);
      }
    },
    highlight: function (element, errorClass, validClass) {
      $(element).addClass(errorClass).removeClass(validClass);
      $(element).closest(".form-check").find("input").addClass(errorClass).removeClass(validClass);
    },
    unhighlight: function (element, errorClass, validClass) {
      $(element).removeClass(errorClass).addClass(validClass);
      $(element).closest(".form-check").find("input").removeClass(errorClass).addClass(validClass);
    },
    submitHandler: function (form) {
      // show a success message then submit
      alert("✅ Order Placed Successfully!");
      form.submit();
    }
  });

  // Payment method change handler: show/hide card section
  $form.find("input[type=radio][name='paymentMethod']").on("change", function () {
    var val = $(this).val();
    if (val === "card") {
      if ($cardSection && $cardSection.length) {
        $cardSection.slideDown(200);
        // mark card inputs required for HTML5 too (so browser shows native hints if needed)
        $cardSection.find("input").prop("required", true);
      }
    } else {
      if ($cardSection && $cardSection.length) {
        $cardSection.slideUp(200);
        $cardSection.find("input").prop("required", false).removeClass("is-invalid is-valid");
        // clear validation errors for card inputs in jQuery Validate
        $cardSection.find("input").each(function () {
          $(this).valid(); // triggers re-validation (will pass when not required)
        });
      }
    }
  });

  // Trigger change initially to set correct visibility based on default selection
  $form.find("input[type=radio][name='paymentMethod']:checked").trigger("change");
});
