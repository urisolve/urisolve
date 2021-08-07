#!/bin/sh

BASE_VERSION='base_x64'
BUILD_VERSION='build_x64'       # Version to be uploaded

echo "Building alarm base"
cd ./base && docker build -t docker.pkg.github.com/txroot/urisolve/webappx64:${BASE_VERSION} . && docker push docker.pkg.github.com/txroot/urisolve/webappx64:${BASE_VERSION}

echo "Building alarm base"
cd ../build && docker build -t docker.pkg.github.com/txroot/urisolve/webappx64:${BUILD_VERSION} . && docker push docker.pkg.github.com/txroot/urisolve/webappx64:${BUILD_VERSION}