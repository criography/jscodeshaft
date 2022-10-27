#!/usr/bin/env bash

echo "dirname:$(dirname "$0")"
echo "pwd:$(pwd)"

# swap outdated `ast-types package with `@gkz/ast-types`,
# so the codemods can work with Flow-based codebases
# utilising Class components

WORKING_DIRECTORY="$(pwd)"
PARENT_PATH="$(dirname "$WORKING_DIRECTORY")"
PARENT_DIRECTORY="$(basename "$PARENT_PATH")"

echo "PARENT_DIRECTORY:$PARENT_DIRECTORY"
echo "PARENT_PATH:$PARENT_PATH"
echo "WORKING_DIRECTORY:$WORKING_DIRECTORY"

if [[ $PARENT_DIRECTORY == "node_modules" ]]; then
  PACKAGES_DIRECTORY="$PARENT_PATH"
else
  PACKAGES_DIRECTORY="$WORKING_DIRECTORY/node_modules"
fi

echo "PACKAGES_DIRECTORY:$PACKAGES_DIRECTORY"

mv "$PACKAGES_DIRECTORY/ast-types" "$PACKAGES_DIRECTORY/ast-types.bak"
cp -a "$PACKAGES_DIRECTORY/@gkz/ast-types" "$PACKAGES_DIRECTORY/ast-types"

