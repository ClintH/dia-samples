var me = {};
// -- Configuration
me.wsUrl = "ws://localhost:3000/socket.io/?EIO=2&transport=websocket";
me.autoReconnect = true;
// --- End of configuration

// Handle different kinds of messages received from Kattegat
me.handleMessage = function(evt, data) {
  try {
    switch (evt) {
    case "hello":
      me.outputs.id = data.id.replace("/", "").replace("#", "");
      me.node.flagOutputDirty("id");
      break;
    case "say":
      console.log("Received 'say': " + JSON.stringify(data));
      me.outputs.say = JSON.stringify(data);
      me.node.flagOutputDirty("say");
      if (typeof data.testNumber !== undefined) {
        me.outputs.testNumber = parseInt(data.testNumber);
        me.node.flagOutputDirty("testNumber");
      }
      if (typeof data.testColour !== undefined) {
        me.outputs.testColour = data.testColour;
        me.node.flagOutputDirty("testColour");
      }
      if (typeof data.testString !== undefined) {
        me.outputs.testString= data.testString;
        me.node.flagOutputDirty("testString");
      }
      break;
    default:
      console.log("Received: "+  evt + " data:  " + JSON.stringify(data));
    }
  } catch (e) {
    console.log("handleMessage Error: " + e);
  }
}
// Connect to Kattegat
me.startWs = function() {
  me.ws = new window.WebSocket(me.wsUrl);
  me.ws.onopen = function (e) {
    me.outputs.isConnected = true;
    me.node.flagOutputDirty("isConnected");
  }
  me.ws.onclose = function (e) {
    me.outputs.isConnected  = false;
    me.node.flagOutputDirty("isConnected");
    if (me.autoReconnect) {
      console.log("Reconnecting");
      me.startWs();
    }
  }
  me.ws.onmessage = function(e) {
    // Socket.io adds some cruft we need to remove
    var text = e.data;
    console.log(text);
    if (text == "40") return;  // Drop socket.io signalling
    var bracePos = text.indexOf("{");
    var bracketPos = text.indexOf("[");
    if (bracePos < 0 && bracketPos < 0) {
      console.log("Socket received malformed text: '" + text +"'");
      return;
    }
    var pos = Math.min(bracketPos, bracePos);
    var prefix = text.substr(0, pos);
    try {
      var json = JSON.parse(text.substr(pos, text.length-pos));
      if (json.pingInterval) return; // Drop socket.io signalling
      me.handleMessage(json[0], json[1]);
    } catch (err) {
      console.log("Could not parse JSON: " + err);
    }
  }
  return me.ws;
}

// Set up Noodl node
define({
    inputs: {
      testTouchX: "number",
      testTouchY: "number"
    },
    outputs: {
      id: "string",
      isConnected: "boolean",
      say: "string",
      testNumber: "number",
      testString: "string",
      testColour: "color"
    },
    setup: function(inputs, outputs) {
      outputs.testNumber = 100;
      outputs.testColour = "#ff2f92";
      outputs.testString = ":)";
      outputs.id = "(unknown)";
      outputs.isConnected = false;
      me.node = this;
      me.outputs = outputs;
      me.inputs = inputs;
      me.startWs(inputs, outputs);
    },
    run: function(inputs, outputs) {
      try {
       me.ws.send("42" + JSON.stringify(["say", {x: inputs.testTouchX, y: inputs.testTouchY}]));
      } catch (e) {}
    }
});
