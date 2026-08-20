#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=dev-env.sh
source "${SCRIPT_DIR}/dev-env.sh"

DEVICE_BUILD=false
TUNNEL_BUILD=false
for arg in "$@"; do
  if [[ "${arg}" == "--device" ]]; then
    DEVICE_BUILD=true
  elif [[ "${arg}" == "--tunnel" ]]; then
    TUNNEL_BUILD=true
  fi
done

if [[ "${DEVICE_BUILD}" == true ]]; then
  if [[ "${TUNNEL_BUILD}" == true ]]; then
    echo "[device] Preparing physical device build (Expo tunnel mode)"
    echo "[device] Start Metro with: npm run start:tunnel"
    echo "[device] After install, open the app from the tunnel QR / deep link in the Expo terminal."
    bash "${SCRIPT_DIR}/set-metro-tunnel-packager.sh"
  else
    echo "[device] Preparing physical device build"
    echo "[device] Your Mac LAN IP: ${LOCAL_IP}"
    echo "[device] Phone and Mac must reach each other on the same network."
    echo "[device] If Safari on the phone cannot open http://${LOCAL_IP}:8081/status, use iPhone Personal Hotspot or: npm run ios:device:tunnel"
    bash "${SCRIPT_DIR}/ensure-metro.sh"
    bash "${SCRIPT_DIR}/set-metro-packager-host.sh"
  fi
fi

exec expo run:ios "$@"
