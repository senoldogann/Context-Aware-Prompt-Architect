#!/bin/bash

# Windows Icon Generation Script
# This script converts SVG to ICO format for Windows

echo "🎨 Generating Windows icon from SVG..."

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick not found. Installing via Homebrew..."
    if command -v brew &> /dev/null; then
        brew install imagemagick
    else
        echo "❌ Homebrew not found. Please install ImageMagick manually:"
        echo "   brew install imagemagick"
        exit 1
    fi
fi

# Windows ICO requires multiple sizes
echo "📐 Converting SVG to ICO with multiple sizes..."

sizes=(16 32 48 64 128 256)

# Create temporary directory for PNG files
TEMP_DIR=$(mktemp -d)
PNG_FILES=()

for size in "${sizes[@]}"; do
    png_file="$TEMP_DIR/icon_${size}x${size}.png"
    convert -background none -resize "${size}x${size}" assets/icon.svg "$png_file" 2>/dev/null || \
    convert -background none -resize "${size}x${size}" assets/icon.svg "PNG32:$png_file"
    
    if [ -f "$png_file" ]; then
        PNG_FILES+=("$png_file")
    fi
done

# Create ICO file from multiple PNG sizes
echo "🔨 Creating ICO file..."
convert "${PNG_FILES[@]}" build/icon.ico

if [ $? -eq 0 ]; then
    echo "✅ Windows icon generated successfully: build/icon.ico"
    rm -rf "$TEMP_DIR"
else
    echo "❌ Failed to create ICO file"
    rm -rf "$TEMP_DIR"
    exit 1
fi

