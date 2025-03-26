import kagglehub  # type: ignore
import os
import shutil

def download_dataset():
    """
    Downloads the dataset if not already downloaded in /data
        :return: Route where all the data is downloaded
    """
    dataset = "alrizacelk/moto-gp-world-championship19492022"
    save_path = "./data"
    
    # Verifies if data is already present
    if os.path.exists(save_path) and os.listdir(save_path):
        print(f"Data is already downloaded in: {save_path}, skipping download")
        return save_path
    
    # If not present, downloads it and moves it into /data
    print(f"Downloading {dataset}...")
    path = kagglehub.dataset_download(dataset)
    os.makedirs(save_path, exist_ok=True)
    for file_name in os.listdir(path):
        src_file = os.path.join(path, file_name)
        dest_file = os.path.join(save_path, file_name)
        shutil.move(src_file, dest_file)
    os.rmdir("../../../../../" + path) # removes the "kagglehub" directory each time, because if not, it won't download anything
    print(f"Files downloaded and moved to {save_path}")
    return save_path

def format_rider_name(name: str) -> str:
    """
    Formats the rider name from the format "SURNAME Name" to
    "Name Surname"
        :return: The string of the name formatted
    """
    parts = name.split()
    if len(parts) > 1 and parts[0].isupper():
        return f"{parts[1].capitalize()} {parts[0].capitalize()}"
    return name.title()

def format_country_name(country_code: str) -> str:
    """
    Formats the country name from the two letter format to full length country.
    For non recognized countries it return the two letter code.
        :return: The string of the country
    """
    country_mapping = {
        'ES': 'Spain',
        'IT': 'Italy',
        'TH': 'Thailand',
        'GB': 'Great Britain',
        'ZA': 'South Africa',
        'AU': 'Australia',
        'FR': 'France',
        'PT': 'Portugal',
        'TT': 'Trinidad and Tobago',
        'JP': 'Japan',
        'TR': 'Turkey',
        'BE': 'Belgium',
        'DE': 'Germany',
        'AR': 'Argentina',
        'ID': 'India',
        'AT': 'Austria',
        'FI': 'Finland',
        'BR': 'Brazil',
        'HU': 'Hungary',
        'CZ': 'Czech Republic',
        'NL': 'Netherlands',
        'IR': 'Ireland',
        'SE': 'Sweden',
        'YU': 'Yugoslavia',
        'MY': 'Malaysia',
        'QA': 'Qatar',
        'US': 'United States',
        'CA': 'Canada',
        'CH': 'Switzerland',
        'CN': 'China',
        'VE': 'Venezuela'
    }
    
    return country_mapping.get(country_code.upper(), country_code)
