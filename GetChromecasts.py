import pychromecast, getpass
print("\nScanning Google Cast devices inside your network...")
chromecasts, browser = pychromecast.get_chromecasts()
pychromecast.discovery.stop_discovery(browser)
for num,cc in enumerate(chromecasts):
    print("DEVICE " + str(num))
    print("--------------------")
    print("Name: " + cc.device.friendly_name)
    print("Type: " + cc.device.cast_type)
    print("ID: " + str(cc.device.uuid))
    print("--------------------")
print("\n\nNote the ID of the device do you want to integrate into your MagicMirror and put them inside config.js")
getpass.getpass("Press ENTER to exit")
