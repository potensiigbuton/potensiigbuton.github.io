<?php
$file = fopen("../DataIG_Final.csv", "r");
?>
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Data IG - Kabupaten Buton Tengah</title>
  <link rel="stylesheet" href="../style/style.css">
</head>
<body>
  <header>
    <h1>Indikasi Geografis - Kabupaten Buton Tengah</h1>
  </header>
  <div class="container">
    <table>
      <?php
      if (($header = fgetcsv($file, 1000, ",")) !== false) {
          echo "<thead><tr>";
          foreach ($header as $col) echo "<th>".htmlspecialchars($col)."</th>";
          echo "</tr></thead><tbody>";
      }
      while (($row = fgetcsv($file, 1000, ",")) !== false) {
          if (trim($row[6]) === "Buton Tengah") {
              echo "<tr>";
              foreach ($row as $col) echo "<td>".htmlspecialchars($col)."</td>";
              echo "</tr>";
          }
      }
      fclose($file);
      ?>
    </tbody></table>
  </div>
</body>
</html>
