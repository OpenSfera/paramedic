#!/bin/bash
NAME="paramedic"

if [ "$EUID" -ne 0 ]
then
  echo "ERR: Please run as root"
  exit 1
fi

removeExistentFile() {
  if [ -e $1 ]
  then
    rm -rf $1
  fi
}

systemctl stop $NAME

removeExistentFile -rf /lib/systemd/system/$NAME.service
systemctl daemon-reload

removeExistentFile /usr/local/sfera/$NAME
