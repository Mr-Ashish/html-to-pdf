#!/bin/bash

# Cleanup script for generated PDF files
# Usage: ./cleanup.sh

echo "Cleaning up generated PDF files..."

# Clean the output directory
if [ -d "output" ]; then
  rm -f output/*.pdf
  echo "✓ Cleaned output directory"
fi

# Remove test files from root
rm -f test*.pdf sample*.pdf 2>/dev/null

echo "Cleanup complete!"
