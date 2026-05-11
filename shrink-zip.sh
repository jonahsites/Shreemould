#!/bin/zsh
# Shrink script for Google AI Studio upload

set -e

echo "🧹 Cleaning large dirs..."
rm -rf node_modules dist public/models DISPLAY topcar-* *.glb *.zip

echo "📦 Zipping slim version..."
zip -r slim-topcar.zip . \
  -x "node_modules/*" "dist/*" "public/models/*" "DISPLAY/*" "*.glb" "*.zip" "topcar-*/*" \
  -x "*.DS_Store" "*.log" ".git/*"

echo "📊 Size check:"
du -sh slim-topcar.zip
echo "✅ Done! Upload slim-topcar.zip (should be <20MB). Run 'npm i && npm run build' after unzip to restore."

