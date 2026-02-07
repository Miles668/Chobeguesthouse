// ----------------------------
// Guesthouse Rendering Script
// ----------------------------

// Ensure DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {

  const container = document.getElementById("guesthouse-container");
  const searchInput = document.getElementById("search");

  const modal = document.getElementById("photo-modal");
  const slider = document.getElementById("modal-slider");
  const countDisplay = document.getElementById("photo-count");
  const closeBtn = document.querySelector(".close");
  const nextBtn = document.getElementById("nextBtn");
  const prevBtn = document.getElementById("prevBtn");

  const mTitle = document.getElementById("modal-title");
  const mLocation = document.getElementById("modal-location");
  const mPrice = document.getElementById("modal-price");
  const mAmenities = document.getElementById("modal-amenities");
  const mButtons = document.getElementById("modal-buttons");

  let currentGuesthouse = null;
  let currentImgIndex = 0;

  // ----------------------------
  // Render Guesthouses
  // ----------------------------
  function renderGuesthouses(list) {
    container.innerHTML = "";

    if (!list || list.length === 0) {
      container.innerHTML = "<p style='grid-column:1/-1;text-align:center;padding:20px;'>No guesthouses found.</p>";
      return;
    }

    list.forEach(g => {
      const card = document.createElement("div");
      card.className = "card";

      const imgSrc = g.images?.[0] || "placeholder.jpg";

      card.innerHTML = `
        <img src="${imgSrc}" alt="${g.name}" loading="lazy">
        <div class="card-body">
          <h3>${g.name}</h3>
          <p class="location">📍 ${g.location}</p>
          <button class="explore-btn">Explore Guesthouse</button>
        </div>
      `;

      // Use JS to attach click instead of inline onclick
      const exploreBtn = card.querySelector(".explore-btn");
      exploreBtn.addEventListener("click", () => openFullModal(g.id));

      container.appendChild(card);
    });
  }

  // ----------------------------
  // Modal Logic
  // ----------------------------
  function openFullModal(id) {
    currentGuesthouse = guesthouses.find(g => g.id === id);
    if (!currentGuesthouse) return;

    currentImgIndex = 0;

    mTitle.textContent = currentGuesthouse.name;
    mLocation.textContent = currentGuesthouse.location;
    const roomPrice = currentGuesthouse.rooms?.[0]?.price || "N/A";
    mPrice.textContent = `Starting from P ${roomPrice} / night`;

    mAmenities.innerHTML = "";
    currentGuesthouse.amenities?.forEach(am => {
      const span = document.createElement("span");
      span.textContent = am;
      mAmenities.appendChild(span);
    });

    mButtons.innerHTML = `
      <a href="https://wa.me/${currentGuesthouse.phone}?text=Hello, I saw your guest house listing on Accolink and I would like to make a booking" target="_blank" class="btn-book">Book on WhatsApp</a>
      <a href="tel:+${currentGuesthouse.phone}" class="btn-call">Call Now</a>
    `;

    modal.style.display = "flex";
    updateSlider();
  }

  function updateSlider() {
    const images = currentGuesthouse.images || [];
    slider.innerHTML = `<img src="${images[currentImgIndex] || 'placeholder.jpg'}" alt="Guesthouse Image">`;
    countDisplay.textContent = `${currentImgIndex + 1} / ${images.length || 1}`;
  }

  nextBtn.addEventListener("click", () => {
    if (!currentGuesthouse) return;
    currentImgIndex = (currentImgIndex + 1) % currentGuesthouse.images.length;
    updateSlider();
  });

  prevBtn.addEventListener("click", () => {
    if (!currentGuesthouse) return;
    currentImgIndex = (currentImgIndex - 1 + currentGuesthouse.images.length) % currentGuesthouse.images.length;
    updateSlider();
  });

  closeBtn.addEventListener("click", () => modal.style.display = "none");
  window.addEventListener("click", e => { if (e.target === modal) modal.style.display = "none"; });

  // ----------------------------
  // Search Filter
  // ----------------------------
  searchInput.addEventListener("input", e => {
    const term = e.target.value.toLowerCase();
    const filtered = guesthouses.filter(g =>
      g.name.toLowerCase().includes(term) ||
      g.location.toLowerCase().includes(term) ||
      g.amenities.some(a => a.toLowerCase().includes(term))
    );
    renderGuesthouses(filtered);
  });

  // ----------------------------
  // Initial Render
  // ----------------------------
  if (typeof guesthouses !== "undefined" && Array.isArray(guesthouses)) {
    renderGuesthouses(guesthouses);
  } else {
    console.error("Guesthouses data not loaded!");
  }

});
