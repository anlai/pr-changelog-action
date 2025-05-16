#!/bin/bash

INPUT=$1
OUTPUT_FILE=${2:-"CHANGELOG.md"}
CHANGELOG="CHANGELOG.md"
TEMP_FILE="TEMP.md"

if [ -f "$CHANGELOG" ] && grep -q "^## Current$" "$CHANGELOG"; then
    tail -n +3 $CHANGELOG > $TEMP_FILE
else
    touch $TEMP_FILE
fi

{ echo "$INPUT"; cat $TEMP_FILE; } > temp && mv temp $TEMP_FILE
{ echo ""; cat $TEMP_FILE; } > temp && mv temp $TEMP_FILE
{ echo "## Current"; cat $TEMP_FILE; } > temp && mv temp $TEMP_FILE

cp $TEMP_FILE $OUTPUT_FILE