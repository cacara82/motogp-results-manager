import kagglehub as kh # type: ignore
import shutil
import os

def fetchData():
    """
    This function fetches the most recent data for the dataset from Kaggle and 
    moves it to the 'motogp_library' folder within the project directory.
    """
    # We get the root of the project dir
    project_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

    # We get the destination path in the project dir and create it if it doesn't exist
    dest_path = os.path.join(project_dir, "motogp_library")
    os.makedirs(dest_path, exist_ok=True)

    # We download the last version of the dataset from Kaggle
    dataset_path = kh.dataset_download("alrizacelk/moto-gp-world-championship19492022", force_download=True)
    print(f"Dataset downloaded to: {dataset_path}")

    # We move all the files downloaded in their path to the path in the project
    for file_name in os.listdir(dataset_path):
        full_file_path = os.path.join(dataset_path, file_name)
        shutil.move(full_file_path, dest_path)

    print(f"Dataset moved to: {dest_path}")