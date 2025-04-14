#!/bin/bash

# Create image directories if they don't exist
mkdir -p public/images

# Download a sample logo for Workbrand
curl -o public/images/workbrand-logo.png "https://via.placeholder.com/300x100/2F3295/FFFFFF?text=WORKBRAND"

# Download company logos
curl -o public/images/mastercard-logo.png "https://via.placeholder.com/300x300/EB001B/FFFFFF?text=Mastercard"
curl -o public/images/google-logo.png "https://via.placeholder.com/300x300/4285F4/FFFFFF?text=Google"
curl -o public/images/walmart-logo.png "https://via.placeholder.com/300x300/0071CE/FFFFFF?text=Walmart"
curl -o public/images/hubspot-logo.png "https://via.placeholder.com/300x300/FF7A59/FFFFFF?text=HubSpot"
curl -o public/images/nasdaq-logo.png "https://via.placeholder.com/300x300/0059A1/FFFFFF?text=Nasdaq"
curl -o public/images/loreal-logo.png "https://via.placeholder.com/300x300/000000/FFFFFF?text=L%27Oreal"

echo "All images downloaded successfully!" 