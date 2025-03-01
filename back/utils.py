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



download_dataset()