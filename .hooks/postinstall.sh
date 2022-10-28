#!/usr/bin/env bash


# swap outdated `ast-types` package with `@gkz/ast-types`,
# so the codemods can work with Flow-based codebases
# utilising Class components

WORKING_DIRECTORY="$(pwd)"
PARENT_PATH="$(dirname "$WORKING_DIRECTORY")"
PARENT_DIRECTORY="$(basename "$PARENT_PATH")"


if [[ $PARENT_DIRECTORY == "node_modules" ]]; then
  PACKAGES_DIRECTORY="$PARENT_PATH"
else
  PACKAGES_DIRECTORY="$WORKING_DIRECTORY/node_modules"
fi


rm -rf "$PACKAGES_DIRECTORY/ast-types"
cp -a "$PACKAGES_DIRECTORY/@gkz/ast-types" "$PACKAGES_DIRECTORY/ast-types"

