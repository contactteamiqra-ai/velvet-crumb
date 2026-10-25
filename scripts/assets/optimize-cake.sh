#!/usr/bin/env bash
set -euo pipefail
# Run from repository root after author-cake.py. Do not flatten/join animated roots.
npx --yes @gltf-transform/cli@4.5.1 optimize \
  public/assets/cake/atelier-cake.glb work/assets/atelier-cake-optimized.glb \
  --compress meshopt --texture-compress webp \
  --flatten false --join false --instance false --palette false \
  --simplify-ratio .28 --simplify-error .0005
cp work/assets/atelier-cake-optimized.glb public/assets/cake/atelier-cake.glb
