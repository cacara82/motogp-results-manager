from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from typing import List, Optional
import utils

app = FastAPI(title="MotoGP Results Manager API")

# Configurar CORS para permitir solicitudes desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, restringe a tu dominio
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cargar los datasets
try:
    utils.download_dataset()
    riders_info_df = pd.read_csv("./data/riders-info.csv")
    riders_positions_df = pd.read_csv("./data/riders-finishing-positions.csv")
    races_winners_df = pd.read_csv("./data/grand-prix-race-winners.csv")
    circuits_df = pd.read_csv("./data/grand-prix-events-held.csv")
    constructors_df = pd.read_csv("./data/constructure-world-championship.csv")
    podium_lockout_df = pd.read_csv("./data/same-nation-podium-lockouts.csv")
    # Limpiar y preparar datos
    # Renombrar columnas para consistencia
    circuits_df = circuits_df.rename(columns={"Track": "Circuit", "Times": "GPs_Held"}) 
except Exception as e:
    print(f"Error cargando archivos CSV: {e}")

@app.get("/")
def read_root():
    return {"message": "Bienvenido a la API del MotoGP Results Manager"}

# --- ENDPOINTS PARA LA PÁGINA PRINCIPAL (TARJETAS) ---

@app.get("/api/riders/cards")
def get_rider_cards(limit: int = 10):
    """Obtener datos para tarjetas de pilotos en home"""
    # Combinar información de ambos datasets
    merged_df = pd.merge(
        riders_info_df,
        riders_positions_df[["Rider", "Country"]],
        left_on="Riders All Time in All Classes",
        right_on="Rider",
        how="outer"
    )
    
    # Seleccionar los pilotos con más victorias
    top_riders = merged_df.nlargest(limit, "Victories")
    
    # Preparar datos para tarjetas
    cards = []
    for _, rider in top_riders.iterrows():
        cards.append({
            "name": rider.get("Riders All Time in All Classes", rider.get("Rider", "Unknown")),
            "country": rider.get("Country", "Unknown"),
            "victories": rider.get("Victories", 0),
            "world_championships": rider.get("World Championships", 0),
            "podiums": (
                int(rider.get("2nd places", 0)) + 
                int(rider.get("3rd places", 0)) + 
                int(rider.get("Victories", 0))
            ),
            "image_url": f"/assets/riders/{rider.get('Rider', '').replace(' ', '_').lower()}.jpg"
        })
    
    return cards

@app.get("/api/circuits/cards")
def get_circuit_cards(limit: int = 10):
    """Obtener datos para tarjetas de circuitos en home"""
    # Ordenar por número de GPs celebrados
    top_circuits = circuits_df.nlargest(limit, "GPs_Held")
    
    # Obtener última carrera en cada circuito
    latest_races = races_winners_df.groupby("Circuit")["Season"].max().reset_index()
    
    # Preparar datos para tarjetas
    cards = []
    for _, circuit in top_circuits.iterrows():
        latest_season = latest_races[latest_races["Circuit"] == circuit["Circuit"]]["Season"].max() if not latest_races.empty else None
        
        cards.append({
            "name": circuit["Circuit"],
            "country": circuit["Country"],
            "gps_held": circuit["GPs_Held"],
            "latest_season": latest_season,
            "image_url": f"/assets/circuits/{circuit['Circuit'].replace(' ', '_').lower()}.jpg"
        })
    
    return cards

@app.get("/api/constructors/cards")
def get_constructor_cards(limit: int = 10):
    """Obtener datos para tarjetas de constructores en home"""
    # Contar campeonatos por constructor
    championships = constructors_df.groupby("Constructor").size().reset_index(name="Championships")
    top_constructors = championships.nlargest(limit, "Championships")
    
    # Obtener última temporada por constructor
    latest_seasons = constructors_df.groupby("Constructor")["Season"].max().reset_index()
    
    # Preparar datos para tarjetas
    cards = []
    for _, constructor in top_constructors.iterrows():
        latest_season = latest_seasons[latest_seasons["Constructor"] == constructor["Constructor"]]["Season"].max()
        
        cards.append({
            "name": constructor["Constructor"],
            "championships": constructor["Championships"],
            "latest_season": latest_season,
            "image_url": f"/assets/constructors/{constructor['Constructor'].replace(' ', '_').lower()}.jpg"
        })
    
    return cards

