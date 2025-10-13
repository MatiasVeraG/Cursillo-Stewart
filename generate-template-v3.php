<?php
/**
 * Endpoint para generar plantilla Excel v3
 * Genera archivos Excel con formato específico v3
 */

header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

try {
    // Get request data
    $input = json_decode(file_get_contents('php://input'), true);
    $withSamples = $input['withSamples'] ?? false;
    
    // For now, return the existing template file
    // In production, you would generate the Excel file programmatically
    
    $templatePath = $withSamples 
        ? 'documents/Plantilla_con_Ejemplos_v3.xlsx'
        : 'documents/Plantilla_de_Ingresantes_v3.xlsx';
    
    if (!file_exists($templatePath)) {
        // Generate template using Python script
        $pythonCommand = "python excel_generator_v3.py";
        $output = shell_exec($pythonCommand);
        
        if (!file_exists($templatePath)) {
            throw new Exception('No se pudo generar la plantilla');
        }
    }
    
    // Set appropriate headers
    $filename = $withSamples ? 'Plantilla_con_Ejemplos_v3.xlsx' : 'Plantilla_Ingresantes_v3.xlsx';
    header("Content-Disposition: attachment; filename=\"$filename\"");
    header('Content-Length: ' . filesize($templatePath));
    
    // Output file
    readfile($templatePath);
    
} catch (Exception $e) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['error' => $e->getMessage()]);
}
?>