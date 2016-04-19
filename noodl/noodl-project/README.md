# Kattegat Example for Noodl

This example shows you how to receive and use data from Kattegat in [Noodl](http://www.getnoodl.com/).

The project expects you have the _data-gen_ sample (http://localhost:3000/dia-samples/data-gen/sensor.html) loaded in another browser window, and that Noodl is running on the same machine as your Kattegat server.

You should see the yellow circle glow according to the data generator.

_Tip:_ Right-click in the Noodl preview area and choose _Inspect_ to check up on errors etc.

## In Noodl

Your Noodl sketch needs to use a "Javascript" node, which should be set up to use an external file, `kattegat.js`. Once you reload your sketch, you'll be able to wire up the outputs to other nodes.

## Configuring

To change which kinds of data your sketch uses, or to connect to a particular Kattegat server, you'll need to edit `kattegat.js`.

The `wsUrl` variable at the top of the file specifies which Kattegat server to connect to, defaulting to the local machine. If your Noodl sketch is to run on another device, this will need to change to be the IP address of the computer running Kattegat.

The `handleMessage` function is where data is pulled out of messages received from Kattegat. By default, we've set it up to use the data-gen sample (http://localhost:3000/dia-samples/data-gen/sensor.html). Load that up in another browser window as you work to get data streaming in to Noodl.

The raw data messages from Kattegat are saved to the Javascript node's "say" output port. In the example project, this is shown next to the label "Raw". It gives you an idea of what properties you receive.

As an example, we pull out the `value` property of data-gen's data. For this to be available to Noodl nodes, we set it to `me.outputs.value`, and call `flagOutputDirty`.

```
me.outputs.value = data.value;
me.node.flagOutputDirty("value");
```

And say if you want to use the `gradientShort` property which is sent by data-gen:

```
me.outputs.gradientShort = data.gradientShort;
me.node.flagOutputDirty("gradientShort");
```

Note that you also need to scroll down to the bottom of `kattegat.js` and add any extra outputs you make (or names you change):

```
    outputs: {
      id: "string",
      isConnected: "boolean",
      say: "string",
      value: "number",
      gradientShort: "number"
    },
```

Reload your Noodle preview in order to connect any new outputs to other Noodl nodes.

# Read more
* [Javascript node in Noodl](http://www.getnoodl.com/docs/javascript/)

## TODO:

Send data
