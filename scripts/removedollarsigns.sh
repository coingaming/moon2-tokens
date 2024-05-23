#!/bin/bash

for f in tokens/*.json; do
  echo "Processing $f"
  perl -pi -e 's/\$//g' "$f"
done


