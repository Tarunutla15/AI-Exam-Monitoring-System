# Use an official Python image
FROM python:3.10

# Set environment variables to avoid buffering
ENV PYTHONUNBUFFERED=1

# Install system dependencies for dlib
RUN apt-get update && apt-get install -y \
    cmake \
    libopenblas-dev \
    liblapack-dev \
    libx11-dev \
    && rm -rf /var/lib/apt/lists/*

# Create and set the working directory
WORKDIR /app

# Copy project files
COPY . .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Collect static files (for Django)
RUN python manage.py collectstatic --noinput

# Expose port 8000 for Django
EXPOSE 8000

# Start the Django app using Gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "backend1.wsgi.application"]
