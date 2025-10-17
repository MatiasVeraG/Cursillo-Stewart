<?php
/**
 * API para gestión de ingresantes - Cursillo Stewart
 * Endpoints:
 * - POST ?action=import_ingresantes
 * - GET ?action=list_exams  
 * - GET ?action=get_ingresantes&key=EXAMEN-AÑO
 */

// Configuración
error_reporting(E_ALL);
ini_set('display_errors', 0);

// Directorios
define('DATA_DIR', __DIR__ . '/../data/ingresantes/');
define('INDEX_FILE', DATA_DIR . 'index.json');

// Headers CORS y JSON
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

// Manejar preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Función para logging de errores
function logError($message) {
    error_log('[Ingresantes API] ' . $message);
}

// Función para respuestas JSON
function sendResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    exit();
}

// Función para leer el índice
function readIndex() {
    if (!file_exists(INDEX_FILE)) {
        return [];
    }
    
    $content = file_get_contents(INDEX_FILE);
    if ($content === false) {
        logError('No se pudo leer el archivo índice');
        return [];
    }
    
    $data = json_decode($content, true);
    return is_array($data) ? $data : [];
}

// Función para escribir el índice
function writeIndex($data) {
    $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    
    $result = file_put_contents(INDEX_FILE, $json, LOCK_EX);
    if ($result === false) {
        logError('No se pudo escribir el archivo índice');
        return false;
    }
    
    return true;
}

// Función para normalizar el campo preferencial
function normalizePreferencial($value) {
    if (is_bool($value)) {
        return $value;
    }
    
    if (is_numeric($value)) {
        return (int)$value === 1;
    }
    
    if (is_string($value)) {
        $lower = strtolower(trim($value));
        return in_array($lower, ['si', 'sí', 'true', '1', 'yes']);
    }
    
    return false;
}

// Función para ordenar las claves de exámenes
function sortExamKeys($keys) {
    usort($keys, function($a, $b) {
        // Extraer año y examen de la clave EXAMEN-AÑO
        $partsA = explode('-', $a);
        $partsB = explode('-', $b);
        
        if (count($partsA) !== 2 || count($partsB) !== 2) {
            return strcmp($a, $b);
        }
        
        $yearA = (int)$partsA[1];
        $yearB = (int)$partsB[1];
        $examA = $partsA[0];
        $examB = $partsB[0];
        
        // Primero por año descendente
        if ($yearA !== $yearB) {
            return $yearB - $yearA;
        }
        
        // Luego por examen ascendente
        return strcmp($examA, $examB);
    });
    
    return $keys;
}

// Validar directorio de datos
if (!is_dir(DATA_DIR)) {
    if (!mkdir(DATA_DIR, 0755, true)) {
        logError('No se pudo crear el directorio de datos');
        sendResponse(['error' => 'Error interno del servidor'], 500);
    }
}

// Obtener acción
$action = $_GET['action'] ?? '';

