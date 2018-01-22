#!/bin/bash

for file in $(find ./tests/ -name '*.js' | sort -z )
do
  node $file
  if [ $? -eq 1 ]
  then
    exit 1
  fi
done
