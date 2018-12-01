#!/bin/bash

HOST=http://ec2-18-220-11-131.us-east-2.compute.amazonaws.com

CTX=spotifynd_api

ssh -i ~/.ssh/testdev.pem ec2-user@${HOST} "pwd
cd /opt/nodeapps/${CTX}/
pwd
[ -d v1 ] || mkdir v1
[ -d v1/models ] || mkdir v1/models
[ -d v1/routes ] || mkdir v1/routes
[ -d v1/routes/sub ] || mkdir v1/routes/sub
[ -d v1/services ] || mkdir v1/services
[ -d v1/utils ] || mkdir v1/utils"

scp -i ~/.ssh/testdev.pem *.js package.json *.sh ec2-user@${HOST}:/opt/nodeapps/${CTX}/
scp -i ~/.ssh/testdev.pem -r v1/* ec2-user@${HOST}:/opt/nodeapps/${CTX}/v1