#!/bin/bash

INPUT=$1
OUTPUT_FILE=${2:-"CHANGELOG.md"}
CHANGELOG="CHANGELOG.md"
TEMP_FILE="TEMP.md"

if [ -f "$CHANGELOG" ]; then
    FIRST_LINE=$(grep -v '^/s*$' "$CHANGELOG" | head -n 1)
    { echo ""; cat $CHANGELOG; } > temp && mv temp $TEMP_FILE
    # if [[ "$FIRST_LINE" == "##*" ]]; then
    #     { echo ""; cat $CHANGELOG; } > temp && mv temp $TEMP_FILE
    # else
    #     cp $CHANGELOG $TEMP_FILE
    # fi
else
    touch $TEMP_FILE
fi

# if [ -f "$CHANGELOG" ] && grep -q "^## Current$" "$CHANGELOG"; then
#     tail -n +3 $CHANGELOG > $TEMP_FILE
# else
#     touch $TEMP_FILE
# fi

# { echo "$INPUT"; cat $TEMP_FILE; } > temp && mv temp $TEMP_FILE
# { echo ""; cat $TEMP_FILE; } > temp && mv temp $TEMP_FILE
# { echo "## Current"; cat $TEMP_FILE; } > temp && mv temp $TEMP_FILE

# mv $TEMP_FILE $OUTPUT_FILE

# processed_content=$(echo "$INPUT" | sed '/^$/d' | sed 's/^[[:space:]]*\(.*\)$/- \1/' | sed 's/^- - /- /' | tr -d '\r' | sed -z 's/\n$//')

# processes text in the following manner:
#   remove empty lines
#   ensure each line starts with a "- "
#   remove extra "-" for lines that already started with "- " to begin with
processed_content=$(echo "$INPUT" | grep -v "^[[:space:]]*$" | sed 's/^[[:space:]]*\(.*\)$/- \1/' |  sed 's/^- - /- /' )
{ echo -n "$processed_content"; cat $TEMP_FILE; } > temp && mv temp $OUTPUT_FILE

echo "$processed_content"

# rm $TEMP_FILE