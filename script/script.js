document.addEventListener("DOMContentLoaded", function () {
  // Load navbar & footer
  loadComponent("../components/navbar.html", "navbar-container");
  loadComponent("../components/footer.html", "footer-container");

  // Ambil kabupaten target dari attribute body
  const kabupatenTarget = document.body.getAttribute("data-kabupaten");

  // Load CSV
  Papa.parse("../assets/DataIG_Final.csv", {
    download: true,
    header: true,
    complete: function (results) {
      const data = results.data;

      // Filter data sesuai kabupaten, kalau ada target
      let filteredData = data;
      if (kabupatenTarget && kabupatenTarget !== "all") {
        filteredData = data.filter(
          (row) => row.Kabupaten?.toLowerCase() === kabupatenTarget.toLowerCase()
        );
      }

      renderTable(filteredData);
    },
  });
});

// Fungsi render tabel
function renderTable(data) {
  const tbody = document.querySelector("#data-table tbody");
  if (!tbody) return;

  tbody.innerHTML = "";
  data.forEach((row) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row.Produk || ""}</td>
      <td>${row.Kabupaten || ""}</td>
      <td>${row.Kecamatan || ""}</td>
      <td>${row.Desa || ""}</td>
      <td>${row["Status IG"] || ""}</td>
      <td>${row["Status Konservasi"] || ""}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Fungsi load komponen
function loadComponent(file, containerId) {
  fetch(file)
    .then((res) => res.text())
    .then((html) => {
      document.getElementById(containerId).innerHTML = html;
    });
}
