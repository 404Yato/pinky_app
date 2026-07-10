#!/bin/sh

echo "Starting Pinky App..."

python manage.py migrate

exec python manage.py runserver 0.0.0.0:8000 --noreload