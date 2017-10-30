---
title: Serving GPS and AIS data from Raspberry Pi over WiFi
date: 2017-10-31
layout: post
tag: blog
---

This is the second entry in a series about using a Raspberry Pi as the hub of my boat's data network. Today I describe how I integrated an ultra cheap USB GPS device ($8 on eBay) and an inexpensive AIS receiver ([the dAISy Hat, $65 on Tindie](https://www.tindie.com/products/astuder/daisy-hat-ais-receiver-for-raspberry-pi/). The AIS receiver tells me the locations of all ships within VHF range (at least five miles), while the GPS gives me my location and the current time to within a fraction of a second.

Lot of people have written about using a GPS to configure their network time server within a few microseconds, but those tutorial always assume an expensive GPS device that breaks out a PPS (pulse per second) signal. PPS bypasses the small delays in USB communication, which is necessary to get more accurate time than what you can get from Internet time servers. But I don't need that much accuracy, I only want a time signal that is quite accurate and independent of an Internet connection (because the boat will sometimes be at sea).

Yesterday I wrote up how I [turned my Raspberry Pi into a WiFi router](//somesquares.org/blog/2017/10/30/Raspberry-Pi-router). Today I'll show how I used this router to broadcast its GPS data and AIS targets to all connected devices.

# Hardware

The dAISy Hat plugs directly into the Raspberry Pi but needs an external antenna. I had one from when I purchased an [RTL-SDR device](https://www.rtl-sdr.com/buy-rtl-sdr-dvb-t-dongles/) and you can (as of writing) buy that antenna for $10 from the RTL-SDR store. But ultimatly I intend to build a splitter that will allow me to share the masthead VHF antenna, which has much better line-of-sight.

The GPS device was just about the cheapest available on eBay when I bought it: eight dollars shipped, its totally generic and looks like a large flash drive.

# Software

Interpreting the data stream from the GPS device is the job of `gpsd`. Install it as follows:

```sudo apt-get install gpsd gpsd-clients```

Running a time server from the Pi requires that you install `ntp`, so run the command

```sudo apt-get install ntp ntpstat jq```


As a server to broadcast data to other devices, I use [`kplex`](http://www.stripydog.com/kplex/). My recommendation is that you download the source from the website and build it on your Pi, which only takes seconds and for me is a lot easier than trying to configure `apt` for non-standard package repositories.


# Configuraton

You want `gpsd` to run on startup, to provide a time output even without a current GPS fix, and to keep its connection to the GPS device alive even if no data arrives and no clients are connected. To do all this, add the following line to your `/etc/rc.local` file:

```gpsd /dev/ttyACM0 -nrF /var/run/gpsd.sock```

`kplex` needs start when the Pi boots up, which I do in my crontab via the `@reset` directive. Open your crontab with the command `crontab -e`, and add the line
 
```@reboot sleep 15; kplex```

Now configure `kplex` to know which inputs to listen for, and how to output them. You can create a `kplex` config file at `~/.kplex.conf` and copy the following directly into it:

```
[global]
mode=background

[tcp]
direction=in
address=127.0.0.1
gpsd=yes
mode=client

[serial]
filename=/dev/serial1
baud=38400
direction=in

[udp]
device=wlan0
port=10110
type=broadcast
```

The dAISy Hat communicates over a serial port (`/dev/serial1` on my Raspberry Pi 3 running the Raspbian Stretch OS - I think it is `/dev/serial0` on Rasbian Jessie and earlier). The TCP input is listening to gpsd. And both of these inputs are being broadcast over the WiFi device (`wlan0`) using the UDP protocol on port 10110.

UDP is better than TCP for our purposes because the connection does not require the both ends to keep it alive. If you're using the GPS data through `kplex` as input to [OpenCPN](https://opencpn.org) on your laptop, as I am, then a TCP connection will stop working when your laptop goes to sleep or you restart it, and the connection won't be automatically restored. But UDP will broadcast as long as the Raspberry Pi is powered up, and your laptop can start listening any time.

# Set up the time server

As a time server, your Raspberry Pi should prefer to set its time from Internet time servers but should fall back to the GPS if you're disconnected from the Internet. Use `sudo nano /etc/ntp.conf` to open the time server config file and add the following lines:

```
# Undisciplined Local Clock. This is a fake driver intended for backup
# and when no outside source of synchronized time is available.
server  127.127.1.0     # local clock
fudge   127.127.1.0 stratum 14


# If you want to provide time to your local subnet, change the next line.
# (Again, the address is an example only.)
broadcast 192.168.1.255
```

Adding the Pi's own clock as a server makes it accessible, but labeling it `stratum 14` makes it the lowest-possible priority time server. As a result, any other accessible server will have priority.

Now we need use the GPS to set the local clock. This is why we previously installed `ntpstat` and `jq`. We'll create a script that checks the status of the internal clock. If it is unsynchronized or synchronized to stratum 15, then we will read the GPS time and write it to the Pi's internal clock. First, run `touch ~/sync-gps-time.sh` and `chmod +x ~/sync-gps-time.sh` at the command line to create an executable script. Then copy the following code into `~/sync-gps-time.sh`:

```
#! /bin/bash
if ( ntpstat | grep "unsynchronised" ) || ( ntpstat | grep "stratum 15" ); then

  gpspipe -w | jq -r --unbuffered "select(.time).time" | while read timestamp
    do
      date -s $timestamp
      break
    done 
fi
```

As a final step, you need the script to run every 20 minutes as root in order to keep the internal clock synchronized. To do this, edit the root crontab by running the command `sudo crontab -e` and adding the following line to the file (be sure to change `pi` if you're under a different username):

*/20 * * * * /home/pi/sync-gps-time.sh

## Receiving the GPS and AIS data in OpenCPN

I'm using OpenCPN for navigation, so I need the GPS and AIS data in order to plot my position and the location signals of nearby ships on the screen. It's pretty simple - click the wrench icon to open the settings dialog, and go to the "Connections" tab. At the bottom click "Add Connection", and then set the following settings:

- Type: Network
- Protocol: UDP
- Address: [the static IP address of your Pi's wlan0 device](//somesquares.org/blog/2017/10/30/Raspberry-Pi-router)
- DataPort: 10110

Click 'OK' and you should have a good, reliable, feed of GPS and AIS data!

