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
      me.outputs.value = data.value;
      me.node.flagOutputDirty("say");
      me.node.flagOutputDirty("value");
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
    // Necessary to listen for data-gen data
    me.ws.send("42"+ JSON.stringify(["join", {room:"tessel"}]));
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
      nameOfInput: "number"
    },
    outputs: {
      id: "string",
      isConnected: "boolean",
      say: "string",
      value: "number"
    },
    setup: function(inputs, outputs) {
      outputs.nameOfOutput = 11;
      outputs.id = "(unknown)";
      outputs.isConnected = false;
      me.node = this;
      me.outputs = outputs;
      me.inputs = inputs;
      me.startWs(inputs, outputs);
    },
    run: function(inputs, outputs) {
      console.log("Run");
    }
});
