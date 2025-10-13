import pandas as pd
import json
import os
from datetime import datetime

class ExcelIngresantesManager:
    def __init__(self):
        self.excel_path = os.path.join('documents', 'Plantilla_de_Ingresantes.xlsx')
        
    def export_to_excel(self, nombre_examen="UPTP", año="2025", datos_ejemplo=True):
        """Exporta datos al Excel, ya sea de ejemplo o del sitio web"""
        
        if datos_ejemplo:
            # Datos de ejemplo basados en tu sitio web actual
            ingresantes_data = [
                {"Nombre y Apellido": "Mateo Mongelos", "Puntaje": 100, "Carrera": "Ing. Electromecánica", "Puesto": 1, "Preferencial": "Sí"},
                {"Nombre y Apellido": "Axel Acosta", "Puntaje": 84.62, "Carrera": "Ing. Informática", "Puesto": 6, "Preferencial": "No"},
                {"Nombre y Apellido": "Albert Servín", "Puntaje": 100, "Carrera": "Ing. Informática", "Puesto": 1, "Preferencial": "Sí"},
                {"Nombre y Apellido": "Ana García", "Puntaje": 95.5, "Carrera": "Ing. Civil", "Puesto": 2, "Preferencial": "No"},
                {"Nombre y Apellido": "Carlos López", "Puntaje": 92.8, "Carrera": "Ing. Electromecánica", "Puesto": 3, "Preferencial": "Sí"}
            ]
        else:
            # Aquí podrías cargar datos reales del sitio web
            ingresantes_data = []
            
        # Crear DataFrame
        df = pd.DataFrame(ingresantes_data)
        
        # Crear un archivo Excel con formato específico
        with pd.ExcelWriter(self.excel_path, engine='openpyxl') as writer:
            # Escribir encabezado en fila 1
            header_df = pd.DataFrame([["Lista de Ingresantes", "", "", "", "", "", ""]],
                                   columns=["Lista de Ingresantes", "Unnamed: 1", "Unnamed: 2", "Unnamed: 3", "Unnamed: 4", "Unnamed: 5", "Unnamed: 6"])
            header_df.to_excel(writer, sheet_name='Sheet1', index=False, header=False, startrow=0)
            
            # Escribir los datos principales a partir de la fila 2
            if len(df) > 0:
                df.to_excel(writer, sheet_name='Sheet1', index=False, startrow=1)
            else:
                # Si no hay datos, escribir solo los encabezados
                empty_df = pd.DataFrame(columns=["Nombre y Apellido", "Puntaje", "Carrera", "Puesto", "Preferencial", "", "Nombre de Examen"])
                empty_df.to_excel(writer, sheet_name='Sheet1', index=False, startrow=1)
            
            # Acceder al workbook y worksheet para escribir metadatos
            workbook = writer.book
            worksheet = writer.sheets['Sheet1']
            
            # Escribir metadatos en H2 y H3
            worksheet['H2'] = nombre_examen
            worksheet['H3'] = año
            
        print(f"✅ Excel exportado exitosamente: {self.excel_path}")
        print(f"📋 Nombre del examen: {nombre_examen}")
        print(f"📅 Año: {año}")
        print(f"👥 Registros exportados: {len(df) if len(df) > 0 else 'Plantilla vacía'}")
        
    def read_excel(self):
        """Lee el archivo Excel y extrae datos y metadatos"""
        try:
            # Leer metadatos
            df_metadata = pd.read_excel(self.excel_path, header=None)
            nombre_examen = df_metadata.iloc[1, 7] if len(df_metadata) > 1 and len(df_metadata.columns) > 7 else "No especificado"
            año_examen = df_metadata.iloc[2, 7] if len(df_metadata) > 2 and len(df_metadata.columns) > 7 else "No especificado"
            
            # Leer datos principales
            df = pd.read_excel(self.excel_path, header=1)
            df_clean = df.dropna(how='all')
            
            return {
                'success': True,
                'data': df_clean,
                'metadata': {
                    'nombre_examen': nombre_examen,
                    'año': año_examen
                }
            }
        except Exception as e:
            return {'success': False, 'error': str(e)}
            
    def convert_to_web_format(self):
        """Convierte los datos del Excel al formato JSON del sitio web"""
        excel_data = self.read_excel()
        
        if not excel_data['success']:
            print(f"❌ Error: {excel_data['error']}")
            return None
            
        df = excel_data['data']
        metadata = excel_data['metadata']
        
        if len(df) == 0:
            print("⚠️ No hay datos de ingresantes en el Excel")
            return None
            
        # Convertir a formato del sitio web
        ingresantes_web = []
        
        for index, row in df.iterrows():
            if pd.notna(row['Nombre y Apellido']):
                # Determinar medalla basada en posición
                posicion = int(row['Puesto']) if pd.notna(row['Puesto']) else index + 1
                medal = ""
                if posicion <= 3:
                    medals = {1: "🥇", 2: "🥈", 3: "🥉"}
                    medal = medals.get(posicion, "")
                
                ingresante = {
                    "nombre": str(row['Nombre y Apellido']),
                    "puntaje": str(row['Puntaje']) if pd.notna(row['Puntaje']) else "0",
                    "carrera": str(row['Carrera']) if pd.notna(row['Carrera']) else "",
                    "posicion": f"#{posicion}",
                    "medal": medal
                }
                
                # Agregar información preferencial si existe
                if pd.notna(row['Preferencial']):
                    ingresante["preferencial"] = str(row['Preferencial'])
                    
                ingresantes_web.append(ingresante)
        
        # Crear estructura final
        result = {
            "metadata": {
                "nombre_examen": metadata['nombre_examen'],
                "año": metadata['año'],
                "total_ingresantes": len(ingresantes_web),
                "fecha_actualizacion": datetime.now().isoformat()
            },
            "ingresantes": ingresantes_web
        }
        
        return result

def main():
    manager = ExcelIngresantesManager()
    
    print("=== GESTIÓN DE PLANTILLA EXCEL INGRESANTES ===")
    print()
    
    # Leer archivo actual
    print("1. LEYENDO ARCHIVO ACTUAL:")
    excel_data = manager.read_excel()
    
    if excel_data['success']:
        print(f"📋 Nombre del Examen: {excel_data['metadata']['nombre_examen']}")
        print(f"📅 Año: {excel_data['metadata']['año']}")
        print(f"👥 Registros encontrados: {len(excel_data['data'])}")
        print()
        
        if len(excel_data['data']) > 0:
            print("2. DATOS ACTUALES EN EL EXCEL:")
            print(excel_data['data'].to_string(index=False))
            print()
            
            print("3. CONVERSIÓN A FORMATO WEB:")
            web_format = manager.convert_to_web_format()
            if web_format:
                print(json.dumps(web_format, indent=2, ensure_ascii=False))
        else:
            print("2. GENERANDO DATOS DE EJEMPLO:")
            manager.export_to_excel("UPTP", "2025", datos_ejemplo=True)
            print()
            print("3. LEYENDO DATOS GENERADOS:")
            web_format = manager.convert_to_web_format()
            if web_format:
                print(json.dumps(web_format, indent=2, ensure_ascii=False))
    else:
        print(f"❌ Error: {excel_data['error']}")

if __name__ == "__main__":
    main()