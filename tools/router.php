<?php
// router.php
$path = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);
$file = __DIR__ . $path;

if ($path !== '/' && file_exists($file) && !is_dir($file)) {
  // Headers anti-cache para desarrollo
  $ext = pathinfo($file, PATHINFO_EXTENSION);
  if (in_array($ext, ['html','htm','js','css','json'])) {
    header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
  }
  return false; // que php -S entregue el archivo
}

// fallback: servir admin.html o index.html según ruta
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
readfile(__DIR__ . '/admin.html');  // o 'index.html'
