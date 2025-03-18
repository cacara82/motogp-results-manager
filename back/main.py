from fastapi import FastAPI, HTTPException # type: ignore
from fastapi.middleware.cors import CORSMiddleware # type: ignore
import uvicorn # type: ignore
import pandas as pd
import numpy as np
import utils

app = FastAPI(title="MotoGP Kagglehub API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Download/load datasets each time
try:
    utils.download_dataset() # if already downloaded will skip them
    riders_info_df = pd.read_csv("./data/riders-info.csv")
    riders_positions_df = pd.read_csv("./data/riders-finishing-positions.csv")
    races_winners_df = pd.read_csv("./data/grand-prix-race-winners.csv")
    circuits_df = pd.read_csv("./data/grand-prix-events-held.csv").rename(columns={"Track": "Circuit", "Times": "GPs_Held"})
    constructors_df = pd.read_csv("./data/constructure-world-championship.csv")
except Exception as e:
    raise RuntimeError(f"Error loading files: {e}")

# Function that will clean NaN values in dicts
def clean_nan_values(data_dict):
    """
    Switches NaN values with None in a dict to be JSON compatible.
    Mainly used for compatibility purposes.
    """
    for key in data_dict:
        if isinstance(data_dict[key], float) and np.isnan(data_dict[key]):
            data_dict[key] = None
    return data_dict


## ENDPOINTS

@app.get("/api/riders")
def get_top_riders(limit: int = None):
    """
    Obtains riders with the most victories and converts them into a dict.
    If the limit is None, every rider will be selected.
    """
    riders_info_df["Victories"] = pd.to_numeric(riders_info_df["Victories"], errors="coerce").fillna(0).astype(int) # fills NaN columns with "0"
    riders_info_df["World Championships"] = pd.to_numeric(riders_info_df["World Championships"], errors="coerce").fillna(0).astype(int)
    
    if limit is None: # if limit is None selects every rider
        df = riders_info_df
    else:
        df = riders_info_df.nlargest(limit, "Victories")
    
    result = df[ # re-formats result
        ["Riders All Time in All Classes", "Victories", "World Championships"]
    ].rename(columns={
        "Riders All Time in All Classes": "name",
        "Victories": "victories",
        "World Championships": "world_championships",
    })
    
    result["name"] = result["name"].apply(utils.format_rider_name) # formats the name according to our utils method
    
    records = result.to_dict(orient="records") # converts the result df to a dict and cleans NaN values
    clean_records = [clean_nan_values(record) for record in records]
    
    return clean_records


@app.get("/api/riders/{name}")
def get_rider_details(name: str):
    """
    Obtains details from a rider based on
    their name.
    """
    decoded_name = name.replace("_", " ") # converts URL name format into df name format and prints its name for utility purposes
    print(f"Searching data for the pilot... -> {decoded_name}")
    
    original_names = riders_info_df["Riders All Time in All Classes"].apply(utils.format_rider_name) # formats the pilots names to ease up the search
    
    matches = original_names[original_names.str.lower() == decoded_name.lower()] # we search for the pilots without considering lower/uppercase
    
    if not matches.empty: # if found

        original_name = riders_info_df.loc[matches.index[0], "Riders All Time in All Classes"]
        rider = riders_info_df[riders_info_df["Riders All Time in All Classes"] == original_name].iloc[0]
        
        victories = pd.to_numeric(rider["Victories"], errors="coerce") # ensures numeric values are indeed, numeric values
        world_championships = pd.to_numeric(rider["World Championships"], errors="coerce")
        
        result = { # creates the result taking the matches and if not, establishes everything into 0
            "name": utils.format_rider_name(rider["Riders All Time in All Classes"]),
            "victories": int(victories) if not pd.isna(victories) else 0,
            "world_championships": int(world_championships) if not pd.isna(world_championships) else 0
        }
        return result
    
    for idx, original_name in enumerate(riders_info_df["Riders All Time in All Classes"]): # if it does not find the rider tries another less restricted search
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
    
    raise HTTPException(status_code=204, detail="Piloto no encontrado") # if nothing, raises an exception


@app.get("/api/circuits")
def get_top_circuits(limit: int = None):
    """
    Obtains circuits with the most number of GPs held and converts them into a dict.
    If the limit is None, every circuit will be selected.
    """
    circuits_df["GPs_Held"] = pd.to_numeric(circuits_df["GPs_Held"], errors="coerce").fillna(0).astype(int) # ensures numeric values are indeed, numeric values
    
    if limit is None: # if limit is None selects every circuit
        df = circuits_df
    else:
        df = circuits_df.nlargest(limit, "GPs_Held")
    
    top_circuits = df[["Circuit", "Country", "GPs_Held"]]
    renamed_circuits = top_circuits.rename(columns={
        "Circuit": "name",
        "Country": "country",
        "GPs_Held": "gps_held",
    })
    
    records = renamed_circuits.to_dict(orient="records") # converts the result df to a dict and cleans NaN values
    clean_records = [clean_nan_values(record) for record in records]
    
    return clean_records


@app.get("/api/circuits/{name}")
def get_circuit_details(name: str):
    """
    Obtains details from a circuit based on
    their name.
    """
    decoded_name = name.replace("_", " ") # converts URL name format into df name format and prints its name for utility purposes
    print(f"Searching data for the circuit... -> {decoded_name}")
    
    circuit = circuits_df[circuits_df["Circuit"].str.lower() == decoded_name.lower()] # we search for the circuits without considering lower/uppercase
    
    if not circuit.empty:
        circuit = circuit.iloc[0]
        gps_held = pd.to_numeric(circuit["GPs_Held"], errors="coerce")
        
        return { # creates the result taking the matches and if not, establishes everything into 0
            "name": circuit["Circuit"],
            "country": circuit["Country"],
            "gps_held": int(gps_held) if not pd.isna(gps_held) else 0
        }
    
    for idx, circuit_name in enumerate(circuits_df["Circuit"]): # if it does not find the rider tries another less restricted search
        if decoded_name.lower() in circuit_name.lower():
            circuit = circuits_df.iloc[idx]
            gps_held = pd.to_numeric(circuit["GPs_Held"], errors="coerce")
            
            return {
                "name": circuit["Circuit"],
                "country": circuit["Country"],
                "gps_held": int(gps_held) if not pd.isna(gps_held) else 0
            }
    
    raise HTTPException(status_code=204, detail="Circuito no encontrado") # if nothing, raises an exception


## UVICORN USAGE

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)