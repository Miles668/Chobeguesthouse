const container = document.getElementById("guesthouse-container");
const searchInput = document.getElementById("search");

// --- Render Function ---
function renderGuesthouses(list) {
  container.innerHTML = "";
  
  if(list.length === 0) {
    container.innerHTML = "<p style='grid-column: 1/-1; text-align: center; padding: 20px;'>No guesthouses found.</p>";
    return;
  }

  list.forEach(g => {
    const card = document.createElement("div");
    card.className = "card";

    // Create the Card HTML (Clean & Minimal)
    // Only shows Image, Name, Location, and Explore Button
    card.innerHTML = `
      <img src="${g.images[0]}" alt="${g.name}" loading="lazy">
      <div class="card-body">
        <h3>${g.name}</h3>
        <p class="location">📍 ${g.location}</p>
        <button class="explore-btn" onclick="openFullModal('${g.id}')">Explore Guesthouse</button>
      </div>
    `;

    container.appendChild(card);
  });
}

// --- Modal Logic ---
const modal = document.getElementById("photo-modal");
const slider = document.getElementById("modal-slider");
const countDisplay = document.getElementById("photo-count");
const closeBtn = document.querySelector(".close");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

// Elements for details
const mTitle = document.getElementById("modal-title");
const mLocation = document.getElementById("modal-location");
const mPrice = document.getElementById("modal-price");
const mAmenities = document.getElementById("modal-amenities");
const mButtons = document.getElementById("modal-buttons");

let currentGuesthouse = null;
let currentImgIndex = 0;

// Function called by the "Explore" button
function openFullModal(id) {
  // Find data
  currentGuesthouse = guesthouses.find(g => g.id === id);
  if (!currentGuesthouse) return;

  currentImgIndex = 0;

  // 1. Populate Text Details
  mTitle.textContent = currentGuesthouse.name;
  mLocation.textContent = currentGuesthouse.location;
  
  // Price (Handling generic 'Room' or specific types)
  const roomPrice = currentGuesthouse.rooms[0] ? currentGuesthouse.rooms[0].price : "N/A";
  mPrice.textContent = `Starting from P ${roomPrice} / night`;

  // Amenities
  mAmenities.innerHTML = "";
  currentGuesthouse.amenities.forEach(am => {
    const span = document.createElement("span");
    span.textContent = am;
    mAmenities.appendChild(span);
  });

  // Buttons (Book & Call)
  mButtons.innerHTML = `
    <a href="https://wa.me/${currentGuesthouse.phone}?text=Hello, I saw your guest house listing on Accolink and i would like to make a booking. Is it available?" target="_blank" class="btn-book">Book on WhatsApp</a>
    <a href="tel:+${currentGuesthouse.phone}" class="btn-call">Call Now</a>
  `;

  // 2. Show Modal & First Image
  modal.style.display = "flex";
  updateSlider();
}

function updateSlider() {
  const images = currentGuesthouse.images;
  slider.innerHTML = `<img src="${images[currentImgIndex]}" />`;
  countDisplay.textContent = `${currentImgIndex + 1} / ${images.length}`;
}

// Slider Controls
nextBtn.onclick = () => {
  if (!currentGuesthouse) return;
  currentImgIndex = (currentImgIndex + 1) % currentGuesthouse.images.length;
  updateSlider();
};

prevBtn.onclick = () => {
  if (!currentGuesthouse) return;
  currentImgIndex = (currentImgIndex - 1 + currentGuesthouse.images.length) % currentGuesthouse.images.length;
  updateSlider();
};

// Close Modal
closeBtn.onclick = () => modal.style.display = "none";
window.onclick = (e) => {
  if (e.target === modal) modal.style.display = "none";
};

// --- Search Filter ---
searchInput.addEventListener("input", e => {
  const term = e.target.value.toLowerCase();
  const filtered = guesthouses.filter(g =>
    g.name.toLowerCase().includes(term) ||
    g.location.toLowerCase().includes(term) ||
    g.amenities.some(a => a.toLowerCase().includes(term))
  );
  renderGuesthouses(filtered);
});

// --- Initial Render ---
if (typeof guesthouses !== 'undefined') {
  renderGuesthouses(guesthouses);
} else {
  console.error("Guesthouses data not loaded!");
}
