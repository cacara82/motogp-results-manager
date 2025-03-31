FROM python:3.10

WORKDIR /motogp-results-manager-server

# Instalar Poetry
RUN pip install poetry

# Copiar los archivos de configuración de Poetry
COPY pyproject.toml .
COPY poetry.lock .

# Instalar dependencias
RUN poetry install --no-root

# Copiar el resto de la aplicación
COPY . .

EXPOSE 8000

CMD ["poetry", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
