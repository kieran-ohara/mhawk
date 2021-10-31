#!/bin/bash -xe

PUSH=""

if [[ "${PUSH_IMAGE}" == "true" ]]; then
    PUSH="--push"
fi

docker buildx build \
  --platform linux/amd64 \
  --tag $IMAGE \
  ${PUSH} \
  $BUILD_CONTEXT
