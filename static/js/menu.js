(function () {
  const menu = document.querySelector(".mobile-nav");
  if (!menu) return;

  // Close the menu when clicking outside of it
  document.addEventListener("click", (e) => {
    if (menu.open && !e.target.closest(".mobile-nav")) {
      menu.open = false;
    }
  });

  // Close the menu on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.open) {
      menu.open = false;
    }
  });
})();
