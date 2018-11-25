#!/bin/sh
scp ./nodogsplash/nodog-install.sh root@thisnode.info:/tmp/install.sh
ssh root@thisnode.info 'sh /tmp/install.sh'