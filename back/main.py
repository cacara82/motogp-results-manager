from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
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

@app.get("/api/riders")
def get_top_riders(limit: int = 10):
    """Obtener los pilotos con más victorias."""
    top_riders = riders_info_df.nlargest(limit, "Victories")[
        ["Riders All Time in All Classes", "Victories", "World Championships"]
    ].rename(columns={
        "Riders All Time in All Classes": "name",
        "Victories": "victories",
        "World Championships": "world_championships",
    })
    top_riders["name"] = top_riders["name"].apply(utils.format_rider_name)
    return top_riders.to_dict(orient="records")

@app.get("/api/circuits")
def get_top_circuits(limit: int = 10):
    """Obtener los circuitos con más GPs celebrados."""
    top_circuits = circuits_df.nlargest(limit, "GPs_Held")[["Circuit", "Country", "GPs_Held"]]
    return top_circuits.rename(columns={
        "Circuit": "name",
        "Country": "country",
        "GPs_Held": "gps_held",
    }).to_dict(orient="records")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
