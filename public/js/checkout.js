$(document).ready(function () {
  // Show card section if "Card" is selected
  $("input[name='payment']").change(function () {
    if ($("#payCard").is(":checked")) {
      $("#cardDetails").slideDown();
    } else {
      $("#cardDetails").slideUp();
    }
  });

  // Form submission validation
  $("#checkoutForm").on("submit", function (e) {
    e.preventDefault();
    let valid = true;

    $(".is-invalid").removeClass("is-invalid");
    $("#paymentError, #termsError").hide();

    const name = $("#fullName").val().trim();
    if (name.length < 3) {
      $("#fullName").addClass("is-invalid");
      valid = false;
    }

    const email = $("#email").val().trim();
    const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailPattern.test(email)) {
      $("#email").addClass("is-invalid");
      valid = false;
    }

    const phone = $("#phone").val().trim();
    if (!/^\d{10,}$/.test(phone)) {
      $("#phone").addClass("is-invalid");
      valid = false;
    }

    if ($("#address").val().trim() === "") {
      $("#address").addClass("is-invalid");
      valid = false;
    }

    if ($("#city").val().trim() === "") {
      $("#city").addClass("is-invalid");
      valid = false;
    }

    const postal = $("#postal").val().trim();
    if (!/^\d{4,6}$/.test(postal)) {
      $("#postal").addClass("is-invalid");
      valid = false;
    }

    if ($("#country").val() === "") {
      $("#country").addClass("is-invalid");
      valid = false;
    }

    if (!$("input[name='payment']:checked").val()) {
      $("#paymentError").show();
      valid = false;
    }

    if ($("#payCard").is(":checked")) {
      if ($("#cardNumber").val().trim() === "") {
        $("#cardNumber").addClass("is-invalid");
        valid = false;
      }
      if ($("#expiry").val().trim() === "") {
        $("#expiry").addClass("is-invalid");
        valid = false;
      }
      if ($("#cvv").val().trim() === "") {
        $("#cvv").addClass("is-invalid");
        valid = false;
      }
    }

    if (!$("#terms").is(":checked")) {
      $("#termsError").show();
      valid = false;
    }

    if (!valid) {
      $("html, body").animate(
        { scrollTop: $(".is-invalid:first").offset()?.top - 100 },
        600
      );
      return;
    }

    alert("✅ Order submitted successfully!");
    this.reset();
    $("#cardDetails").hide();
  });

  $("input, select").on("input change", function () {
    if ($(this).val().trim() !== "") $(this).removeClass("is-invalid");
  });
});
