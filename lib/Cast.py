import json, sys, signal, time

oldlink = None
oldStreamId = None
oldState = None
OpenedApp = None
VolumeLevel = None
deviceId = None

class MMConfig:
    CONFIG_DATA = json.loads(sys.argv[1])
    DEVICE_ATTR = 'device'

    @classmethod
    def getDeviceId(cls):
        return cls.get(cls.DEVICE_ATTR)

    @classmethod
    def get(cls,key):
        return cls.CONFIG_DATA[key]

def toNode(type, message):
    print(json.dumps({type: message}))
    sys.stdout.flush()

toNode("status", "Loading MMM-GoogleCast Python backend...")
try:
    import pychromecast
except:
    toNode("importError", "Python requeriments for MMM-GoogleCast were not detected/installed correctly")

class StatusMediaListener:
    def __init__(self, name, cast):
        self.name = name
        self.cast = cast

    def new_media_status(self, status):
        global oldlink, oldStreamId, oldState
        try:
            link = status.images[0].url
        except IndexError:
            link = None
        if oldState != status.player_state or (oldlink != link and oldStreamId != status.content_id) or (oldState is None and oldState is None and oldStreamId is None):
            oldState = status.player_state
            oldlink = link
            oldStreamId = status.content_id
            # if __debug__:
            #     print("Title:" + str(status.title))
            #     print("Artist:" + str(status.artist))
            #     print("AlbumName:" + str(status.album_name))
            #     print("AlbumArtist:" + str(status.album_artist))
            #     print("State:" + str(status.player_state))
            #     print("ImageURL:" + str(link))
            toNode("mediaStatus", {"id": deviceId, "title": status.title, "artist": status.artist, "album": status.album_name, "albumArtist": status.album_artist, "state": status.player_state, "image": link})

class StatusListener:
    def __init__(self, name, cast):
        self.name = name
        self.cast = cast

    def new_cast_status(self, status):
        global VolumeLevel, OpenedApp
        if VolumeLevel is None and OpenedApp is None:
            VolumeLevel = status.volume_level
            OpenedApp = status.display_name
            # if __debug__:
            #     print("VolumeLevel:" + str(status.volume_level))
            #     print("ConnectedApp:" + str(status.display_name))
            toNode("deviceStatus", {"id": deviceId, "volume": status.volume_level, "app": status.display_name})
        if VolumeLevel != status.volume_level or OpenedApp != status.display_name:
            # if __debug__:
            #     print("VolumeLevel:" + str(status.volume_level))
            #     print("ConnectedApp:" + str(status.display_name))
            if VolumeLevel != status.volume_level:
                VolumeLevel = status.volume_level
            else:
                OpenedApp = status.display_name
            toNode("deviceStatus", {"id": deviceId, "volume": status.volume_level, "app": status.display_name})

def shutdown(self, signum):
    toNode("status", 'Shutdown: Closing MMM-GoogleCast Python backend...')
    quit()
try:
    deviceId = MMConfig.getDeviceId()   
    devices = pychromecast.get_chromecasts()
    device = next(cc for cc in devices
                    if str(cc.device.uuid) == deviceId)
    device.start()
    listenerMedia = StatusMediaListener(device.name, device)
    device.media_controller.register_status_listener(listenerMedia)
    listenerCast = StatusListener(device.name, device)
    device.register_status_listener(listenerCast)
except:
    toNode("status", "Device '" + str(deviceId) + "' not found or unreachable")
    quit()
toNode("status", "Cast.py loaded successfully")
signal.signal(signal.SIGINT, shutdown)
# if __debug__:
#     input("Listening to events...")
# else:
while True:
    time.sleep(86400)