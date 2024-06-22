document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll(".navbar-nav .nav-link");

  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      // Remove 'active' class from all links
      navLinks.forEach((link) => {
        link.classList.remove("active");
      });

      // Add 'active' class to the clicked link
      this.classList.add("active");
    });
  });
});

// go to top button
// Show the "Go to Top" button when scrolling down
window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    document.querySelector(".go-top").style.display = "block";
  } else {
    document.querySelector(".go-top").style.display = "none";
  }
}

// Scroll to the top of the document when the "Go to Top" button is clicked
document.querySelector(".go-top").addEventListener("click", function (e) {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
});
