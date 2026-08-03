#!/bin/sh

echo "Starting Pinky App..."

python manage.py migrate

python manage.py collectstatic --noinput

python manage.py create_admin

exec gunicorn config.wsgi:application --bind 0.0.0.0:8000