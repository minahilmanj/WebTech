document.addEventListener("DOMContentLoaded", () => {
  const buyNowBtn = document.getElementById("buyNowBtn");

  if (buyNowBtn) {
    buyNowBtn.addEventListener("click", (e) => {
      e.preventDefault(); // prevent default anchor action
            window.location.href = "checkout.html";
    });
  } else {
    console.error("Buy Now button not found!");
  }
});
