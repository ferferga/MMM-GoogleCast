#!/usr/bin/env python3

## This part of the backend handles all the exceptions and convert them to a json
## representation, so they can be understood easily looking at MagicMirror logs.

import sys, json
class NullOutput():
    def write(self, s):
        pass
    
def toNode(type, message):
    print(json.dumps({type: message}))
    sys.stdout.flush()
   
def exception_handler(exception_type, exception, traceback):
    """
    Handle exceptions in MMM-GoogleCast's backend
    """
    dct = {'exception_type': str(exception_type.__name__),
           'exception': str(exception)}
    toNode('MMGCAST_BACKEND_EXCEPTION', dct)
sys.excepthook = exception_handler
sys.stderr = NullOutput()

## Changes in the exception handling are done at this point. Continue with
## execution flow

import asyncio, signal, logging, datetime

loop = None
device = None

def shutdown(self, signum):
    """
    Terminates the backend gracefully after receiving a signal
    """
    toNode('MMGCAST_BACKEND_STATUS', 'SHUTDOWN')
    quit(signum)
    
def json_serializer(obj):
    """
    Serializes to JSON objects that are not directly serializable
    """
    if isinstance(obj, (datetime.date, datetime.datetime)):
        return obj.timestamp()
    else:
        return obj.__str__()
    
try:
    import pychromecast
except ImportError:
    toNode('MMGCAST_BACKEND_EXCEPTION', 'IMPORT_ERROR')
    shutdown(None, 1)

class MMConfig:
    """
    Get config from config.json passed as an argument
    """
    CONFIG_DATA = json.loads(sys.argv[1])
    DEVICE_ATTR = 'device'
    
    @classmethod
    def get(cls,key):
        return cls.CONFIG_DATA[key]

    @classmethod
    def getDeviceId(cls):
        return cls.get(cls.DEVICE_ATTR)

class StatusMediaListener:
    """
    Class that handles events related to the media that is playing in the cast device
    """
    def __init__(self, device):
        self.device = device

    def new_media_status(self, status):
        dct = {'device_id': str(device.uuid),
               'device_name': device.name,
               'device_model': device.model_name}
        status_dct = {'content': json.loads(json.dumps(status.__dict__, default=json_serializer))}
        dct.update(status_dct)
        toNode('MMGCAST_MEDIA_STATUS', dct)

class StatusListener:
    """
    Class that handles events related to the paired revice (e.g: volume change, app change, etc...)
    """
    def __init__(self, device):
        self.device = device

    def new_cast_status(self, status):
        dct = {'device_id': str(device.uuid),
               'device_name': device.name,
               'device_model': device.model_name}
        status_dct = {'content': json.loads(json.dumps(status._asdict(), default=json_serializer))}
        dct.update(status_dct)
        toNode('MMGCAST_DEVICE_STATUS', dct)
        
def registerDevice(newDevice):
    """
    Register a new device object, nulling dead or disconnected devices
    """
    global device
    del device
    device = newDevice
    device.register_status_listener(StatusListener(device))
    device.media_controller.register_status_listener(StatusMediaListener(device))
    toNode('MMGCAST_BACKEND_STATUS', 'PAIRED')
    device.socket_client.tries = None
    device.wait()

def init(initial_run=True):
    """
    Starts the connection
    """
    deviceId = MMConfig.getDeviceId()
    newDevice = None
    while True:
        devices, browser = pychromecast.get_chromecasts(tries=None)
        pychromecast.discovery.stop_discovery(browser)
        for key,cc in enumerate(devices):
            if str(cc.device.uuid) == deviceId:
                newDevice = devices[key]
                break
        if newDevice is None and initial_run:
            toNode('MMGCAST_BACKEND_STATUS', 'NOT_FOUND')
            shutdown(None, 1)
        elif newDevice is not None:
            break
    registerDevice(newDevice)

async def main():
    """
    Main loop of MMM-GoogleCast's backend
    """
    global device
    disconnected = False
    signal.signal(signal.SIGINT, shutdown)
    while True:
        if not device.socket_client.is_connected:
            toNode('MMGCAST_BACKEND_STATUS', 'RECONNECTING')
            disconnected = True
            init(False)
        elif disconnected and device.socket_client.is_connected:
            disconnected = False
        else:
            await asyncio.sleep(2)

# Code entrypoint
toNode('MMGCAST_BACKEND_STATUS', 'LOADING')
logging.disable()
init()
loop = asyncio.get_event_loop()
asyncio.ensure_future(main())
loop.run_forever()
