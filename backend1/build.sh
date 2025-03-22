#!/bin/bash
set -o errexit

# Install system dependencies
apt-get update && apt-get install -y \
    cmake \
    build-essential \
    libopenblas-dev \
    liblapack-dev \
    libx11-dev \
    libjpeg-dev  # Added jpeg development library

# Reduce parallel build jobs to prevent OOM errors
export MAKEFLAGS="-j2"

# Upgrade pip and setuptools for better compatibility
pip install --upgrade pip setuptools

# Install Python requirements with no cache
pip install --no-cache-dir -r requirements.txt