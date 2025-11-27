#!/bin/bash

# Icon Generation Script for macOS
# This script converts SVG to ICNS format for macOS

echo "🎨 Generating macOS icon from SVG..."

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

# Check if iconutil is available (macOS only)
if ! command -v iconutil &> /dev/null; then
    echo "❌ iconutil not found. This script requires macOS."
    exit 1
fi

# Create iconset directory
ICONSET_DIR="build/icon.iconset"
mkdir -p "$ICONSET_DIR"

# Convert SVG to PNG in various sizes required for macOS
echo "📐 Converting SVG to PNG sizes..."

sizes=(
    "16:16"
    "32:32"
    "64:64"
    "128:128"
    "256:256"
    "512:512"
    "1024:1024"
)

# Generate @2x versions
for size in "${sizes[@]}"; do
    IFS=':' read -r width height <<< "$size"
    
    # Regular size
    convert -background none -resize "${width}x${height}" assets/icon.svg "$ICONSET_DIR/icon_${width}x${height}.png" 2>/dev/null || \
    convert -background none -resize "${width}x${height}" assets/icon.svg "PNG32:$ICONSET_DIR/icon_${width}x${height}.png"
    
    # @2x size
    double_width=$((width * 2))
    double_height=$((height * 2))
    convert -background none -resize "${double_width}x${double_height}" assets/icon.svg "$ICONSET_DIR/icon_${width}x${height}@2x.png" 2>/dev/null || \
    convert -background none -resize "${double_width}x${double_height}" assets/icon.svg "PNG32:$ICONSET_DIR/icon_${width}x${height}@2x.png"
done

# Create ICNS file
echo "🔨 Creating ICNS file..."
iconutil -c icns "$ICONSET_DIR" -o "build/icon.icns"

if [ $? -eq 0 ]; then
    echo "✅ Icon generated successfully: build/icon.icns"
    echo "🧹 Cleaning up iconset directory..."
    rm -rf "$ICONSET_DIR"
else
    echo "❌ Failed to create ICNS file"
    exit 1
fi