# --- ENDPOINTS PARA PÁGINAS DETALLADAS ---

@app.get("/api/riders/{rider_name}")
def get_rider_details(rider_name: str):
    """Obtener detalles completos de un piloto"""
    # Buscar en riders-info
    rider_info = riders_info_df[riders_info_df["Riders All Time in All Classes"].str.contains(rider_name, case=False)]
    
    # Buscar en riders-positions
    rider_positions = riders_positions_df[riders_positions_df["Rider"].str.contains(rider_name, case=False)]
    
    if rider_info.empty and rider_positions.empty:
        raise HTTPException(status_code=404, detail="Piloto no encontrado")
    
    # Construir perfil completo
    profile = {}
    
    if not rider_info.empty:
        info_record = rider_info.iloc[0].to_dict()
        profile.update({
            "name": info_record.get("Riders All Time in All Classes", ""),
            "victories": info_record.get("Victories", 0),
            "second_places": info_record.get("2nd places", 0),
            "third_places": info_record.get("3rd places", 0),
            "pole_positions": info_record.get("Pole positions from '74 to 2022", 0),
            "fastest_laps": info_record.get("Race fastest lap to 2022", 0),
            "world_championships": info_record.get("World Championships", 0)
        })
    
    if not rider_positions.empty:
        pos_record = rider_positions.iloc[0].to_dict()
        profile.update({
            "name": profile.get("name", pos_record.get("Rider", "")),
            "country": pos_record.get("Country", ""),
            "fourth_places": pos_record.get("Numberof4th", 0),
            "fifth_places": pos_record.get("Numberof5th", 0),
            "sixth_places": pos_record.get("Numberof6th", 0)
        })
    
    # Obtener victorias por circuito
    circuit_wins = {}
    rider_wins = races_winners_df[races_winners_df["Rider"].str.contains(rider_name, case=False)]
    
    if not rider_wins.empty:
        circuit_wins = rider_wins.groupby("Circuit").size().to_dict()
    
    profile["circuit_wins"] = circuit_wins
    
    # Obtener victorias por constructor
    constructor_wins = {}
    if not rider_wins.empty:
        constructor_wins = rider_wins.groupby("Constructor").size().to_dict()
    
    profile["constructor_wins"] = constructor_wins
    
    # Obtener victorias por clase
    class_wins = {}
    if not rider_wins.empty:
        class_wins = rider_wins.groupby("Class").size().to_dict()
    
    profile["class_wins"] = class_wins
    
    # Victorias por temporada
    season_wins = {}
    if not rider_wins.empty:
        season_wins = rider_wins.groupby("Season").size().to_dict()
    
    profile["season_wins"] = season_wins
    
    return profile

