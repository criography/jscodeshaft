#!/usr/bin/env bash

echo "dirname:$(dirname "$0")"
echo "pwd:$(pwd)"

# swap outdated `ast-types package with `@gkz/ast-types`,
# so the codemods can work with Flow-based codebases
# utilising Class components

WORKING_DIRECTORY="$(pwd)"
PARENT_DIRECTORY="$(basename "$(dirname "$WORKING_DIRECTORY")")"

if [[ $PARENT_DIRECTORY == "node_modules" ]]; then
  PACKAGES_DIRECTORY=$PARENT_DIRECTORY
else
  PACKAGES_DIRECTORY="$WORKING_DIRECTORY/node_modules"
fi

mv "$PACKAGES_DIRECTORY/ast-types" "$PACKAGES_DIRECTORY/ast-types.bak"
cp -a "$PACKAGES_DIRECTORY/@gkz/ast-types" "$PACKAGES_DIRECTORY/ast-types"

