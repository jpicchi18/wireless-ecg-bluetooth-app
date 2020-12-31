// Sets console.log() to print to Evothings console
if (window.hyper && window.hyper.log) { console.log = hyper.log }

document.addEventListener(
    'deviceready',
    function() {
        app.initialize();
    }
);

var app = {};

app.SERVICE_UUID='0000ffe0-0000-1000-8000-00805f9b34fb';
app.CHARACTERISTIC_UUID='0000ffe1-0000-1000-8000-00805f9b34fb';
// app.DEVICE_ADDRESS='94FA5DEC-0AC4-1C23-D78B-2682D43CAA83'

app.initialize = function()
{
    console.log('Initialized');
    app.connected = false;
    app.device = null;
}

app.connect = function()
{
    console.log('Attempting to connect to bluetooth module');

    evothings.easyble.startScan(scanSuccess,scanFailure, {serviceUUIDS : [app.SERVICE_UUID]}, { allowDuplicates: true});
}

app.stopScan = function()
{
    evothings.easyble.stopScan();
}

function scanSuccess(device)
{
    if(device.name != null)
    {
         console.log('Found' + ' ' + device.name);

       if (device.name == 'DSD TECH') {
         console.log('Found bluetooth');
        device.connect(connectSuccess,connectFailure);
        evothings.easyble.stopScan();
       }

    }
}

function scanFailure(errorCode)
{
    console.log('Error ' + errorCode);
}

function connectSuccess(device)
{
    console.log('Successfully connected!!');
    app.connected = true;
    app.device = device;
    app.device.readServices(serviceSuccess, serviceFailure, [ app.SERVICE_UUID]);
    showControl();
}

function connectFailure()
{
    app.connected = false;
    console.log('Failed to connect! :( ');
}

app.disconnect = function(errorMessage)
{
    console.log('disconnected');
    if(errorMessage)
    {
        console.log(errorMessage);
    }
    app.connected = false;
    app.device = null;

    evothings.easyble.stopScan();
    evothings.easyble.closeConnectedDevices();
    showStart();

}

function serviceSuccess(device)
{
    console.log('The bluetooth module can now read and write');
    showControl();
    app.device.writeCharacteristic(
        app.SERVICE_UUID,
        function()
        {
            console.log('writeCharacteristic success');
        },
        function(errorCode)
        {
            console.log('writeCharacteristic error: ' + errorCode);
        });
    app.device.enableNotification(
        app.SERVICE_UUID,
        app.CHARACTERISTIC_UUID,
        app.receivedData,
        function(errorCode)
        {
            console.log('Failed to receive notification from device' + errorCode);
        },
        { writeConfigDescriptor: false }
    );
}

function serviceFailure(errorCode)
{
    console.log('Failed to read services' + errorCode);
    app.disconnect();
}

app.sendData = function(data)
{
    if (app.connected && app.device != null)
    {
        data = new Uint8Array(data);
        app.device.writeCharacteristic(
            app.CHARACTERISTIC_UUID,
            data,
            function ()
            {
                console.log('Succeed to send message!' + data);
            },
            function (errorCode)
            {
                console.log('Failed to send message!' + errorCode);
            }
        );
    }
    else
    {
        app.disconnect('Device was disconnected when trying to send message');
    }
}

app.receivedData = function(data)
{
    if (app.connected)
    {
      var data = new Uint8Array(data);
      if (data[0] === 0xAD)
      {
        console.log('Data received: [' + data[0] +', ' + data[1] +', ' + data[2] + ']');

        var value = (data[2] << 8) | data[1];

        console.log(value);
        graph.updateChart(value);
      };
    }
  else
  {
    app.disconnect('Disconnected');
    console.log('Error - No device connected.');
  }
}
