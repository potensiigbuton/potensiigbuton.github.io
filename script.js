document.addEventListener("DOMContentLoaded", function () {
  let allData = [];

  // load CSV
  Papa.parse("assets/DataIG_Final.csv", {
    download: true,
    header: true,
    complete: function (results) {
      allData = results.data.filter(row => row.Produk && row.Kabupaten);
      populateFilters(allData);
      renderTable(allData);
    }
  });

  // isi filter dropdown kabupaten & kecamatan
  function populateFilters(data) {
    const kabupatenSet = new Set(data.map(row => row.Kabupaten).filter(Boolean));
    const kecamatanSet = new Set(data.map(row => row.Kecamatan).filter(Boolean));

    const kabupatenSelect = document.getElementById("filterKabupaten");
    const kecamatanSelect = document.getElementById("filterKecamatan");

    kabupatenSet.forEach(kab => {
      let opt = document.createElement("option");
      opt.value = kab;
      opt.textContent = kab;
      kabupatenSelect.appendChild(opt);
    });

    kecamatanSet.forEach(kec => {
      let opt = document.createElement("option");
      opt.value = kec;
      opt.textContent = kec;
      kecamatanSelect.appendChild(opt);
    });

    kabupatenSelect.addEventListener("change", applyFilters);
    kecamatanSelect.addEventListener("change", applyFilters);
  }

  // render tabel berdasarkan filter
  function renderTable(data) {
    const tbody = document.querySelector("#data-table tbody");
    tbody.innerHTML = "";

    data.forEach(row => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${row.Produk}</td>
        <td>${row.Kabupaten}</td>
        <td>${row.Kecamatan}</td>
        <td>${row.Desa}</td>
        <td>${row["Status IG"] || "-"}</td>
        <td>${row["Status Konservasi"] || "-"}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  // filter data
  function applyFilters() {
    const kabupatenFilter = document.getElementById("filterKabupaten").value;
    const kecamatanFilter = document.getElementById("filterKecamatan").value;

    let filtered = allData;

    if (kabupatenFilter) {
      filtered = filtered.filter(row => row.Kabupaten === kabupatenFilter);
    }
    if (kecamatanFilter) {
      filtered = filtered.filter(row => row.Kecamatan === kecamatanFilter);
    }

    renderTable(filtered);
  }
});
