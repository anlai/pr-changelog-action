#!/bin/bash

VERBOSE=false

TEST_OUTPUT="CHANGELOG-TEST.md"

# Check if any input parameter is "--v"
for arg in "$@"; do
    if [ "$arg" == "--v" ]; then
        VERBOSE=true
        break
    fi
done

for folder in */; do

    cd $folder

    echo ""
    echo "== $folder == "

    if [ "$VERBOSE" = true ]; then
        echo " ---input---"
        cat input.txt
        echo " ---input---"
    fi

    echo ""
    echo "executing..."
    ../../update-changelog.sh "$(cat input.txt)" "$TEST_OUTPUT"

    if [ "$VERBOSE" = true ]; then
        echo ""
        echo "---output---"
        cat "$TEST_OUTPUT"
        echo "---output---"
    fi

    # Compare the output with the expected output in CHANGELOG.md
    diff --ignore-all-space -u <(cat "$TEST_OUTPUT") <(cat output.txt) || {
        echo "Error: Output does not match expected output"
        echo "== GENERATED OUTPUT == "
        cat "$TEST_OUTPUT"
        echo "== GENERATED OUTPUT == "
        exit 1
    }

    rm "$TEST_OUTPUT"
    
    echo ""
    echo "PASSED"
    echo "== END $folder == "    
    echo ""

    cd ..

done