try {
    switch ($action) {
        case 'import_ingresantes':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                sendResponse(['error' => 'Método no permitido'], 405);
            }
            
            // Leer datos del POST
            $input = file_get_contents('php://input');
            if (empty($input)) {
                sendResponse(['error' => 'No se recibieron datos'], 400);
            }
            
            $data = json_decode($input, true);
            if (!$data) {
                sendResponse(['error' => 'JSON inválido'], 400);
            }
            
            // Validar campos requeridos
            $requiredFields = ['exam', 'year', 'meta', 'items'];
            foreach ($requiredFields as $field) {
                if (!isset($data[$field])) {
                    sendResponse(['error' => "Campo requerido faltante: $field"], 400);
                }
            }
            
            // Generar clave
            $key = $data['exam'] . '-' . $data['year'];
            
            // Normalizar items
            $normalizedItems = [];
            foreach ($data['items'] as $item) {
                $normalizedItem = [
                    'nombre' => $item['nombre'] ?? '',
                    'puntaje' => (float)($item['puntaje'] ?? 0),
                    'carrera' => $item['carrera'] ?? '',
                    'puesto' => (int)($item['puesto'] ?? 0),
                    'preferencial' => normalizePreferencial($item['preferencial'] ?? false)
                ];
                $normalizedItems[] = $normalizedItem;
            }
            
            // Crear estructura completa
            $fileData = [
                'key' => $key,
                'exam' => $data['exam'],
                'year' => (int)$data['year'],
                'meta' => [
                    'archivo' => $data['meta']['archivo'] ?? '',
                    'total' => count($normalizedItems),
                    'fecha' => date('c')
                ],
                'items' => $normalizedItems
            ];
            
            // Guardar archivo de datos
            $filename = DATA_DIR . $key . '.json';
            $json = json_encode($fileData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
            
            if (file_put_contents($filename, $json, LOCK_EX) === false) {
                logError("No se pudo escribir el archivo: $filename");
                sendResponse(['error' => 'Error al guardar los datos'], 500);
            }
            
            // Actualizar índice
            $index = readIndex();
            if (!in_array($key, $index)) {
                $index[] = $key;
                $index = sortExamKeys($index);
                
                if (!writeIndex($index)) {
                    sendResponse(['error' => 'Error al actualizar el índice'], 500);
                }
            }
            
            sendResponse(['ok' => true, 'key' => $key]);
            break;
            
        case 'list_exams':
            if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
                sendResponse(['error' => 'Método no permitido'], 405);
            }
            
            $index = readIndex();
            $sortedIndex = sortExamKeys($index);
            sendResponse($sortedIndex);
            break;
            
        case 'get_ingresantes':
            if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
                sendResponse(['error' => 'Método no permitido'], 405);
            }
            
            $key = $_GET['key'] ?? '';
            if (empty($key)) {
                sendResponse(['error' => 'Parámetro key requerido'], 400);
            }
            
            $filename = DATA_DIR . $key . '.json';
            if (!file_exists($filename)) {
                sendResponse(['error' => 'Lista no encontrada'], 404);
            }
            
            $content = file_get_contents($filename);
            if ($content === false) {
                logError("No se pudo leer el archivo: $filename");
                sendResponse(['error' => 'Error al leer los datos'], 500);
            }
            
            $data = json_decode($content, true);
            if (!$data) {
                logError("JSON inválido en archivo: $filename");
                sendResponse(['error' => 'Datos corruptos'], 500);
            }
            
            sendResponse($data);
            break;
            
        case 'delete_ingresantes':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                sendResponse(['error' => 'Método no permitido'], 405);
            }
            
            $key = $_GET['key'] ?? '';
            if (empty($key)) {
                sendResponse(['error' => 'Parámetro key requerido'], 400);
            }
            
            $filename = DATA_DIR . $key . '.json';
            if (!file_exists($filename)) {
                sendResponse(['error' => 'Lista no encontrada'], 404);
            }
            
            // Eliminar archivo
            if (!unlink($filename)) {
                logError("No se pudo eliminar el archivo: $filename");
                sendResponse(['error' => 'Error al eliminar el archivo'], 500);
            }
            
            // Actualizar índice
            $index = readIndex();
            $index = array_values(array_filter($index, function($item) use ($key) {
                return $item !== $key;
            }));
            
            if (!writeIndex($index)) {
                sendResponse(['error' => 'Error al actualizar el índice'], 500);
            }
            
            sendResponse(['ok' => true]);
            break;
            
        case 'update_ingresantes':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                sendResponse(['error' => 'Método no permitido'], 405);
            }
            
            $input = file_get_contents('php://input');
            if (empty($input)) {
                sendResponse(['error' => 'No se recibieron datos'], 400);
            }
            
            $data = json_decode($input, true);
            if (!$data || !isset($data['key'])) {
                sendResponse(['error' => 'JSON inválido o falta campo key'], 400);
            }
            
            $oldKey = $data['key'];
            $oldFilename = DATA_DIR . $oldKey . '.json';
            
            if (!file_exists($oldFilename)) {
                sendResponse(['error' => 'Lista no encontrada'], 404);
            }
            
            // Leer datos existentes
            $existingData = json_decode(file_get_contents($oldFilename), true);
            if (!$existingData) {
                sendResponse(['error' => 'Error al leer datos existentes'], 500);
            }
            
            // Actualizar campos proporcionados
            $updatedExam = $data['exam'] ?? $existingData['exam'];
            $updatedYear = $data['year'] ?? $existingData['year'];
            $newKey = $updatedExam . '-' . $updatedYear;
            
            // Normalizar items si se proporcionaron
            $updatedItems = $existingData['items'];
            if (isset($data['items'])) {
                $updatedItems = [];
                foreach ($data['items'] as $item) {
                    $normalizedItem = [
                        'nombre' => $item['nombre'] ?? '',
                        'puntaje' => (float)($item['puntaje'] ?? 0),
                        'carrera' => $item['carrera'] ?? '',
                        'puesto' => (int)($item['puesto'] ?? 0),
                        'preferencial' => normalizePreferencial($item['preferencial'] ?? false)
                    ];
                    $updatedItems[] = $normalizedItem;
                }
            }
            
            // Crear estructura actualizada
            $updatedData = [
                'key' => $newKey,
                'exam' => $updatedExam,
                'year' => (int)$updatedYear,
                'meta' => array_merge(
                    $existingData['meta'] ?? [],
                    $data['meta'] ?? [],
                    ['total' => count($updatedItems), 'fecha' => date('c')]
                ),
                'items' => $updatedItems
            ];
            
            $newFilename = DATA_DIR . $newKey . '.json';
            
            // Guardar archivo actualizado
            $json = json_encode($updatedData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
            if (file_put_contents($newFilename, $json, LOCK_EX) === false) {
                logError("No se pudo escribir el archivo: $newFilename");
                sendResponse(['error' => 'Error al guardar los datos'], 500);
            }
            
            // Si cambió la clave, eliminar el archivo anterior
            if ($oldKey !== $newKey && file_exists($oldFilename)) {
                unlink($oldFilename);
            }
            
            // Actualizar índice
            $index = readIndex();
            if ($oldKey !== $newKey) {
                // Reemplazar clave antigua con nueva
                $index = array_map(function($item) use ($oldKey, $newKey) {
                    return $item === $oldKey ? $newKey : $item;
                }, $index);
            }
            
            // Agregar nueva clave si no existe
            if (!in_array($newKey, $index)) {
                $index[] = $newKey;
            }
            
            $index = sortExamKeys(array_unique($index));
            
            if (!writeIndex($index)) {
                sendResponse(['error' => 'Error al actualizar el índice'], 500);
            }
            
            sendResponse(['ok' => true, 'key' => $newKey]);
            break;
            
        default:
            sendResponse(['error' => 'Acción no válida'], 400);
    }
    
} catch (Exception $e) {
    logError('Excepción: ' . $e->getMessage());
    sendResponse(['error' => 'Error interno del servidor'], 500);
}
?>