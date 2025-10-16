#!/bin/sh

# Exit on error
set -e

# Configuration
BUCKET_NAME="ghf-short-term"
DB_FILE_PATH="/var/www/html/data/guyra.sqlite"
DB_FILE_NAME="guyra.sqlite"
GCS_DB_PATH="gs://${BUCKET_NAME}/${DB_FILE_NAME}"

# Function to upload the database to GCS
upload_db() {
  echo "Uploading database to GCS..."
  gcloud storage cp "${DB_FILE_PATH}" "${GCS_DB_PATH}"
  echo "Upload complete."
  exit 0
}

# Check if running in Google Cloud Run
if [ -n "$K_SERVICE" ]; then
  echo "Running in Google Cloud Run. Setting up GCS persistence."

  # Download the database from GCS on startup
  echo "Downloading database from GCS..."
  gcloud storage cp "${GCS_DB_PATH}" "${DB_FILE_PATH}" || {
    echo "Database not found in GCS. A new one will be created."
  }

  # Trap SIGTERM to upload the database on shutdown
  trap 'upload_db' TERM

else
  echo "Not running in Google Cloud Run. Skipping GCS persistence for local development."
fi

# Start PHP-FPM and Nginx
service php8.2-fpm start
nginx -g 'daemon off;'
