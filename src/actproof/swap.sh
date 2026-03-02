#!/bin/bash
# ActProof Demo - Manual Variant Swap
# Usage: ./swap.sh [heavy|light]

VARIANT=${1:-light}

echo "[SWAP] Changing ServiceX to variant: $VARIANT"

export SERVICEX_VARIANT=$VARIANT

docker-compose stop servicex
docker-compose rm -f servicex
docker-compose up -d --build servicex

echo "[SWAP] Done. ServiceX now running in $VARIANT mode."
echo "[SWAP] Verify: curl http://localhost:3000/health"
