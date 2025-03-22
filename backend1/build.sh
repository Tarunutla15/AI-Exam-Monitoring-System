#!/bin/bash

# Update and install required system packages
apt-get update && apt-get install -y cmake libopenblas-dev liblapack-dev libx11-dev

# Install Python dependencies
pip install -r requirements.txt
