from fastapi import FastAPI, HTTPException # type: ignore
from fastapi.middleware.cors import CORSMiddleware # type: ignore
import uvicorn # type: ignore
import pandas as pd
import numpy as np
from back import utils
import os

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
    riders_info_df["Victories"] = pd.to_numeric(riders_info_df["Victories"], errors="coerce").fillna(0).astype(int) # ensures numeric values are numeric
    riders_info_df["2nd places"] = pd.to_numeric(riders_info_df["2nd places"], errors="coerce").fillna(0).astype(int)
    riders_info_df["3rd places"] = pd.to_numeric(riders_info_df["3rd places"], errors="coerce").fillna(0).astype(int)
    riders_info_df["Pole positions from '74 to 2022"] = pd.to_numeric(riders_info_df["Pole positions from '74 to 2022"], errors="coerce").fillna(0).astype(int)
    riders_info_df["World Championships"] = pd.to_numeric(riders_info_df["World Championships"], errors="coerce").fillna(0).astype(int)

    df = riders_info_df if limit is None else riders_info_df.nlargest(limit, "Victories") # filter by result limit

    columns_to_select = ["Riders All Time in All Classes", "Victories", "2nd places", "3rd places", "Pole positions from '74 to 2022", "World Championships"] # verify if "Image" exists in the Df and creates it
    if "Image" in df.columns:
        columns_to_select.append("Image")

    result = df[columns_to_select].rename(columns={ # formats names and apply name change
        "Riders All Time in All Classes": "name",
        "Victories": "victories",
        "2nd places": "2nd_places",
        "3rd places": "3rd_places",
        "Pole positions from '74 to 2022": "poles",
        "World Championships": "world_championships"
    })
    result["name"] = result["name"].apply(utils.format_rider_name)
    result["image"] = result["name"].apply(  # applies image
        lambda x: f"/pilots/{x}.png" if os.path.exists(f"public/pilots/{x}.png") else "/pilots/pilot_default.png"
    )

    records = result.to_dict(orient="records") # converts df into a dict
    clean_records = [clean_nan_values(record) for record in records]

    return clean_records