@app.get("/api/circuits/{circuit_name}")
def get_circuit_details(circuit_name: str):
    """Obtener detalles completos de un circuito"""
    # Buscar en el dataset de circuitos
    circuit = circuits_df[circuits_df["Circuit"].str.contains(circuit_name, case=False)]
    
    if circuit.empty:
        # Intentar buscar en el dataset de ganadores de carreras
        circuit_races = races_winners_df[races_winners_df["Circuit"].str.contains(circuit_name, case=False)]
        if circuit_races.empty:
            raise HTTPException(status_code=404, detail="Circuito no encontrado")
    
    # Datos básicos del circuito
    profile = {}
    
    if not circuit.empty:
        circuit_info = circuit.iloc[0].to_dict()
        profile.update({
            "name": circuit_info.get("Circuit", ""),
            "country": circuit_info.get("Country", ""),
            "gps_held": circuit_info.get("GPs_Held", 0)
        })
    else:
        # Si no está en el dataset principal, tomamos los datos del dataset de carreras
        circuit_name_full = circuit_races["Circuit"].iloc[0]
        country = circuit_races["Country"].iloc[0] if "Country" in circuit_races.columns else "Unknown"
        
        profile.update({
            "name": circuit_name_full,
            "country": country,
            "gps_held": len(circuit_races)
        })
    
    # Obtener ganadores por circuito
    circuit_winners = races_winners_df[races_winners_df["Circuit"].str.contains(circuit_name, case=False)]
    
    # Top pilotos en este circuito
    top_riders = {}
    if not circuit_winners.empty:
        top_riders = circuit_winners.groupby("Rider").size().nlargest(10).to_dict()
    
    profile["top_riders"] = top_riders
    
    # Top constructores en este circuito
    top_constructors = {}
    if not circuit_winners.empty:
        top_constructors = circuit_winners.groupby("Constructor").size().nlargest(5).to_dict()
    
    profile["top_constructors"] = top_constructors
    
    # Histórico de carreras
    races_history = []
    if not circuit_winners.empty:
        for _, race in circuit_winners.iterrows():
            races_history.append({
                "season": race.get("Season", ""),
                "class": race.get("Class", ""),
                "winner": race.get("Rider", ""),
                "constructor": race.get("Constructor", ""),
                "country": race.get("Country", "")
            })
    
    profile["races_history"] = races_history
    
    return profile

@app.get("/api/constructors/{constructor_name}")
def get_constructor_details(constructor_name: str):
    """Obtener detalles completos de un constructor"""
    # Buscar en el dataset de constructores
    constructor_champs = constructors_df[constructors_df["Constructor"].str.contains(constructor_name, case=False)]
    
    # Buscar en el dataset de ganadores de carreras
    constructor_wins = races_winners_df[races_winners_df["Constructor"].str.contains(constructor_name, case=False)]
    
    if constructor_champs.empty and constructor_wins.empty:
        raise HTTPException(status_code=404, detail="Constructor no encontrado")
    
    # Construir perfil
    profile = {"name": constructor_name}
    
    # Campeonatos mundiales
    championships = []
    if not constructor_champs.empty:
        for _, champ in constructor_champs.iterrows():
            championships.append({
                "season": champ.get("Season", ""),
                "class": champ.get("Class", "")
            })
    
    profile["championships"] = championships
    profile["total_championships"] = len(championships)
    
    # Victorias por piloto
    rider_wins = {}
    if not constructor_wins.empty:
        rider_wins = constructor_wins.groupby("Rider").size().nlargest(10).to_dict()
    
    profile["top_riders"] = rider_wins
    
    # Victorias por circuito
    circuit_wins = {}
    if not constructor_wins.empty:
        circuit_wins = constructor_wins.groupby("Circuit").size().nlargest(10).to_dict()
    
    profile["top_circuits"] = circuit_wins
    
    # Victorias por temporada
    season_wins = {}
    if not constructor_wins.empty:
        season_wins = constructor_wins.groupby("Season").size().to_dict()
    
    profile["season_wins"] = season_wins
    
    # Victorias por clase
    class_wins = {}
    if not constructor_wins.empty:
        class_wins = constructor_wins.groupby("Class").size().to_dict()
    
    profile["class_wins"] = class_wins
    
    return profile

# --- ENDPOINTS PARA BÚSQUEDA Y FILTRADO ---

