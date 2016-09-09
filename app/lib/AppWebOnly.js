var RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection ||
    window.webkitRTCPeerConnection || window.msRTCPeerConnection

var RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription ||
    window.webkitRTCSessionDescription || window.msRTCSessionDescription
var getUserMedia = (navigator.getUserMedia || navigator.mozGetUserMedia ||
    navigator.webkitGetUserMedia || navigator.msGetUserMedia).bind(navigator)

var selfView = document.getElementById("selfView");
var remoteViewContainer = document.getElementById("remoteViewContainer");
var io = require('socket.io-client')

// rtc observers.
var addedTextChannel = function (socketId, dataChannel) {
    console.log("ADDING TEXT CHANNEL")

    dataChannel.onerror = function (error) { console.log("dataChannel.onerror", error)
    }
    dataChannel.onmessage = function (event) { console.log("dataChannel.onmessage:", event.data)
        var content = document.getElementById('textRoomContent')
        content.innerHTML = content.innerHTML + '<p>' + socketId +
            ': ' + event.data + '</p>'
    }
    dataChannel.onopen = function () { console.log('dataChannel.onopen')
        var textRoom = document.getElementById('textRoom')
        textRoom.style.display = "block";
    }
    dataChannel.onclose = function () { console.log("dataChannel.onclose")
    }
    return dataChannel
}
var removedVideoChannel = function (id) {
    console.log("REMOVING VIDEO CHANNEL VIEW")
    var video = document.getElementById("remoteView" + id);
    if (video) video.remove();
}
var addedVideoChannel = function(id, stream) { console.log('onaddstream', event);
    console.log("ADDING VIDEO CHANNEL VIEW")
    var element = document.createElement('video');
    element.id = "remoteView" + id;
    element.autoplay = 'autoplay';
    element.src = URL.createObjectURL(stream);
    remoteViewContainer.appendChild(element);
}
var foundLocalVideoChannel = function(stream) {
    console.log("SETTING LOCAL VIDEO CHANNEL VIEW")
    selfView.src = URL.createObjectURL(stream)
    selfView.muted = true
}

var configuration = {
    iceServers: [{"url": "stun:stun.l.google.com:19302"}],
    io: io,
    signalServer: "https://liive.io",
    RTCSessionDescription: RTCSessionDescription,
    RTCPeerConnection: RTCPeerConnection,
    getUserMedia: getUserMedia
}

var Room = require('../lib/Room')
export var room = new Room(
    configuration,
    {
        foundLocalVideoChannel: foundLocalVideoChannel,
        addedVideoChannel: addedVideoChannel,
        removedVideoChannel: removedVideoChannel,
        addedTextChannel: addedTextChannel
    }
)

if (module != null && module != undefined) {
    module.exports = room
}
if (window != null && window != undefined) {
    window.room = room
}





