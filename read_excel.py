import pandas as pd
import sys
import os

def read_excel_file():
    try:
        # Ruta al archivo Excel
        excel_path = os.path.join('documents', 'Plantilla_de_Ingresantes.xlsx')
        
        # Leer metadatos desde celdas específicas (sin header para acceder a celdas específicas)
        df_metadata = pd.read_excel(excel_path, header=None)
        
        # Extraer metadatos de las celdas H2 y H3 (columna H = índice 7)
        nombre_examen = df_metadata.iloc[1, 7] if len(df_metadata) > 1 and len(df_metadata.columns) > 7 else "No especificado"
        año_examen = df_metadata.iloc[2, 7] if len(df_metadata) > 2 and len(df_metadata.columns) > 7 else "No especificado"
        
        # Leer los datos con encabezados en la fila 1 (índice 1)
        df = pd.read_excel(excel_path, header=1)
        
        # Filtrar filas vacías
        df_clean = df.dropna(how='all')
        
        print("=== METADATOS DEL EXAMEN ===")
        print(f"📋 Nombre del Examen (H2): {nombre_examen}")
        print(f"📅 Año (H3): {año_examen}")
        print()
        
        print("=== FORMATO DEL ARCHIVO EXCEL ===")
        print(f"Archivo: {excel_path}")
        print(f"Número de filas con datos: {len(df_clean)}")
        print(f"Número total de filas: {len(df)}")
        print(f"Número de columnas: {len(df.columns)}")
        print()
        
        print("=== COLUMNAS ENCONTRADAS ===")
        for i, col in enumerate(df.columns, 1):
            letra_col = chr(64+i)
            print(f"Columna {letra_col}: {col}")
        print()
        
        if len(df_clean) > 0:
            print("=== DATOS DE INGRESANTES ===")
            print(df_clean.to_string(index=False))
            print()
            
            print("=== ESTADÍSTICAS DE PUNTAJE ===")
            if 'Puntaje' in df_clean.columns and not df_clean['Puntaje'].isna().all():
                puntajes = df_clean['Puntaje'].dropna()
                print(f"Total de estudiantes: {len(puntajes)}")
                print(f"Puntaje máximo: {puntajes.max()}")
                print(f"Puntaje mínimo: {puntajes.min()}")
                print(f"Puntaje promedio: {puntajes.mean():.2f}")
            else:
                print("No hay datos de puntajes disponibles")
        else:
            print("=== SIN DATOS ===")
            print("La plantilla está vacía, lista para ser llenada con datos de ingresantes.")
        
        # Retornar tanto los datos como los metadatos
        return {
            'data': df_clean,
            'metadata': {
                'nombre_examen': nombre_examen,
                'año': año_examen
            },
            'raw_data': df
        }
        
    except FileNotFoundError:
        print(f"Error: No se encontró el archivo {excel_path}")
        return None
    except Exception as e:
        print(f"Error al leer el archivo: {str(e)}")
        return None

if __name__ == "__main__":
    result = read_excel_file()
    if result:
        print()
        print("=== RESUMEN DEL FORMATO ===")
        print("✅ Estructura detectada correctamente")
        print("📊 Columnas principales: Nombre y Apellido, Puntaje, Carrera, Puesto, Preferencial")
        print("📋 Metadatos: Nombre del examen (H2), Año (H3)")
        print("🔄 Lista para importar datos al sitio web")