@app.get("/api/riders/{name}")
def get_rider_details(name: str):
    """
    Obtains details from a rider based on
    their name, including an image path.
    """
    decoded_name = name.replace("_", " ") # converts URL name format into df name format and prints its name for utility purposes
    print(f"Searching data for the pilot... -> {decoded_name}")
    
    original_names = riders_info_df["Riders All Time in All Classes"].apply(utils.format_rider_name) # formats the pilots names to ease up the search
    
    matches = original_names[original_names.str.lower() == decoded_name.lower()] # we search for the pilots without considering lower/uppercase
    
    if not matches.empty: # if found
        original_name = riders_info_df.loc[matches.index[0], "Riders All Time in All Classes"]
        rider = riders_info_df[riders_info_df["Riders All Time in All Classes"] == original_name].iloc[0]
        
        victories = pd.to_numeric(rider["Victories"], errors="coerce") # ensures numeric values are indeed, numeric values
        second_places = pd.to_numeric(rider["2nd places"], errors="coerce")
        third_places = pd.to_numeric(rider["3rd places"], errors="coerce")
        poles = pd.to_numeric(rider["Pole positions from '74 to 2022"], errors="coerce")
        world_championships = pd.to_numeric(rider["World Championships"], errors="coerce")
        
        formatted_name = utils.format_rider_name(rider["Riders All Time in All Classes"])
        
        result = {
            "name": formatted_name,
            "victories": int(victories) if not pd.isna(victories) else 0,
            "second_places": int(second_places) if not pd.isna(second_places) else 0,
            "third_places": int(third_places) if not pd.isna(third_places) else 0,
            "poles": int(poles) if not pd.isna(poles) else 0,
            "world_championships": int(world_championships) if not pd.isna(world_championships) else 0,
            "image": f"/pilots/{formatted_name}.png" if os.path.exists(f"public/pilots/{formatted_name}.png") else "/pilots/pilot_default.png"
        }
        return result
    
    for idx, original_name in enumerate(riders_info_df["Riders All Time in All Classes"]): # if it does not find the rider tries another less restricted search
        formatted_name = utils.format_rider_name(original_name)
        if decoded_name.lower() in formatted_name.lower():

            rider = riders_info_df.iloc[idx]
            victories = pd.to_numeric(rider["Victories"], errors="coerce")
            world_championships = pd.to_numeric(rider["World Championships"], errors="coerce")
            
            result = {
            "name": formatted_name,
            "victories": int(victories) if not pd.isna(victories) else 0,
            "second_places": int(second_places) if not pd.isna(second_places) else 0,
            "third_places": int(third_places) if not pd.isna(third_places) else 0,
            "poles": int(poles) if not pd.isna(poles) else 0,
            "world_championships": int(world_championships) if not pd.isna(world_championships) else 0,
            "image": f"/pilots/{formatted_name}.png" if os.path.exists(f"public/pilots/{formatted_name}.png") else "/pilots/pilot_default.png"
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

    columns_to_select = ["Circuit", "Country", "GPs_Held"] # verify if "Image" exists in the Df and creates it
    if "Image" in df.columns:
        columns_to_select.append("Image")
    
    top_circuits = df[["Circuit", "Country", "GPs_Held"]]
    renamed_circuits = top_circuits.rename(columns={
        "Circuit": "name",
        "Country": "country",
        "GPs_Held": "gps_held",
    })
    renamed_circuits["country"] = renamed_circuits["country"].apply(utils.format_country_name) # apply country formatted name
    renamed_circuits["image"] = renamed_circuits["name"].apply(  # applies image
        lambda x: f"/tracks/{x}.png" if os.path.exists(f"public/tracks/{x}.png") else "/tracks/circuit_default.png"
    )
    
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
         
        return {
            "name": circuit["Circuit"],
            "country": utils.format_country_name(circuit["Country"]),
            "gps_held": int(gps_held) if not pd.isna(gps_held) else 0,
            "image": f"/tracks/{circuit['Circuit']}.png" if os.path.exists(f"public/tracks/{circuit['Circuit']}.png") else "/tracks/circuit_default.png"
        }
    
    for idx, circuit_name in enumerate(circuits_df["Circuit"]): # if it does not find the rider tries another less restricted search
        if decoded_name.lower() in circuit_name.lower():
            circuit = circuits_df.iloc[idx]
            gps_held = pd.to_numeric(circuit["GPs_Held"], errors="coerce")
            
            return {
            "name": circuit["Circuit"],
            "country": utils.format_country_name(circuit["Country"]),
            "gps_held": int(gps_held) if not pd.isna(gps_held) else 0,
            "image": f"/tracks/{circuit['Circuit']}.png" if os.path.exists(f"public/tracks/{circuit['Circuit']}.png") else "/tracks/circuit_default.png"
        }
    
    raise HTTPException(status_code=204, detail="Circuito no encontrado") # if nothing, raises an exception


@app.get("/api/constructors")
def get_top_constructors(limit: int = None):
    """
    Obtains constructors with the most championships and converts them into a dict.
    If the limit is None, every constructor will be selected.
    """
    # Get unique constructors from races_winners_df to count their victories
    constructor_victories = races_winners_df['Constructor'].value_counts().reset_index()
    constructor_victories.columns = ['Constructor', 'Victories']
    
    # Get constructor championships from constructors_df
    constructor_championships = constructors_df['Constructor'].value_counts().reset_index()
    constructor_championships.columns = ['Constructor', 'Championships']
    
    # Merge the two dataframes to get both victories and championships
    merged_df = pd.merge(constructor_victories, constructor_championships, on='Constructor', how='left')
    merged_df['Championships'] = merged_df['Championships'].fillna(0).astype(int)
    
    # Get classes for each constructor (taking the most recent or common one)
    constructor_classes = races_winners_df.groupby('Constructor')['Class'].agg(lambda x: x.value_counts().index[0]).reset_index()
    
    # Merge with classes
    merged_df = pd.merge(merged_df, constructor_classes, on='Constructor', how='left')
    
    # Sort by championships (primary) and victories (secondary)
    merged_df = merged_df.sort_values(by=['Championships', 'Victories'], ascending=False)
    
    # Apply limit if provided
    if limit is not None:
        merged_df = merged_df.head(limit)
    
    # Rename columns for consistent API response
    result = merged_df.rename(columns={
        'Constructor': 'name',
        'Championships': 'constructor_championships',
        'Victories': 'victories',
        'Class': 'class'
    })
    
    # Add image paths
    result['image'] = result['name'].apply(
        lambda x: f"/constructors/{x}.png" if os.path.exists(f"public/constructors/{x}.png") else "/constructors/constructor_default.png"
    )
    
    # Convert to dict and clean NaN values
    records = result.to_dict(orient="records")
    clean_records = [clean_nan_values(record) for record in records]
    
    return clean_records


@app.get("/api/constructor/{name}")
def get_constructor_details(name: str):
    """
    Obtains details from a constructor based on
    their name, including an image path.
    """
    decoded_name = name.replace("_", " ")
    print(f"Searching data for the constructor... -> {decoded_name}")
    
    # Check if constructor exists in races_winners_df
    constructor_data = races_winners_df[races_winners_df['Constructor'].str.lower() == decoded_name.lower()]
    
    if not constructor_data.empty:
        # Get the exact constructor name with correct casing
        constructor_name = constructor_data['Constructor'].iloc[0]
        
        # Count victories
        victories = len(constructor_data)
        
        # Get the most common class for this constructor
        constructor_class = constructor_data['Class'].value_counts().index[0]
        
        # Check championships
        championships_data = constructors_df[constructors_df['Constructor'].str.lower() == decoded_name.lower()]
        championships = len(championships_data) if not championships_data.empty else 0
        
        result = {
            "name": constructor_name,
            "class": constructor_class,
            "constructor_championships": championships,
            "victories": victories,
            "image": f"/constructors/{constructor_name}.png" if os.path.exists(f"public/constructors/{constructor_name}.png") else "/constructors/constructor_default.png"
        }
        return result
    
    # If not found by exact match, try partial match
    for constructor_name in races_winners_df['Constructor'].unique():
        if decoded_name.lower() in constructor_name.lower():
            constructor_data = races_winners_df[races_winners_df['Constructor'] == constructor_name]
            
            # Count victories
            victories = len(constructor_data)
            
            # Get the most common class for this constructor
            constructor_class = constructor_data['Class'].value_counts().index[0]
            
            # Check championships
            championships_data = constructors_df[constructors_df['Constructor'] == constructor_name]
            championships = len(championships_data) if not championships_data.empty else 0
            
            result = {
                "name": constructor_name,
                "class": constructor_class,
                "constructor_championships": championships,
                "victories": victories,
                "image": f"/constructors/{constructor_name}.png" if os.path.exists(f"public/constructors/{constructor_name}.png") else "/constructors/constructor_default.png"
            }
            return result
    
    raise HTTPException(status_code=204, detail="Constructor no encontrado")


## UVICORN USAGE

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)