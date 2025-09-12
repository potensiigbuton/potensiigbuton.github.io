// script/region.js
// Generic script: load CSV (path di window.CSV_PATH atau 'DataIG_Final.csv')
// dan isi tabel + dropdown filter berdasarkan kolom "Kabupaten".
// Jika window.TARGET_KABUPATEN didefinisikan, dropdown akan preselect ke value tersebut.

(function () {
  document.addEventListener("DOMContentLoaded", () => {
      // Load navbar
  const navbarContainer = document.getElementById("navbar");
  if (navbarContainer) {
    fetch("../components/navbar.html")
      .then(response => response.text())
      .then(data => {
        navbarContainer.innerHTML = data;

        // Tandai link aktif
        const currentPath = window.location.pathname;
        document.querySelectorAll(".navbar a").forEach(link => {
          if (currentPath.includes(link.getAttribute("href"))) {
            link.classList.add("active");
          }
        });
      })
      .catch(error => console.error("Gagal load navbar:", error));
  }

  // Load footer
  const footerContainer = document.getElementById("footer");
  if (footerContainer) {
    fetch("../components/footer.html")
      .then(response => response.text())
      .then(data => {
        footerContainer.innerHTML = data;
      })
      .catch(error => console.error("Gagal load footer:", error));
  }

    
    const csvPath = (window.CSV_PATH || "DataIG_Final.csv");
    const targetKabRaw = (window.TARGET_KABUPATEN || "").toString().trim();
    const targetKab = targetKabRaw ? targetKabRaw.toLowerCase() : "";
    const selectKab = document.getElementById("filterKabupaten");
    const tableBody = document.querySelector("#data-table tbody");

    if (!selectKab || !tableBody) {
      console.warn("region.js: element #filterKabupaten or #data-table tbody not found.");
      return;
    }

    let allData = [];

    // Load CSV via PapaParse
    if (typeof Papa === "undefined") {
      console.error("PapaParse tidak ditemukan. Pastikan <script src='https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js'></script> di-include.");
      tableBody.innerHTML = `<tr class="no-data"><td colspan="6">Library parsing CSV tidak tersedia.</td></tr>`;
      return;
    }

    Papa.parse(csvPath, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        // normalize header keys and values (trim)
        const normalized = results.data.map(row => {
          const out = {};
          Object.keys(row).forEach(k => {
            const key = (k || "").toString().trim();
            let v = row[k];
            if (typeof v === "string") v = v.trim();
            out[key] = v;
          });
          return out;
        });

        // keep only rows that have a Kabupaten value
        allData = normalized.filter(r => r.Kabupaten && r.Kabupaten.toString().trim() !== "");

        // build unique kabupaten list sorted
        const kabSet = new Set(allData.map(r => r.Kabupaten));
        const kabList = Array.from(kabSet).filter(Boolean).sort((a,b) => a.toString().localeCompare(b.toString(), 'id'));

        // populate select: first option "Semua"
        selectKab.innerHTML = "";
        const optAll = document.createElement("option");
        optAll.value = "";
        optAll.textContent = "Semua";
        selectKab.appendChild(optAll);

        kabList.forEach(k => {
          const opt = document.createElement("option");
          opt.value = k;
          opt.textContent = k;
          selectKab.appendChild(opt);
        });

        // preselect target kabupaten jika ada
        if (targetKab) {
          const match = kabList.find(k => k.toString().trim().toLowerCase() === targetKab);
          if (match) selectKab.value = match;
        }

        render(); // initial render
      },
      error: (err) => {
        console.error("PapaParse error:", err);
        tableBody.innerHTML = `<tr class="no-data"><td colspan="6">Gagal memuat data CSV.</td></tr>`;
      }
    });

    // event
    selectKab.addEventListener("change", render);

    function render() {
      const selected = selectKab.value;
      const filtered = allData.filter(r => {
        if (!selected) return true;
        return (r.Kabupaten || "").toString().trim().toLowerCase() === selected.toString().trim().toLowerCase();
      });

      tableBody.innerHTML = "";
      if (!filtered.length) {
        const tr = document.createElement("tr");
        tr.className = "no-data";
        tr.innerHTML = `<td colspan="6">Tidak ada data ditemukan</td>`;
        tableBody.appendChild(tr);
        return;
      }

      filtered.forEach(r => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${escapeHtml(r.Produk || "-")}</td>
          <td>${escapeHtml(r.Kabupaten || "-")}</td>
          <td>${escapeHtml(r.Kecamatan || "-")}</td>
          <td>${escapeHtml(r.Desa || "-")}</td>
          <td>${escapeHtml(r["Status IG"] || "-")}</td>
          <td>${escapeHtml(r["Status Konservasi"] || "-")}</td>
        `;
        tableBody.appendChild(tr);
      });
    }

    function escapeHtml(str) {
      return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    }
  });
})();
