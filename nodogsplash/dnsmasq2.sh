#!/bin/sh

iptables -L -vn -t mangle
ps | grep dns
cp /var/etc/dnsmasq.conf.cfg02411c /etc/dnsmasq2
vim /etc/dnsmasq2
address=10.5.0.1
dnsmasq2=$(cat <<EOF
  # auto-generated config file from /etc/config/dhcp
  domain=lan
  address=/#/$address
  addn-hosts=/tmp/hosts
  user=dnsmasq
  group=dnsmasq
  port=53530
EOF
)

sed -i '/FirewallRule allow udp port 53/c\FirewallRule allow udp port 53530' /etc/nodogsplash/nodogsplash.conf
sed -i '/FirewallRule allow tcp port 53/c\FirewallRule allow tcp port 53530' /etc/nodogsplash/nodogsplash.conf

vim /etc/rc.local
rc-local=$(cat <<EOF
  # the system init finished. By default this file does nothing.
  /usr/sbin/dnsmasq -C /etc/dnsmasq2

  ((sleep 60; \
    iptables -t nat -I ndsOUT 3 -p udp -m udp --dport 53 -j DNAT --to-destination $address:53530 ; \
    iptables -t nat -I ndsOUT 4 -p tcp -m tcp --dport 53 -j DNAT --to-destination $address:53530 )&)
  exit 0
EOF
)