#!/bin/bash

if test "$#" -ne 2; then
   echo "usage: prepare_appcodes.sh <project_folder> <appcode_folder/chaincode>"
   exit 2
fi

# exit when any command fails
set -e

project_folder=$1
appcode_folder=$2
chaincode=$3

config_file=$project_folder/network.yaml

rm -rf app-flow/appcode
mkdir -p app-flow/appcode

echo "yq '.network.chaincodes[] | select(.name | contains("comm-paper")) | .application[].name' $config_file -c -r"
appcodes=$(yq '.network.chaincodes[] | select(.name | contains("comm-paper")) | .application[].name' $config_file -c -r)
for appcode in $appcodes; do
  echo "creating hlf-kube/chaincode/$appcode.tar"
  echo "running tar -czf app-flow/appcode/$appcode.tar -C $appcode_folder $appcode/"


  tar -czf app-flow/appcode/$appcode.tar -C $appcode_folder $appcode/
done

rm -rf app-flow/netconfig
mkdir -p app-flow/netconfig

tar -czf app-flow/netconfig/network.tar -C $project_folder ./
