import React, { Component } from 'react';
import {
    AppRegistry,
    ListView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableHighlight,
    View,

} from 'react-native';
import io from 'socket.io-client/socket.io';

import {
    RTCPeerConnection,
    RTCMediaStream,
    RTCIceCandidate,
    RTCSessionDescription,
    MediaStreamTrack,
    getUserMedia,
    RTCView
} from 'react-native-webrtc';

let container;

var getUrl = function(stream) {
    if (stream.toURL !== null && stream.toURL !== undefined) {
        // console.log("Stream:" + stream.toURL())
        return stream.toURL();
    }
    else
    {
        // console.log("Stream:" + URL.createObjectURL(stream));
        return URL.createObjectURL(stream);
    }
}
var addedTextChannel = function (socketId, dataChannel) {
    console.log("ADDING TEXT CHANNEL")

    dataChannel.onerror = function (error) {
        // console.log("dataChannel.onerror", error);
    };
    dataChannel.onmessage = function (event) {
        // console.log("dataChannel.onmessage:", event.data);
        container.receiveTextData({user: socketId, message: event.data});
    };
    dataChannel.onopen = function () {
        // console.log('dataChannel.onopen');
        container.setState({textRoomConnected: true});
    };
    dataChannel.onclose = function () {
        // console.log("dataChannel.onclose");
    };
    return dataChannel
}

var removedVideoChannel = function (id) {
    // console.log("REMOVING VIDEO CHANNEL VIEW")

    const remoteList = container.state.remoteList;
    delete remoteList[id]
    container.setState({remoteList: remoteList});
    container.setState({info: 'One peer leave!'});
}
var addedVideoChannel = function(id, stream) {
    // console.log('onaddstream', id);
    // console.log("ADDING VIDEO CHANNEL VIEW")
    container.setState({info: 'One peer join!'});

    const remoteList = container.state.remoteList;
    remoteList[id] = getUrl(stream);
    container.setState({remoteList: remoteList});
}
var foundLocalVideoChannel = function(stream) {
    // console.log("SETTING LOCAL VIDEO CHANNEL VIEW")
    container.setState({selfViewSrc: getUrl(stream)});
    container.setState({status: 'ready', info: 'Please enter or create room ID'});
}

var configuration = {
    iceServers: [{"url": "stun:stun.l.google.com:19302"}],
    io: io,
    signalServer: "https://liive.in",
    RTCSessionDescription: RTCSessionDescription,
    RTCPeerConnection: RTCPeerConnection,
    RTCIceCandidate: RTCIceCandidate,
    getUserMedia: getUserMedia,
    mediaConstraints: { audio: true, video: { facingMode: "user" }},
}
if (Platform.OS == "android") {
    configuration.mediaConstraints = { audio: true, video: true }
}
console.log(Platform.OS)

// import { Room } from '../lib/Room'
let Room = require('../lib/Room')
var room = new Room(configuration,
    {
        foundLocalVideoChannel: foundLocalVideoChannel,
        addedVideoChannel: addedVideoChannel,
        removedVideoChannel: removedVideoChannel,
        addedTextChannel: addedTextChannel,
    }
)

function logError(error) {
    // console.log("logError", error);
}

function mapHash(hash, func) {
    const array = [];
    for (const key in hash) {
        const obj = hash[key];
        array.push(func(obj, key));
    }
    return array;
}
const MainApp = React.createClass({
    getInitialState: function() {
        // console.log("getting initial state...");

        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => true});
        return {
            info: 'Initializing',
            status: 'init',
            roomID: '',
            isFront: true,
            selfViewSrc: null,
            remoteList: {},
            textRoomConnected: false,
            textRoomData: [],
            textRoomValue: '',
        };
    },
    componentDidMount: function() {
        // console.log("Component did mount...");

        container = this;
    },
    _press(event) {
        // console.log("press... connect to: "+this.state.roomId);

        this.refs.roomID.blur();
        this.setState({status: 'connect', info: 'Connecting'});
        room.join(this.state.roomID);
    },

    receiveTextData(data) {
        // console.log("Got text...");

        const textRoomData = this.state.textRoomData.slice();
        textRoomData.push(data);
        this.setState({textRoomData, textRoomValue: ''});
    },
    _textRoomPress() {
        if (!this.state.textRoomValue) {
            return
        }
        const textRoomData = this.state.textRoomData.slice();
        textRoomData.push({user: 'Me', message: this.state.textRoomValue});
        room.say(this.state.textRoomValue)

        this.setState({textRoomData, textRoomValue: ''});
    },
    _renderTextRoom() {
        return (
            <View style={styles.listViewContainer}>
                <ListView
                    dataSource={this.ds.cloneWithRows(this.state.textRoomData)}
                    renderRow={rowData => <Text>{`${rowData.user}: ${rowData.message}`}</Text>}
                />
                <TextInput
                    style={{width: 200, height: 30, borderColor: 'gray', borderWidth: 1}}
                    onChangeText={value => this.setState({textRoomValue: value})}
                    value={this.state.textRoomValue}
                />
                <TouchableHighlight
                    onPress={this._textRoomPress}>
                    <Text>Send</Text>
                </TouchableHighlight>
            </View>
        );
    },
    render() {
        // console.log("Render...");

        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>
                    {this.state.info}
                </Text>
                {this.state.textRoomConnected && this._renderTextRoom()}
                <View style={{flexDirection: 'row'}}>
                    <Text>
                        {this.state.isFront ? "Use front camera" : "Use back camera"}
                    </Text>
                    <TouchableHighlight
                        style={{borderWidth: 1, borderColor: 'black'}}
                        onPress={this._switchVideoType}>
                        <Text>Switch camera</Text>
                    </TouchableHighlight>
                </View>
                { this.state.status == 'ready' ?
                    (<View>
                        <TextInput
                            ref='roomID'
                            autoCorrect={false}
                            style={{width: 200, height: 40, borderColor: 'gray', borderWidth: 1}}
                            onChangeText={(text) => this.setState({roomID: text})}
                            value={this.state.roomID}
                        />
                        <TouchableHighlight
                            onPress={this._press}>
                            <Text>Enter room</Text>
                        </TouchableHighlight>
                    </View>) : null
                }
                <RTCView streamURL={this.state.selfViewSrc} autoPlay muted style={styles.selfView}/>
                {
                    mapHash(this.state.remoteList, function (remote, index) {
                        if (remote !== null && remote !== undefined)
                            return <RTCView key={index} streamURL={remote} style={styles.remoteView}/>
                        else
                            return <Text>No Stream</Text>
                    })
                }
            </View>
        );
    }
});
const styles = StyleSheet.create({
    selfView: {
        width: 200,
        height: 150,
    },
    remoteView: {
        width: 200,
        height: 150,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    listViewContainer: {
        height: 150,
    },
});
module.exports = MainApp;
