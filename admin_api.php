<?php
/**
 * Admin Panel Configuration and Data Handler
 * Cursillo Stewart - UPTP
 */

// Security settings
header('Content-Type: application/json');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');

// Enable CORS for your domain only
$allowed_origins = [
    'https://tu-dominio.com',
    'http://localhost',
    'http://127.0.0.1'
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
}

header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Configuration
define('ADMIN_DATA_FILE', __DIR__ . '/admin_data.json');
define('BACKUP_DIR', __DIR__ . '/backups/');
define('UPLOAD_DIR', __DIR__ . '/uploads/');

// Create directories if they don't exist
if (!file_exists(BACKUP_DIR)) {
    mkdir(BACKUP_DIR, 0755, true);
}
if (!file_exists(UPLOAD_DIR)) {
    mkdir(UPLOAD_DIR, 0755, true);
}

// Simple authentication check
function checkAuth() {
    $headers = getallheaders();
    $auth_token = $headers['Authorization'] ?? '';
    
    // In production, use proper JWT or session authentication
    $valid_tokens = [
        'Bearer admin_stewart_2024',
        'Bearer jefe_cursillo_123',
        'Bearer director_uptp_2024'
    ];
    
    return in_array($auth_token, $valid_tokens);
}

// Main handler
try {
    $method = $_SERVER['REQUEST_METHOD'];
    $action = $_GET['action'] ?? '';
    
    switch ($method) {
        case 'GET':
            handleGet($action);
            break;
        case 'POST':
            handlePost($action);
            break;
        default:
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}

function handleGet($action) {
    switch ($action) {
        case 'load':
            loadData();
            break;
        case 'backup':
            createBackup();
            break;
        default:
            http_response_code(400);
            echo json_encode(['error' => 'Invalid action']);
    }
}

function handlePost($action) {
    if (!checkAuth()) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        return;
    }
    
    switch ($action) {
        case 'save':
            saveData();
            break;
        case 'upload':
            handleUpload();
            break;
        case 'restore':
            restoreBackup();
            break;
        default:
            http_response_code(400);
            echo json_encode(['error' => 'Invalid action']);
    }
}

function loadData() {
    if (file_exists(ADMIN_DATA_FILE)) {
        $data = file_get_contents(ADMIN_DATA_FILE);
        echo $data;
    } else {
        // Return default data
        $defaultData = [
            'content' => [
                'banner_title' => 'Cursillo Stewart',
                'banner_subtitle' => 'Universidad Politécnica Taiwan Paraguay',
                'banner_description' => 'Preparándote para un futuro universitario exitoso.',
                'about_title' => 'Conócenos',
                'about_description' => 'Somos una institución educativa comprometida con la excelencia académica.',
                'contact_phone' => '+595 985 350550',
                'contact_email' => 'cursillostewart@gmail.com',
                'contact_address' => 'Independencia Nacional 1159 entre Av. Rodríguez de Francia y Rca. de Colombia, Asunción',
                'contact_hours' => 'Lun - Sáb: 8:00 - 12:00 y 14:00 - 18:00'
            ],
            'images' => [
                'logo' => 'images/logo-cursillo-stewart.png',
                'backgrounds' => [
                    'images/Imagen de Fondo 1.jpeg',
                    'images/Imagen de Fondo 3.jpeg',
                    'images/Imagen de Fondo 4.jpeg',
                    'images/Imagen de Fondo 5.jpeg'
                ]
            ],
            'stats' => [
                'students_2025' => 35,
                'students_2024' => 37,
                'students_2023' => 14
            ],
            'social' => [
                'facebook' => '',
                'instagram' => '',
                'whatsapp' => '595985350550'
            ],
            'last_updated' => date('c')
        ];
        
        echo json_encode($defaultData);
    }
}

function saveData() {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if (!$data) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON data']);
        return;
    }
    
    // Add timestamp
    $data['last_updated'] = date('c');
    
    // Validate data structure
    if (!validateData($data)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid data structure']);
        return;
    }
    
    // Save to file
    if (file_put_contents(ADMIN_DATA_FILE, json_encode($data, JSON_PRETTY_PRINT))) {
        echo json_encode(['success' => true, 'message' => 'Data saved successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to save data']);
    }
}

function validateData($data) {
    // Basic validation - extend as needed
    $required_keys = ['content', 'images', 'stats', 'social'];
    
    foreach ($required_keys as $key) {
        if (!isset($data[$key])) {
            return false;
        }
    }
    
    return true;
}

function handleUpload() {
    if (!isset($_FILES['file'])) {
        http_response_code(400);
        echo json_encode(['error' => 'No file uploaded']);
        return;
    }
    
    $file = $_FILES['file'];
    
    // Validate file type
    $allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!in_array($file['type'], $allowed_types)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid file type']);
        return;
    }
    
    // Validate file size (max 5MB)
    if ($file['size'] > 5 * 1024 * 1024) {
        http_response_code(400);
        echo json_encode(['error' => 'File too large']);
        return;
    }
    
    // Generate unique filename
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = uniqid('img_') . '.' . $extension;
    $filepath = UPLOAD_DIR . $filename;
    
    if (move_uploaded_file($file['tmp_name'], $filepath)) {
        echo json_encode([
            'success' => true,
            'filename' => $filename,
            'url' => 'uploads/' . $filename
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to upload file']);
    }
}

function createBackup() {
    if (!file_exists(ADMIN_DATA_FILE)) {
        http_response_code(404);
        echo json_encode(['error' => 'No data to backup']);
        return;
    }
    
    $data = file_get_contents(ADMIN_DATA_FILE);
    $backup_filename = 'backup_' . date('Y-m-d_H-i-s') . '.json';
    $backup_path = BACKUP_DIR . $backup_filename;
    
    if (file_put_contents($backup_path, $data)) {
        // Return backup for download
        header('Content-Disposition: attachment; filename="' . $backup_filename . '"');
        echo $data;
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to create backup']);
    }
}

function restoreBackup() {
    if (!isset($_FILES['backup'])) {
        http_response_code(400);
        echo json_encode(['error' => 'No backup file uploaded']);
        return;
    }
    
    $file = $_FILES['backup'];
    
    // Validate file type
    if ($file['type'] !== 'application/json') {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid backup file type']);
        return;
    }
    
    $content = file_get_contents($file['tmp_name']);
    $data = json_decode($content, true);
    
    if (!$data || !validateData($data)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid backup file']);
        return;
    }
    
    // Create backup of current data before restore
    if (file_exists(ADMIN_DATA_FILE)) {
        $current_data = file_get_contents(ADMIN_DATA_FILE);
        $backup_filename = 'pre_restore_backup_' . date('Y-m-d_H-i-s') . '.json';
        file_put_contents(BACKUP_DIR . $backup_filename, $current_data);
    }
    
    // Restore data
    if (file_put_contents(ADMIN_DATA_FILE, json_encode($data, JSON_PRETTY_PRINT))) {
        echo json_encode(['success' => true, 'message' => 'Backup restored successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to restore backup']);
    }
}

// Cleanup old backups (keep last 10)
function cleanupOldBackups() {
    $backups = glob(BACKUP_DIR . 'backup_*.json');
    if (count($backups) > 10) {
        // Sort by modification time, newest first
        usort($backups, function($a, $b) {
            return filemtime($b) - filemtime($a);
        });
        
        // Delete old backups
        for ($i = 10; $i < count($backups); $i++) {
            unlink($backups[$i]);
        }
    }
}

// Run cleanup periodically
if (rand(1, 100) === 1) {
    cleanupOldBackups();
}
?>