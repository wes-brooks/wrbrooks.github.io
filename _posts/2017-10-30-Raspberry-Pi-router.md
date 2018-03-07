---
title: Using Raspberry Pi 3 running Stretch for a WiFi router
date: 2017-10-30
layout: post
tag: blog
---

There are [several](https://www.raspberrypi.org/documentation/configuration/wireless/access-point.md) [tutorials](https://learn.adafruit.com/setting-up-a-raspberry-pi-as-a-wifi-access-point/overview) out there about turning your Rapberry Pi into a WiFi access point, but they all seem to written for Raspbian Jessie or earlier. There are a few changes in Stretch, the most recent version of the Pi's operating system, that seem to break these tutorials.

Here I will describe what I did to turn my Raspberry Pi 3 into a WiFi router. This should all work for any Pi running Stretch, though I have only tested it on the 3. My desired routing setup is to plug an Ethernet cable from the Pi into a modem, so that the Internet connection through that modem can be shared by several wireless devices.

Differences between what I found in previous tutorials and what I needed to do related mainly to the switch from configuring the WiFi interface device via the `/etc/network/interfaces` file (used under Jessie and prior versions of Raspbian) to using the `/etc/dhcpcd.conf` file (as used by Stretch). Here's how I set up my router:

## Software

Over the course of this tutorial, you'll need to `sudo apt-get install` three packages. But don't install them just yet! Installing `iptables-persistent` as the final step causes it to notice you've changed the defaults already, and prompts you to save your work. It's very convenient! The three packages are:

- hostapd
- dnsmasq
- iptables-persistent

The first is the access point software, which creates and broadcasts a wireless network to which other computers can connect. The second manages the addresses that will be handed out to computers connecting on the new network. And the third makes sure that settings about how to route packets between the wired Ethernet device and the WiFi device are saved, so that the connection will be restored when the Pi is restarted.

### Configure hostapd

First, install `hostapd	` via

`sudo apt-get install hostapd`

You'll configure two files to make your Pi into an access point. First, create the file `/etc/hostapd/hostapd.conf` for editing via `nano`:

`sudo nano /etc/hostapd/hostapd.conf`

This file will hold the settings for your access point. Just copy paste this code, but put your own choices in for `ssid` (this will be the name of the network you're creating) and `wpa_passphrase` (this is the password for connecting to your new network):

```
interface=wlan0
ssid=network_name_here
hw_mode=g
channel=7
ht_capab=[HT40][SHORT-GI-20][DSSS_CCK-40]
wmm_enabled=0
macaddr_acl=0
auth_algs=1
wpa=2
ignore_broadcast_ssid=0
wpa_passphrase=network_password_here
wpa_key_mgmt=WPA-PSK
wpa_pairwise=TKIP
rsn_pairwise=CCMP
```

If you'd like to learn more about these configuration options, check the [documentation](https://wireless.wiki.kernel.org/en/users/documentation/hostapd).

Now you need to tell `hostapd` to read this configuration file when it starts. To do so, edit the `/etc/default/hostapd` file:

`sudo nano /etc/default/hostapd`

and change the line that reads


`DAEMON_CONF=""`

to

`DAEMON_CONF="/etc/hostapd/hostapd.conf"`


### Configure dnsmasq

Install `dnsmasq` via

`sudo apt-get install dnsmasq`

You have to configure two files in order for `dnsmasq` to start assigning IP adresses to devices that connect to your newly configured access point. First, open the `dhcpcd` configuration file in order to assign your Pi a static IP address on the WiFi device. This might not be necessary, but it does give you an address where you can wirelessly SSH into the Pi, so you'll no longer need it to be connected to a monitor and keyboard.

Note that before you can SSH into your Pi, you must enable it for SSH, either by creating an empty file called `ssh` at the top level of the `boot` partition, or by connecting the Pi to a keyboard and monitor, opening a terminal, and using the menu under the `sudo raspi-config` command. Googling "headless Raspberry Pi ssh" will get you answers here.

Back to the main story. At the terminal, enter `sudo nano /etc/dhcpcd.conf`. At the bottom of the file, enter the following lines, but change the `ip_address` and `routers` to whatever address you want to assign to your Pi. 

```
interface wlan0
static ip_address=192.168.1.1
static routers=192.168.1.1
static domain_name_servers=8.8.8.8
```

Now, edit the `dnsmasq` config file so it knows which addresses to assign to devices that connect on WiFi. Open the file with the command `sudo nano /etc/dnsmasq.conf`, and add the following lines at the end, except that `dhcp-range` should indicate whatever addresses you want to be assignable on your network:

```
interface=wlan0
domain-needed
bogus-priv
dhcp-range=192.168.1.8,192.168.1.250,12h
```

### Configure IP routing

At this point you have a wireless access point, but it doesn't connect to your Pi's wired Ethernet port, which is its connection to the Internet. Making this final link is pretty easy. First, enable routing by opening the config file with `sudo nano /etc/sysctl.conf`, and add the following line:

`net.ipv4.ip_forward=1`

Then, at the command line, tell the Pi how to decide which packets get routed. That's done by executing these three commands:

```
sudo iptables -t nat -A  POSTROUTING -o eth0 -j MASQUERADE
sudo iptables -A FORWARD -i eth0 -o wlan0 -m state --state RELATED,ESTABLISHED -j ACCEPT
sudo iptables -A FORWARD -i wlan0 -o eth0 -j ACCEPT
```

Finally, make these routing settings permanent by installing the `iptables-persistent` package, and saying yes when prompted to save the current settings:

`sudo apt-get install iptables-persistent`

## Finish

That's it! Just reboot your Pi to see the network you've configured and access the Internet through it! You may now want to learn something about network security and firewalls. 

