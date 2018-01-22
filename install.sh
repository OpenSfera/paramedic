#!/bin/bash

NAME="paramedic"

if [ "$EUID" -ne 0 ]
then
  echo "ERR: Please run as root"
  exit 1
fi

grep -q "sfera" /etc/passwd
if [ $? -ne 0 ]
then
  useradd -U -b '/usr/local' sfera
fi

# if hash node 2>/dev/null
# then
#     curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
#     apt-get install -y nodejs
# fi

mkdir -p /usr/local/sfera/$NAME
cp -R * /usr/local/sfera/$NAME

cd /usr/local/sfera/$NAME
npm install
node -e "require('./sferaconf.js').addDefaultConfig();"

mv /usr/local/sfera/$NAME/$NAME.service /lib/systemd/system/$NAME.service
systemctl daemon-reload
systemctl enable $NAME
systemctl start $NAME


if [ ! -e "/etc/sudoers.d/sfera" ]
then
  echo "sfera   ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers.d/sfera
  chmod 400 /etc/sudoers.d/sfera
fi

apt install -y mosquitto mongodb

systemctl start $NAME
