import pychromecast
import getpass
print("\nScanning Google Cast devices inside your network...")

devices, browser = pychromecast.discovery.discover_chromecasts()
browser.stop_discovery()

print(f"Number of devices: {len(devices)}")
print("------------------------------")


for device in devices:

        print(f"Name: {device.friendly_name}")
        print(f"Type: {device.model_name}")
        print(f"Host: {device.host}:{device.port}")
        print(f"UUID: {device.uuid}")

        print("------------------------------")

print("\n\nNote the ID of the device do you want to integrate into your MagicMirror and put them inside config.js")
getpass.getpass("Press ENTER to exit")
