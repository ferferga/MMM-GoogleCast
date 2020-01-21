# MMM-GoogleCast
### See what's playing in your Google Cast device (Chromecast, Chromecast Audio, Android TV, JBL Speakers...) inside your mirror. Compatible with, virtually, any app.

<p align="center">
  <img src="https://github.com/ferferga/MMM-GoogleCast/raw/master/screenshots/intro.jpg">
</p>

## Description
This module for [MagicMirror](https://github.com/MichMich/MagicMirror) displays the status of
a Google Cast device (volume, which app is connected, whether the media is buffering, playing or in pause...) and information about the media that is being casted to the device (album cover, title, album name, artists, album artist...). Although this module was mainly aimed at music media, it can also work
with video content (from platforms like Netflix), but the information displayed might not be as complete.

#### Some technical stuff
As said above, the information displayed for video content might not be as complete as with music, as all the information displayed depends on how many information about the media is given by the app, so it's more an app's developer problem than mine =D. The module just receive the media events from the Google Cast device without having specific apps in consideration (that's why this module is universal and works with "virtually" any app).
You can make and propose Pull Requests to improve video content compatibility. Any contribution is always welcome!

This module works by using a Python script and the module [pyChromecast](https://github.com/balloob/pychromecast) as a backend, as well as python-shell to communicate between the mirror and the Python script.

## Mockup

You can see a mockup of the module [in this page](https://ferferga.github.io/MMM-GoogleCast/mockup/mockup.html).

## Installation

**Step 1**: One-line installation through terminal:

``
sudo apt install python3 python3-pip -y && sudo apt clean && sudo pip3 install pychromecast && cd ~/MagicMirror/modules && git clone https://github.com/ferferga/MMM-GoogleCast.git && cd MMM-GoogleCast && npm install && echo "Installation succesfull"
``

**Step 2**: If you see the message "Installation successfull", the first step is done! Now run:

``python3 GetChromecasts.py``

This will scan all your Google Cast devices in your network, so make sure the device you want to link to your mirror is up and running. A list similar to this one will be displayed:

```
DEVICE 0
=========================
Name: Living Room speaker
Type: audio
ID: xxxxxx-xxxxxxx-xxxxxxxx-xxxxxx
=========================
DEVICE 1
Name: Bedroom TV
Type: video
ID: yyyyyy-yyyy-yyyyyyyy-yyyyyy
=========================
DEVICE 2
Name: All Speakers
Type: group
ID: zzzzzz-zzzzz-zzzzzzz-zzzzzz
=========================
```

As you can see, you can also link audio groups apart from individual video and speakers devices. Note the ID of the device you want to link to your mirror. If no devices are detected, go to "Issues" section below

**Step 3**: Add the module section to your ``config.js`` file, replacing the ``device`` property with the ID of the device you want to link to your mirror:
```
		{
			module: 'MMM-GoogleCast',
			position: "top_left",
			classes: "default everyone",
			header: "Google Cast",
			config: {
				device: "PASTE HERE THE ID OF THE DEVICE YOU NOTED BEFORE",
			}
		},
```
Available options in ``config.js`` for advanced users:

| **Option**         | **Default** | **Description**                                                                            |
|--------------------|-------------|--------------------------------------------------------------------------------------------|
| ``device``         | ``null``    | Specifies the device to link in your mirror                                                |
| ``hide``           | ``false``   | Setting this to true will hide the module if no app is connected to the Google Cast device |
| ``animationSpeed`` | ``3000``    | Sets the speed of the animations while hiding/showing the module                           |
| ``showDeviceStatus`` | ``true``    | Shows or hides the device status (If media is playing, paused, buffering...)             |
| ``showAlbumArtist`` | ``true``    | Shows or hides the information about the album artist                                     |

You can also run multiple instances of the module, one for every device do you want to track. Copy multiple times the snippet above
in your ``config.js`` (one for the device) and change the ID of the device in each instance.

And everything is done! You should now see the media that's being played in your mirror

## Issues

- **Volume Bar doesn't works well/it's ugly**

Refer to [this issue](https://github.com/ferferga/MMM-GoogleCast/issues/1).

- **The device is not detected in my network although the ID is correct**

*1.*: Please, really make sure that you have put the appropiated ID in the ``config.js``, without spaces at the end and anything else strange, just as it's displayed in **Step 2**. The best you can do is to copy/paste it, as it's easy to confuse a letter or an *O* between a *0* inside a bunch of random characters.

*2.*: The module is prepared for handling random disconnections from the device. Try rebooting it, it should connect after a while itself. If that doesn't help, reboot the mirror and your Chromecast device.

*3.*: Refer to this [Google Help article](https://support.google.com/chromecast/answer/9206302?hl=en&ref_topic=3447927) for more basic troubleshooting steps.

*4.*: If none of the above worked, I'm happy to help. But, please, open an issue making sure you include the following:
- Your ``config.js`` section of ``MMM-GoogleCast``.
- The output of the script you ran in **Step 2** during installation (``GetChromecasts.py``)`
- Run MagicMirror through npm if you are using pm2 to start MagicMirror at boot time. ``pm2 stop MagicMirror && cd ~/MagicMirror``. After that, run ``npm start``. Paste all the messages starting with ```MMM-GoogleCast`` in your issue, please.

## Credits

This module wouldn't be possible without the amazing work of MichMich in MagicMirror and balloob, the developer of the pyChromecast library for Python. Also, huge kudos to python-shell developers, which allowed me to exchange data between the Python script and node.
Mention to paviro as well, as I used his module as a "template" to know the basics of python-shell. It would have been so much difficult to use MagicMirror alongside Python script without his help.