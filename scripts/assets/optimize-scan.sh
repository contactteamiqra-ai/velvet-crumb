#!/usr/bin/env bash
set -euo pipefail
# Run after prepare-cake.py. Retain scan triangles and independent animated roots.
npx --yes @gltf-transform/cli@4.5.1 optimize \
  work/assets/scan-cake.glb public/assets/cake/atelier-cake.glb \
  --compress meshopt --texture-compress webp \
  --flatten false --join false --instance false --palette false --simplify false
