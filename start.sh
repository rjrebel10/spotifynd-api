#!/bin/bash

umask 000

if [ $# -ne 1 ]; then
   echo "usage: start.sh <environment>"
   exit 1
fi

ENVIRONMENT=$1
MAINJS=spotifynd_api_server.js
LOGNAME=spotifynd_api_server
DATETIME="$(date +"%Y%m%d%H%M%S")"
API_CTX=spotifynd_api
PWD=`pwd`
PROCESS_ID=$(pgrep -f ${MAINJS})

echo "Checking if all API Forever Services running locally have been stopped..."

if [ "$PROCESS_ID" != "" ]; then
    echo "Stopping All Previous Spotifynd Api Server Forever Services..."
    npm run stop
fi

echo "Starting Spotifynd API server..."

[ -d logs ] || mkdir logs #CHECK IF DIRECTORY EXISTS AND IF IT DOESNT THEN CREATE IT
[ -f logs/${LOGNAME}.log ] && mv logs/${LOGNAME}.log logs/${LOGNAME}.log.${DATETIME} #CHECK IF FILE EXISTS AND IT DOES THEN RENAME IT
forever -w --watchDirectory ${PWD}/v1/ -l ${PWD}/logs/${LOGNAME}.log -c "node --max_old_space_size=6144" start ${MAINJS}
echo "FOREVER RUNNING"

