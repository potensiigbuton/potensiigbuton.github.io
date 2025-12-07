// Fungsi untuk load komponen
function loadComponent(file, containerId) {
  fetch(file)
    .then(res => res.text())
    .then(data => {
      document.getElementById(containerId).innerHTML = data;
    })
    .catch(err => console.error("Gagal load:", file, err));
}

// Deteksi apakah halaman di root atau subfolder
const path = window.location.pathname;
const isRoot = path === "/" || (path.endsWith("index.html") && path.split("/").length <= 2);
const prefix = isRoot ? "components/" : "../components/";

// Load navbar & footer sesuai lokasi
loadComponent(prefix + "navbar.html", "navbar-container");
loadComponent(prefix + "footer.html", "footer-container");

// ==============================
// CSV + Filter Kabupaten & Kecamatan
// ==============================
const csvFile = isRoot ? "assets/DataIG_Final_Update.csv" : "../assets/DataIG_Final_Update.csv";
const kabupatenTarget = document.body.getAttribute("data-kabupaten"); // ⭐ target kabupaten dari halaman
let tableData = [];

function loadCSV() {
  Papa.parse(csvFile, {
    download: true,
    header: true,
    complete: function (results) {
      tableData = results.data;

      if (kabupatenTarget) {
        // ⭐ Jika ada target kabupaten, langsung filter
        populateKecamatan(kabupatenTarget);
        const filtered = tableData.filter(row => row.Kabupaten === kabupatenTarget);
        renderTable(filtered);

        // ⭐ Sembunyikan dropdown kabupaten (jika ada)
        const kabFilter = document.getElementById("kabupaten-filter");
        if (kabFilter) kabFilter.style.display = "none";
      } else {
        // ⭐ Mode normal (semua kabupaten)
        populateKabupaten();
        renderTable(tableData);
      }
    }
  });
}

function populateKabupaten() {
  const kabSelect = document.getElementById("kabupaten");
  if (!kabSelect) return;

  const kabupatenList = [...new Set(tableData.map(row => row.Kabupaten).filter(Boolean))];

  kabupatenList.forEach(kab => {
    const option = document.createElement("option");
    option.value = kab;
    option.textContent = kab;
    kabSelect.appendChild(option);
  });

  kabSelect.addEventListener("change", filterTable);
}

function populateKecamatan(selectedKabupaten) {
  const kecSelect = document.getElementById("kecamatan");
  if (!kecSelect) return;

  kecSelect.innerHTML = "<option value=''>-- Semua Kecamatan --</option>";

  const filteredKecamatan = [
    ...new Set(
      tableData
        .filter(row => !selectedKabupaten || row.Kabupaten === selectedKabupaten)
        .map(row => row.Kecamatan)
        .filter(Boolean)
    )
  ];

  filteredKecamatan.forEach(kec => {
    const option = document.createElement("option");
    option.value = kec;
    option.textContent = kec;
    kecSelect.appendChild(option);
  });

  kecSelect.addEventListener("change", filterTable);
}

function filterTable() {
  const selectedKab = kabupatenTarget || document.getElementById("kabupaten")?.value || ""; // ⭐ pakai kabupatenTarget kalau ada
  const selectedKec = document.getElementById("kecamatan")?.value || "";

  let filteredData = tableData;

  if (selectedKab) {
    filteredData = filteredData.filter(row => row.Kabupaten === selectedKab);
    populateKecamatan(selectedKab);
  } else {
    populateKecamatan("");
  }

  if (selectedKec) {
    filteredData = filteredData.filter(row => row.Kecamatan === selectedKec);
  }

  renderTable(filteredData);
}

function renderTable(data) {
  const tbody = document.querySelector("#data-table tbody");
  if (!tbody) return;

  tbody.innerHTML = "";

  data.forEach(row => {
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

// Jalankan
document.addEventListener("DOMContentLoaded", loadCSV);
