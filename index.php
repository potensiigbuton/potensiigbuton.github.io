<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Peta Indikasi Geografis Kepulauan Buton</title>
  <link rel="stylesheet" href="style/style.css">
</head>
<body>
  <!-- Header -->
  <header>
    <h1>Peta Indikasi Geografis Kepulauan Buton</h1>
    <p>Website visualisasi berbasis GIS & Tableau untuk menampilkan potensi sumber daya hayati serta status hukum adat di wilayah Kepulauan Buton.</p>
  </header>

  <!-- Navbar -->
  <nav class="navbar">
    <a href="index.php" class="nav-item active">Beranda</a>
    <a href="buton/" class="nav-item">Buton</a>
    <a href="butonselatan/" class="nav-item">Buton Selatan</a>
    <a href="baubau/" class="nav-item">Baubau</a>
    <a href="butontengah/" class="nav-item">Buton Tengah</a>
  </nav>

  <!-- Konten Utama -->
  <div class="container">
    <h2>Deskripsi Website</h2>
    <p>
      Website ini menyajikan peta berbasis GIS dan dashboard Tableau untuk memetakan indikasi geografis, potensi sumber daya hayati, 
      serta data adat yang ada di Kepulauan Buton. Informasi ini ditujukan untuk memberikan kepastian hukum, memperkuat ekonomi lokal, 
      serta mempermudah akses data bagi masyarakat, pemerintah, maupun peneliti.
    </p>

    <!-- Tableau Embed -->
    <div class='tableauPlaceholder' id='viz1757347804259' style='position: relative'>
      <noscript>
        <a href='#'>
          <img alt='Map Indikasi Geografis'
               src='https://public.tableau.com/static/images/In/IndikasiGeografisKepulauanButon/MapIndikasiGeografis/1_rss.png' 
               style='border: none' />
        </a>
      </noscript>
      <object class='tableauViz' style='display:none;'>
        <param name='host_url' value='https%3A%2F%2Fpublic.tableau.com%2F'/>
        <param name='embed_code_version' value='3'/>
        <param name='site_root' value=''/>
        <param name='name' value='IndikasiGeografisKepulauanButon/MapIndikasiGeografis'/>
        <param name='tabs' value='no'/>
        <param name='toolbar' value='yes'/>
        <param name='static_image' value='https://public.tableau.com/static/images/In/IndikasiGeografisKepulauanButon/MapIndikasiGeografis/1.png'/>
        <param name='animate_transition' value='yes'/>
        <param name='display_static_image' value='yes'/>
        <param name='display_spinner' value='yes'/>
        <param name='display_overlay' value='yes'/>
        <param name='display_count' value='yes'/>
        <param name='language' value='id-ID'/>
      </object>
    </div>
    <script type='text/javascript'>
      var divElement = document.getElementById('viz1757347804259');
      var vizElement = divElement.getElementsByTagName('object')[0];
      vizElement.style.width = '100%';
      vizElement.style.height = (divElement.offsetWidth * 0.75) + 'px';
      var scriptElement = document.createElement('script');
      scriptElement.src = 'https://public.tableau.com/javascripts/api/viz_v1.js';
      vizElement.parentNode.insertBefore(scriptElement, vizElement);
    </script>

    <!-- Tabel CSV -->
    <div class="table-container">
      <h2>Data Potensi Indikasi Geografis</h2>

      <!-- Form Pencarian & Filter -->
      <form method="get" class="search-box">
        <input type="text" name="q" placeholder="Cari Produk / Kecamatan / Desa..." value="<?php echo isset($_GET['q']) ? htmlspecialchars($_GET['q']) : ''; ?>">

        <select name="kabupaten">
          <option value="">-- Semua Kabupaten --</option>
          <?php
          // ambil daftar kabupaten unik dari CSV
          $file = fopen("DataIG_Final.csv", "r");
          $header = fgetcsv($file, 1000, ","); // skip header
          $kabupatenList = [];
          while (($row = fgetcsv($file, 1000, ",")) !== false) {
              $kab = trim($row[1]); // asumsi kolom ke-2 = Kabupaten
              if ($kab !== "" && !in_array($kab, $kabupatenList)) {
                  $kabupatenList[] = $kab;
              }
          }
          fclose($file);
          sort($kabupatenList);
          foreach ($kabupatenList as $kab) {
              $selected = (isset($_GET['kabupaten']) && $_GET['kabupaten'] === $kab) ? "selected" : "";
              echo "<option value='".htmlspecialchars($kab)."' $selected>".htmlspecialchars($kab)."</option>";
          }
          ?>
        </select>

        <button type="submit">Filter</button>
        <a href="index.php" class="reset-btn">Reset</a>
      </form>

      <?php
      $query = isset($_GET['q']) ? strtolower(trim($_GET['q'])) : "";
      $filterKab = isset($_GET['kabupaten']) ? trim($_GET['kabupaten']) : "";

      $file = fopen("DataIG_Final.csv", "r");
      if ($file !== false) {
          // baca header
          $header = fgetcsv($file, 1000, ",");
          // cari index kolom yg dibutuhkan
          $idxProduk = array_search("Produk", $header);
          $idxKab = array_search("Kabupaten", $header);
          $idxKec = array_search("Kecamatan", $header);
          $idxDesa = array_search("Desa", $header);
          $idxIG = array_search("Status IG", $header);
          $idxKonservasi = array_search("Status Konservasi", $header);

          echo "<table>";
          echo "<thead><tr>
                  <th>Produk</th>
                  <th>Kabupaten</th>
                  <th>Kecamatan</th>
                  <th>Desa</th>
                  <th>Status IG</th>
                  <th>Status Konservasi</th>
                </tr></thead><tbody>";

          $found = false;
          while (($row = fgetcsv($file, 1000, ",")) !== false) {
              $produk = $row[$idxProduk];
              $kab = $row[$idxKab];
              $kec = $row[$idxKec];
              $desa = $row[$idxDesa];
              $ig = $row[$idxIG];
              $konservasi = $row[$idxKonservasi];

              $line = strtolower("$produk $kab $kec $desa $ig $konservasi");

              if (
                  ($query === "" || strpos($line, $query) !== false) &&
                  ($filterKab === "" || $kab === $filterKab)
              ) {
                  echo "<tr>
                          <td>".htmlspecialchars($produk)."</td>
                          <td>".htmlspecialchars($kab)."</td>
                          <td>".htmlspecialchars($kec)."</td>
                          <td>".htmlspecialchars($desa)."</td>
                          <td>".htmlspecialchars($ig)."</td>
                          <td>".htmlspecialchars($konservasi)."</td>
                        </tr>";
                  $found = true;
              }
          }
          if (!$found) {
              echo "<tr><td colspan='6'>Tidak ada data ditemukan</td></tr>";
          }
          echo "</tbody></table>";
          fclose($file);
      } else {
          echo "<p>Tidak dapat membuka file CSV.</p>";
      }
      ?>
    </div>
  </div>

  <!-- Footer -->
  <footer>
    <p>&copy; 2025 Peta Adat & Indikasi Geografis Kepulauan Buton. Semua Hak Dilindungi.</p>
  </footer>
</body>
</html>
