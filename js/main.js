document.addEventListener("DOMContentLoaded", function () {
  // Dark mode toggle functionality
  const darkModeToggle = document.getElementById("darkModeToggle");
  const htmlElement = document.documentElement;
  // Check for saved dark mode preference
  if (localStorage.getItem("darkMode") === "enabled") {
    htmlElement.classList.add("dark");
    document.body.classList.add("dark");
  }
  darkModeToggle.addEventListener("click", () => {
    htmlElement.classList.toggle("dark");
    document.body.classList.toggle("dark");
    // Save preference
    if (htmlElement.classList.contains("dark")) {
      localStorage.setItem("darkMode", "enabled");
    } else {
      localStorage.setItem("darkMode", null);
    }
  });
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;
      const target = document.querySelector(targetId);
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
  // Newsletter toggle
  const newsletterCheckbox = document.getElementById("newsletter");
  if (newsletterCheckbox) {
    newsletterCheckbox.addEventListener("change", function () {
      const toggleSpan = this.nextElementSibling;
      if (this.checked) {
        toggleSpan.classList.add(
          "peer-checked:bg-primary",
          "peer-checked:before:translate-x-4",
        );
      } else {
        toggleSpan.classList.remove(
          "peer-checked:bg-primary",
          "peer-checked:before:translate-x-4",
        );
      }
    });
  }
  // Modal handling
  const modal = document.getElementById("modal");
  const closeModal = document.getElementById("closeModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalContent = document.getElementById("modalContent");
  // Handle all footer and service links
  document.querySelectorAll("footer a, .service-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href === "#") {
        e.preventDefault();
        const title = this.textContent;
        modalTitle.textContent = title;
        // Simulate content based on link text
        let content = `<p class="mb-4">This is the ${title} page content. We're working on making this content available soon.</p>`;
        content += `<p class="mb-4">For immediate assistance or more information about ${title.toLowerCase()}, please contact our team:</p>`;
        content += `<ul class="list-disc pl-5 mb-4">
<li>Call us: (555) 123-4567</li>
<li>Email: help@plaintechsolutions.com</li>
<li>Visit our office during business hours</li>
</ul>`;
        modalContent.innerHTML = content;
        modal.classList.remove("hidden");
        modal.classList.add("flex");
      }
    });
  });
  // Close modal
  closeModal.addEventListener("click", () => {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  });
  // Close modal when clicking outside
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
    }
  });
  // Handle form submission
  const contactForm = document.querySelector("form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const formData = new FormData(this);
      // Show success message
      modalTitle.textContent = "Message Sent";
      modalContent.innerHTML = `
<div class="text-center">
<div class="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
<i class="ri-check-line ri-2x text-green-500"></i>
</div>
<p class="text-lg mb-4">Thank you for contacting us! We'll get back to you within 24 hours.</p>
<p class="text-gray-600">A confirmation email has been sent to ${formData.get("email")}</p>
</div>
`;
      modal.classList.remove("hidden");
      modal.classList.add("flex");
      this.reset();
    });
  }
});