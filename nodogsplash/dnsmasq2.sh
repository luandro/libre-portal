#!/bin/sh

iptables -L -vn -t mangle
ps | grep dns
cp /var/etc/dnsmasq.conf.cfg02411c /etc/dnsmasq2
gwip=$(uci get network.lan.ipaddr)
dnsmasq2=$(cat <<EOF
  # auto-generated config file from /etc/config/dhcp
  domain=lan
  address=/#/$gwip
  addn-hosts=/tmp/hosts
  user=dnsmasq
  group=dnsmasq
  port=53530
EOF
)

echo $dnsmasq2 >> /etc/dnsmasq2

sed -i '/#FirewallRule allow udp port 53/c\FirewallRule allow udp port 53530' /etc/nodogsplash/nodogsplash.conf
sed -i '/#FirewallRule allow tcp port 53/c\FirewallRule allow tcp port 53530' /etc/nodogsplash/nodogsplash.conf

rclocal=$(cat <<EOF
  # the system init finished. By default this file does nothing.
  /usr/sbin/dnsmasq -C /etc/dnsmasq2

  ((sleep 60; \
    iptables -t nat -I ndsOUT 3 -p udp -m udp --dport 53 -j DNAT --to-destination $gwip:53530 ; \
    iptables -t nat -I ndsOUT 4 -p tcp -m tcp --dport 53 -j DNAT --to-destination $gwip:53530 )&)
  exit 0
EOF
)
echo $rclocal >> /etc/rc.local