@app.get("/api/search")
def search(query: str, category: Optional[str] = None):
    """Buscar en todas las categorías o en una específica"""
    results = {
        "riders": [],
        "circuits": [],
        "constructors": []
    }
    
    # Si se especifica categoría, solo buscar en esa
    if category and category not in results:
        raise HTTPException(status_code=400, detail="Categoría no válida")
    
    # Buscar pilotos
    if not category or category == "riders":
        # Buscar en riders-info
        riders1 = riders_info_df[riders_info_df["Riders All Time in All Classes"].str.contains(query, case=False)]
        # Buscar en riders-positions
        riders2 = riders_positions_df[riders_positions_df["Rider"].str.contains(query, case=False)]
        
        # Combinamos resultados
        for _, rider in riders1.iterrows():
            results["riders"].append({
                "name": rider.get("Riders All Time in All Classes", ""),
                "victories": rider.get("Victories", 0),
                "world_championships": rider.get("World Championships", 0)
            })
        
        for _, rider in riders2.iterrows():
            # Verificar que no esté ya en los resultados
            if not any(r["name"] == rider.get("Rider", "") for r in results["riders"]):
                results["riders"].append({
                    "name": rider.get("Rider", ""),
                    "country": rider.get("Country", ""),
                    "victories": rider.get("Victories", 0)
                })
    
    # Buscar circuitos
    if not category or category == "circuits":
        circuits1 = circuits_df[circuits_df["Circuit"].str.contains(query, case=False)]
        for _, circuit in circuits1.iterrows():
            results["circuits"].append({
                "name": circuit.get("Circuit", ""),
                "country": circuit.get("Country", ""),
                "gps_held": circuit.get("GPs_Held", 0)
            })
    
    # Buscar constructores
    if not category or category == "constructors":
        constructors = set(constructors_df[constructors_df["Constructor"].str.contains(query, case=False)]["Constructor"])
        for constructor in constructors:
            champs_count = len(constructors_df[constructors_df["Constructor"] == constructor])
            results["constructors"].append({
                "name": constructor,
                "championships": champs_count
            })
    
    return results

# --- ENDPOINTS PARA ESTADÍSTICAS Y ANÁLISIS ---

@app.get("/api/stats/most-successful-riders")
def get_most_successful_riders(by: str = "victories", limit: int = 10):
    """Obtener los pilotos más exitosos según diferentes criterios"""
    if by == "victories":
        # Combinar ambos datasets para información más completa
        merged_df = pd.merge(
            riders_info_df,
            riders_positions_df[["Rider", "Country", "Victories"]],
            left_on="Riders All Time in All Classes",
            right_on="Rider",
            how="outer"
        )
        
        # Usar las victorias del primer dataset, o del segundo si no están disponibles
        merged_df["Total_Victories"] = merged_df["Victories_x"].fillna(merged_df["Victories_y"])
        
        top_riders = merged_df.nlargest(limit, "Total_Victories")
        result = top_riders[["Riders All Time in All Classes", "Country", "Total_Victories", "World Championships"]].fillna(0).to_dict(orient="records")
        
    elif by == "championships":
        top_riders = riders_info_df.nlargest(limit, "World Championships")
        result = top_riders[["Riders All Time in All Classes", "Victories", "World Championships"]].to_dict(orient="records")
        
    elif by == "podiums":
        # Calcular total de podios (victorias + 2° + 3°)
        riders_info_df["Total_Podiums"] = riders_info_df["Victories"] + riders_info_df["2nd places"] + riders_info_df["3rd places"]
        top_riders = riders_info_df.nlargest(limit, "Total_Podiums")
        result = top_riders[["Riders All Time in All Classes", "Victories", "Total_Podiums", "World Championships"]].to_dict(orient="records")
        
    else:
        raise HTTPException(status_code=400, detail="Criterio no válido")
    
    return result

@app.get("/api/stats/tracks-by-country")
def get_tracks_by_country():
    """Obtener distribución de circuitos por país"""
    tracks_count = circuits_df.groupby("Country").size().reset_index(name="count")
    return tracks_count.to_dict(orient="records")

@app.get("/api/stats/nation-dominance")
def get_nation_dominance():
    """Obtener datos sobre la dominancia de países en diversas categorías"""
    # Dominancia por victorias
    rider_countries = riders_positions_df.groupby("Country")["Victories"].sum().reset_index()
    rider_countries = rider_countries.nlargest(10, "Victories")
    
    # Podios con bloqueo de nacionalidad
    nation_lockouts = podium_lockout_df.groupby("Riders` Nation").size().reset_index(name="lockout_podiums")
    
    # Combinamos los datos
    result = {
        "victories_by_country": rider_countries.to_dict(orient="records"),
        "podium_lockouts": nation_lockouts.to_dict(orient="records")
    }
    
    return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)