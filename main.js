const icons = {
  WiFi:"fa-wifi",
  TV:"fa-tv",
  Security:"fa-shield-halved",
  Breakfast:"fa-mug-hot",
  "DStv":"fa-tv",
  "Victoria Falls Transfers":"fa-car",
  "Swimming Pool":"fa-person-swimming",
  "Game Drives":"fa-tree",
  "Boat Cruise":"fa-ship",
  "Parking":"fa-parking"
};

const fallbackImage = "https://via.placeholder.com/600x400?text=No+Image";

function render(data){
  const container = document.getElementById("listings");
  container.innerHTML = "";

  data.forEach(g => {
    const imgs = g.images.map((img, j) =>
      `<img src="${img}" onerror="this.src='${fallbackImage}'" class="${j===0?'active':''}">`
    ).join("");

    const am = g.amenities?.map(a =>
      `<div class="amenity">
        <i class="fa-solid ${icons[a] || 'fa-circle-check'}"></i>${a}
      </div>`
    ).join("") || "";

    const roomsHTML = g.rooms?.map(r =>
      `<p>${r.name}: P ${r.price} / night</p>`
    ).join("") || "";

    container.innerHTML += `
      <div class="card">
        <div class="slider">
          ${imgs}
          <button class="prev">❮</button>
          <button class="next">❯</button>
        </div>

        <div class="card-body">
          <h2>${g.name}</h2>
          <p>${g.location}</p>
          <div class="rooms">${roomsHTML}</div>
          <div class="amenities">${am}</div>

          <div class="actions">
            <a class="whatsapp" target="_blank"
              href="https://wa.me/${g.phone}?text=Hello%20I%20saw%20your%20guesthouse%20on%20Accolink.%20Any%20room%20available?">
              WhatsApp
            </a>
            <a class="call" href="tel:+${g.phone}">Call</a>
          </div>
        </div>
      </div>
    `;
  });

  attachSliderControls(); // 👈 IMPORTANT
}

/* ==========================
   Slide logic (unchanged)
========================== */
function slide(slider, dir){
  const imgs = slider.querySelectorAll("img");
  let i = [...imgs].findIndex(img => img.classList.contains("active"));

  imgs[i].classList.remove("active");
  i = (i + dir + imgs.length) % imgs.length;
  imgs[i].classList.add("active");
}

/* ==========================
   Button + Swipe support
========================== */
function attachSliderControls(){
  document.querySelectorAll(".slider").forEach(slider => {

    // Arrow buttons
    slider.querySelector(".prev").onclick = () => slide(slider, -1);
    slider.querySelector(".next").onclick = () => slide(slider, 1);

    // Mobile swipe
    let startX = 0;
    let endX = 0;

    slider.addEventListener("touchstart", e => {
      startX = e.touches[0].clientX;
    });

    slider.addEventListener("touchmove", e => {
      endX = e.touches[0].clientX;
    });

    slider.addEventListener("touchend", () => {
      const diff = endX - startX;
      if (Math.abs(diff) > 50) {
        slide(slider, diff < 0 ? 1 : -1);
      }
    });
  });
}

/* ==========================
   Search
========================== */
document.getElementById("search").addEventListener("input", e => {
  const q = e.target.value.toLowerCase();
  render(
    guesthouses.filter(g =>
      g.name.toLowerCase().includes(q) ||
      g.location.toLowerCase().includes(q) ||
      g.amenities.join(" ").toLowerCase().includes(q) ||
      g.rooms.map(r => r.name).join(" ").toLowerCase().includes(q)
    )
  );
});

render(guesthouses);
