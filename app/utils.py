import kagglehub as kh # type: ignore
import shutil
import os

def fetchData():
    """
    Fetches the dataset from Kaggle and moves it to the 'motogp_library' folder
    within the project directory.
    """
    # Obtener la ruta del proyecto
    project_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

    # Ruta destino en el proyecto
    dest_path = os.path.join(project_dir, "motogp_library")
    os.makedirs(dest_path, exist_ok=True)

    # Descargar el dataset
    dataset_path = kh.dataset_download("alrizacelk/moto-gp-world-championship19492022")
    print(f"Dataset downloaded to: {dataset_path}")

    # Mover todos los archivos descargados al directorio del proyecto
    for file_name in os.listdir(dataset_path):
        full_file_path = os.path.join(dataset_path, file_name)
        shutil.move(full_file_path, dest_path)

    print(f"Dataset moved to: {dest_path}")