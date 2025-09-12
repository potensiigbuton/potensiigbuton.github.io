const tableBody = document.querySelector("#data-table tbody");
const filterKabupaten = document.getElementById("filterKabupaten");
const filterKecamatan = document.getElementById("filterKecamatan");
let allData = [];

// Load CSV dengan PapaParse
Papa.parse("../assets/DataIG_Final.csv", {
  download: true,
  header: true,
  complete: function(results) {
    allData = results.data;
    populateFilters();
    renderTable(allData);
  }
});

// Isi dropdown filter
function populateFilters() {
  const kabupatenSet = new Set(allData.map(row => row.Kabupaten).filter(Boolean));
  const kecamatanSet = new Set(allData.map(row => row.Kecamatan).filter(Boolean));

  kabupatenSet.forEach(kab => {
    const opt = document.createElement("option");
    opt.value = kab;
    opt.textContent = kab;
    filterKabupaten.appendChild(opt);
  });

  kecamatanSet.forEach(kec => {
    const opt = document.createElement("option");
    opt.value = kec;
    opt.textContent = kec;
    filterKecamatan.appendChild(opt);
  });
}

// Render tabel
function renderTable(data) {
  tableBody.innerHTML = "";
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
    tableBody.appendChild(tr);
  });
}

// Event filter
filterKabupaten.addEventListener("change", applyFilters);
filterKecamatan.addEventListener("change", applyFilters);

function applyFilters() {
  const kabVal = filterKabupaten.value;
  const kecVal = filterKecamatan.value;
  const filtered = allData.filter(row => {
    return (kabVal === "" || row.Kabupaten === kabVal) &&
           (kecVal === "" || row.Kecamatan === kecVal);
  });
  renderTable(filtered);
}
