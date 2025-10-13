<?php
/**
 * API Backend para gestión de secciones de ingresantes
 * Maneja persistencia de sections.json e ingresantes.{slug}.json
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Manejar preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

class SectionAPI {
    
    private $sectionsFile = 'data/sections.json';
    private $ingresantesDir = 'data/ingresantes';
    
    public function __construct() {
        // Asegurar que los directorios existan
        if (!is_dir('data')) {
            mkdir('data', 0755, true);
        }
        if (!is_dir($this.ingresantesDir)) {
            mkdir($this.ingresantesDir, 0755, true);
        }
        
        // Inicializar sections.json si no existe
        if (!file_exists($this.sectionsFile)) {
            file_put_contents($this.sectionsFile, json_encode([]));
        }
    }
    
    public function handleRequest() {
        $method = $_SERVER['REQUEST_METHOD'];
        $path = $_SERVER['PATH_INFO'] ?? '';
        
        try {
            switch ($method) {
                case 'GET':
                    return $this->handleGet($path);
                case 'POST':
                    return $this->handlePost($path);
                default:
                    throw new Exception('Método no permitido', 405);
            }
        } catch (Exception $e) {
            http_response_code($e->getCode() ?: 500);
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
    }
    
    private function handleGet($path) {
        if ($path === '/sections') {
            return $this->getSections();
        } elseif (preg_match('/^\/ingresantes\/(.+)$/', $path, $matches)) {
            return $this->getIngresantes($matches[1]);
        } else {
            throw new Exception('Endpoint no encontrado', 404);
        }
    }
    
    private function handlePost($path) {
        if ($path === '/save-sections') {
            return $this->saveSections();
        } elseif (preg_match('/^\/save-ingresantes\/(.+)$/', $path, $matches)) {
            return $this->saveIngresantes($matches[1]);
        } elseif ($path === '/process-excel') {
            return $this->processExcel();
        } else {
            throw new Exception('Endpoint no encontrado', 404);
        }
    }
    
    private function getSections() {
        $sections = json_decode(file_get_contents($this.sectionsFile), true) ?: [];
        echo json_encode($sections);
    }
    
    private function getIngresantes($slug) {
        $file = $this.ingresantesDir . "/ingresantes.$slug.json";
        if (!file_exists($file)) {
            echo json_encode([]);
            return;
        }
        
        $ingresantes = json_decode(file_get_contents($file), true) ?: [];
        echo json_encode($ingresantes);
    }
    
    private function saveSections() {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!is_array($input)) {
            throw new Exception('Datos inválidos', 400);
        }
        
        $result = file_put_contents($this.sectionsFile, json_encode($input, JSON_PRETTY_PRINT));
        
        if ($result === false) {
            throw new Exception('Error guardando secciones', 500);
        }
        
        echo json_encode(['success' => true]);
    }
    
    private function saveIngresantes($slug) {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!is_array($input)) {
            throw new Exception('Datos inválidos', 400);
        }
        
        $file = $this.ingresantesDir . "/ingresantes.$slug.json";
        $result = file_put_contents($file, json_encode($input, JSON_PRETTY_PRINT));
        
        if ($result === false) {
            throw new Exception('Error guardando ingresantes', 500);
        }
        
        echo json_encode(['success' => true]);
    }
    
    private function processExcel() {
        if (!isset($_FILES['excel']) || $_FILES['excel']['error'] !== UPLOAD_NO_ERROR) {
            throw new Exception('No se recibió archivo Excel válido', 400);
        }
        
        $uploadedFile = $_FILES['excel'];
        $tmpPath = $uploadedFile['tmp_name'];
        
        // Aquí implementarías el procesamiento del Excel
        // Por ahora retornamos un ejemplo
        
        $exam = $_POST['exam'] ?? 'UPTP';
        $year = $_POST['year'] ?? date('Y');
        $slug = strtolower($exam) . '-' . $year;
        
        // Simular datos procesados
        $processedData = [
            [
                'nombre' => 'Juan Pérez',
                'apellido' => 'García',
                'nombre_completo' => 'Juan Pérez García',
                'puntaje' => 95.5,
                'carrera' => 'Ing. Informática',
                'puesto' => 1,
                'posicion' => '#1',
                'preferencial' => true,
                'medal' => '🥇',
                'created_at' => date('c'),
                'updated_at' => date('c')
            ]
        ];
        
        // Guardar ingresantes
        $this->saveIngresantesToFile($slug, $processedData);
        
        // Actualizar o crear sección
        $this->updateSection($slug, $exam, $year, count($processedData));
        
        echo json_encode([
            'success' => true,
            'slug' => $slug,
            'exam' => $exam,
            'year' => $year,
            'count' => count($processedData)
        ]);
    }
    
    private function saveIngresantesToFile($slug, $data) {
        $file = $this.ingresantesDir . "/ingresantes.$slug.json";
        return file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT));
    }
    
    private function updateSection($slug, $exam, $year, $count) {
        $sections = json_decode(file_get_contents($this.sectionsFile), true) ?: [];
        
        // Buscar sección existente
        $sectionIndex = array_search($slug, array_column($sections, 'slug'));
        $now = date('c');
        
        if ($sectionIndex !== false) {
            // Actualizar existente
            $sections[$sectionIndex]['rows_count'] = $count;
            $sections[$sectionIndex]['updated_at'] = $now;
        } else {
            // Crear nueva
            $maxOrder = 0;
            foreach ($sections as $section) {
                $maxOrder = max($maxOrder, $section['order'] ?? 0);
            }
            
            $newSection = [
                'id' => uniqid(),
                'slug' => $slug,
                'exam' => strtoupper($exam),
                'year' => intval($year),
                'title' => strtoupper($exam) . '-' . $year,
                'description' => "Ingresantes $exam $year",
                'order' => $maxOrder + 1,
                'is_public' => true,
                'rows_count' => $count,
                'excel_path' => '',
                'created_at' => $now,
                'updated_at' => $now
            ];
            
            // Insertar al principio
            array_unshift($sections, $newSection);
        }
        
        return file_put_contents($this.sectionsFile, json_encode($sections, JSON_PRETTY_PRINT));
    }
}

// Ejecutar API
$api = new SectionAPI();
$api->handleRequest();
?>