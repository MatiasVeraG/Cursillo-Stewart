from excel_manager import ExcelIngresantesManager

def llenar_excel_con_datos():
    """Llena el Excel con datos de ejemplo"""
    manager = ExcelIngresantesManager()
    
    print("🔄 Llenando Excel con datos de ejemplo...")
    print()
    
    # Llenar con datos de ejemplo
    manager.export_to_excel(
        nombre_examen="UPTP", 
        año="2025", 
        datos_ejemplo=True
    )
    
    print()
    print("📊 Verificando datos generados:")
    
    # Leer y mostrar los datos generados
    excel_data = manager.read_excel()
    
    if excel_data['success']:
        print(f"📋 Nombre del Examen (H2): {excel_data['metadata']['nombre_examen']}")
        print(f"📅 Año (H3): {excel_data['metadata']['año']}")
        print(f"👥 Total de ingresantes: {len(excel_data['data'])}")
        print()
        
        print("=== DATOS EN EL EXCEL ===")
        print(excel_data['data'].to_string(index=False))
        print()
        
        print("=== FORMATO PARA SITIO WEB ===")
        web_format = manager.convert_to_web_format()
        if web_format:
            import json
            print(json.dumps(web_format, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    llenar_excel_con_datos()