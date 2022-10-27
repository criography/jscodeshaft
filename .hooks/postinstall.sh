#!/usr/bin/env bash

echo "dirname:$(dirname "$0")"
echo "pwd:$(pwd)"

mv ./node_modules/ast-types ./node_modules/ast-types.bak
cp -a ./node_modules/@gkz/ast-types ./node_modules/ast-types

