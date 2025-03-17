from fastapi import FastAPI, HTTPException # type: ignore
from fastapi.middleware.cors import CORSMiddleware # type: ignore
import uvicorn # type: ignore
import pandas as pd
import numpy as np
import utils

app = FastAPI(title="MotoGP Optimized API")

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cargar datasets
try:
    utils.download_dataset()
    riders_info_df = pd.read_csv("./data/riders-info.csv")
    riders_positions_df = pd.read_csv("./data/riders-finishing-positions.csv")
    races_winners_df = pd.read_csv("./data/grand-prix-race-winners.csv")
    circuits_df = pd.read_csv("./data/grand-prix-events-held.csv").rename(columns={"Track": "Circuit", "Times": "GPs_Held"})
    constructors_df = pd.read_csv("./data/constructure-world-championship.csv")
except Exception as e:
    raise RuntimeError(f"Error cargando archivos CSV: {e}")

# Función para limpiar valores NaN en diccionarios
def clean_nan_values(data_dict):
    """
    Reemplaza valores NaN con None en un diccionario para que sea compatible con JSON
    """
    for key in data_dict:
        if isinstance(data_dict[key], float) and np.isnan(data_dict[key]):
            data_dict[key] = None
    return data_dict

@app.get("/api/riders")
def get_top_riders(limit: int = None):
    """Obtener los pilotos con más victorias."""
    # Asegúrate de que las columnas numéricas sean números y no NaN
    riders_info_df["Victories"] = pd.to_numeric(riders_info_df["Victories"], errors="coerce").fillna(0).astype(int)
    riders_info_df["World Championships"] = pd.to_numeric(riders_info_df["World Championships"], errors="coerce").fillna(0).astype(int)
    
    # Si limit es None, devuelve todos los pilotos
    if limit is None:
        df = riders_info_df
    else:
        df = riders_info_df.nlargest(limit, "Victories")
    
    result = df[
        ["Riders All Time in All Classes", "Victories", "World Championships"]
    ].rename(columns={
        "Riders All Time in All Classes": "name",
        "Victories": "victories",
        "World Championships": "world_championships",
    })
    
    result["name"] = result["name"].apply(utils.format_rider_name)
    
    # Convertir a registros y limpiar valores NaN
    records = result.to_dict(orient="records")
    clean_records = [clean_nan_values(record) for record in records]
    
    return clean_records

@app.get("/api/riders/{name}")
def get_rider_details(name: str):
    """Obtener detalles de un piloto por su nombre."""
    # Convertir nombre de la URL al formato del dataframe
    # Manejo mejorado de nombres desde URL
    decoded_name = name.replace("_", " ")
    print(f"Buscando piloto: {decoded_name}")
    
    # Formatear los nombres de los pilotos para facilitar la búsqueda
    original_names = riders_info_df["Riders All Time in All Classes"].apply(utils.format_rider_name)
    
    # Búsqueda insensible a mayúsculas/minúsculas
    matches = original_names[original_names.str.lower() == decoded_name.lower()]
    
    if not matches.empty:
        original_name = riders_info_df.loc[matches.index[0], "Riders All Time in All Classes"]
        rider = riders_info_df[riders_info_df["Riders All Time in All Classes"] == original_name].iloc[0]
        
        # Asegúrate de que los valores numéricos son números y no NaN
        victories = pd.to_numeric(rider["Victories"], errors="coerce")
        world_championships = pd.to_numeric(rider["World Championships"], errors="coerce")
        
        result = {
            "name": utils.format_rider_name(rider["Riders All Time in All Classes"]),
            "victories": int(victories) if not pd.isna(victories) else 0,
            "world_championships": int(world_championships) if not pd.isna(world_championships) else 0
        }
        return result
    
    # Si no se encuentra el piloto, intentar una búsqueda más flexible
    for idx, original_name in enumerate(riders_info_df["Riders All Time in All Classes"]):
        formatted_name = utils.format_rider_name(original_name)
        if decoded_name.lower() in formatted_name.lower():
            rider = riders_info_df.iloc[idx]
            victories = pd.to_numeric(rider["Victories"], errors="coerce")
            world_championships = pd.to_numeric(rider["World Championships"], errors="coerce")
            
            result = {
                "name": utils.format_rider_name(rider["Riders All Time in All Classes"]),
                "victories": int(victories) if not pd.isna(victories) else 0,
                "world_championships": int(world_championships) if not pd.isna(world_championships) else 0
            }
            return result
    
    raise HTTPException(status_code=404, detail="Piloto no encontrado")

@app.get("/api/circuits")
def get_top_circuits(limit: int = None):
    """Obtener los circuitos con más GPs celebrados."""
    # Asegúrate de que GPs_Held sea un número y no NaN
    circuits_df["GPs_Held"] = pd.to_numeric(circuits_df["GPs_Held"], errors="coerce").fillna(0).astype(int)
    
    # Si limit es None, devuelve todos los circuitos
    if limit is None:
        df = circuits_df
    else:
        df = circuits_df.nlargest(limit, "GPs_Held")
    
    top_circuits = df[["Circuit", "Country", "GPs_Held"]]
    renamed_circuits = top_circuits.rename(columns={
        "Circuit": "name",
        "Country": "country",
        "GPs_Held": "gps_held",
    })
    
    # Convertir a registros y limpiar valores NaN
    records = renamed_circuits.to_dict(orient="records")
    clean_records = [clean_nan_values(record) for record in records]
    
    return clean_records

@app.get("/api/circuits/{name}")
def get_circuit_details(name: str):
    """Obtener detalles de un circuito por su nombre."""
    # Convertir nombre de la URL al formato del dataframe
    decoded_name = name.replace("_", " ")
    print(f"Buscando circuito: {decoded_name}")
    
    # Búsqueda insensible a mayúsculas/minúsculas
    circuit = circuits_df[circuits_df["Circuit"].str.lower() == decoded_name.lower()]
    
    if not circuit.empty:
        circuit = circuit.iloc[0]
        # Asegúrate de que GPs_Held sea un número y no NaN
        gps_held = pd.to_numeric(circuit["GPs_Held"], errors="coerce")
        
        return {
            "name": circuit["Circuit"],
            "country": circuit["Country"],
            "gps_held": int(gps_held) if not pd.isna(gps_held) else 0
        }
    
    # Si no se encuentra el circuito exacto, intentar una búsqueda parcial
    for idx, circuit_name in enumerate(circuits_df["Circuit"]):
        if decoded_name.lower() in circuit_name.lower():
            circuit = circuits_df.iloc[idx]
            gps_held = pd.to_numeric(circuit["GPs_Held"], errors="coerce")
            
            return {
                "name": circuit["Circuit"],
                "country": circuit["Country"],
                "gps_held": int(gps_held) if not pd.isna(gps_held) else 0
            }
    
    raise HTTPException(status_code=404, detail="Circuito no encontrado")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)