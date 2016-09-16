
class RTCChannel
    pcPeers = {}
    localStream = null
    getUserMedia = null
    # observers = {
    #    foundLocalVideoChannel: foundLocalVideoChannel,
    #    addedVideoChannel: (socketId, event) ->
    #    removedVideoChannel: (socketId) ->
    #    addedTextChannel: (dataChannel) ->
    # reactions = {
    #    exchangeDescription: (socketId, localDescription) ->
    #    exchangeCandidate: (socketid, candidate)
    # }
    configuration = null
    observers = null
    reactions = null
    RTCPeerConnection = null
    RTCSessionDescription = null
    RTCIceCandidate = null
    constructor: (_configuration, _observers, _reactions) ->
        configuration = _configuration
        RTCPeerConnection = _configuration.RTCPeerConnection
        RTCSessionDescription = _configuration.RTCSessionDescription
        RTCIceCandidate = _configuration.RTCIceCandidate
        getUserMedia = configuration.getUserMedia
        observers = _observers
        reactions = _reactions

    getMedia: (types, callback) ->
#        console.log("Get Media!!!!")
        getUserMedia(types, (stream) ->
            localStream = stream
#            console.log("setting local stream:"+JSON.stringify(stream))
            observers.foundLocalVideoChannel(localStream)
            callback(stream)
            return
        , (error) -> console.log(error) )
        return

    createTextChannel = (pc, socketId)  ->
#        console.log('RTCChannel:: create Text Channel', socketId)
        return if (pc.textDataChannel?)
        dataChannel = pc.createDataChannel("text")
        pc.textDataChannel = observers.addedTextChannel(socketId, dataChannel)
        return

    createListener: (socketId, isOffer) ->
        _createListener(socketId, isOffer)

    createOffer = (pc,socketId) ->
#        console.log('is Offer!!!')
        pc.createOffer((desc) ->
#            console.log('createOffer', desc)
            pc.setLocalDescription(desc, () ->
#                console.log('RTCChannel::id:'+socketId+' in negotiation: setLocalDescription', pc.localDescription)
                reactions.exchangeDescription(socketId, pc.localDescription)
            , (error) -> console.log("ERROR::onnegotiationneeded: set local description error:"+error)
            )
        , (error) -> console.log("ERROR::onnegotiationneeded: Create Offer error:"+error)
        )

    _createListener = (socketId, isOffer) ->
#        console.log("RTCChannel::CreateListener: id:"+socketId+"  offer:"+isOffer)
        pc = new RTCPeerConnection(configuration)
        pcPeers[socketId] = pc
        pc.onicecandidate = (event) ->
            if (event? and event.candidate?)
#                console.log('RTCChannel:: id:'+socketId+' on ice candidate ' + event.candidate)
                reactions.exchangeCandidate(socketId, event.candidate)
#            else
#                console.log('RTCChannel:: id:'+socketId+' on ice candidate, not a candidate')
        pc.onnegotiationneeded = () ->
            if (isOffer)
#                console.log('RTCChannel::id:'+socketId)
                createOffer(pc, socketId)
#            else
#                console.log('RTCChannel::id:'+socketId+' on negotiation needed: no offer.')
        pc.oniceconnectionstatechange = (event) ->
#            console.log('RTCChannel:: id:'+socketId+' on ice connection state change', event)
            if (event.target.iceConnectionState == 'connected')
                createTextChannel(pc, socketId)
        pc.onsignalingstatechange = (event) ->
#            console.log('RTCChannel:: onsignalingstatechange', event)
        pc.onaddstream = (event) ->
#            console.log('RTCChannel::id:'+socketId+' on add stream...')
            observers.addedVideoChannel(socketId, event.stream)
#        console.log("RTC Channel:: Add stream:"+JSON.stringify(localStream))
        pc.addStream(localStream)
        return pc

    deleteListener: (socketId, callback) ->
#        console.log('RTCChannel:: id: '+socketId+' delete listener ...')
        pc = pcPeers[socketId]
        if (pc)
            pc.close();
            delete pcPeers[socketId]
        observers.removedVideoChannel(socketId)
        callback(null, socketId)
        return

    send: (text) ->
#        console.log("RTCChannel:: send:"+text)

        for key,pc of pcPeers
            pc.textDataChannel.send(text)
        return

    exchange: (data) ->
#        console.log("RTCChannel::"+data.from+" exchange:"+data.sdp)
        fromId = data.from
        if (pcPeers[fromId]?)
#            console.log("FOUND PEER___________:"+fromId)
            pc2 = pcPeers[fromId]
        else
#            console.log("createPC from exchange!!!!!!!!!!"+fromId)
            pc2 = _createListener(fromId, false)

        if (data.sdp)
#            console.log('RTCChannel:: exchange description', JSON.stringify(data))
            pc2.setRemoteDescription(new RTCSessionDescription(data.sdp), () ->
                if (pc2.remoteDescription.type == "offer")
                    pc2.createAnswer((desc) ->
#                        console.log('RTCChannel:: createAnswer', desc)
                        pc2.setLocalDescription(desc, () ->
#                            console.log('RTCChannel:: setLocalDescription', pc2.localDescription)
                            reactions.exchangeDescription(fromId, pc2.localDescription)
                        , (error) ->
                            console.log("RTCChannel:: ERROR in set local descriptoin:"+error, null)
                            return
                        )
                    , (error) ->
                        console.log("RTCChannel:: ERROR in create answer:"+error, null)
                        return
                    )
                return
            , (error) ->
                console.log("RTCChannel:: ERROR in set remote description: "+error, null)
                return
            )
        else
#            console.log('RTCChannel:: new ice candidate', data)
            pc2.addIceCandidate(new RTCIceCandidate(data.candidate))
        return

module.exports = RTCChannel