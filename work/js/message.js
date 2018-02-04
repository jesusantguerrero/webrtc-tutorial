class MessageSender {
  constructor() {
    //  the textareas
    this.text = {
      local: document.querySelector('#local-text-channel'),
      remote: document.querySelector('#remote-text-channel')
    }

    //  the contols
    this.btn = {
      start: document.querySelector('#btn-start'),
      send: document.querySelector('#btn-send'),
      close: document.querySelector('#btn-close')
    };
     
    //  channels and connections
    this.sendChannel = null;
    this.receiveChannel = null;
    this.localConnection = null;
    this.remoteConnection = null;

    // constraints
    this.dataConstraint = {};
    this.pcConstraint = {
      'offerToReceiveAudio': 1,
      'offerToReceiveVideo': 1,
    };
  }

  boot() {
    this.setButtonState('send', true);
    this.setButtonState('close', true);
    
    //handle controls click 
    this.btn.start.addEventListener('click', this.createConnection.bind(this));
    this.btn.send.addEventListener('click', this.sendData.bind(this));
    this.btn.close.addEventListener('click', this.closeChannels.bind(this));
  }

  //  utils
  setButtonState(buttonName, disabled) {
    this.btn[buttonName].disabled = disabled;
  }

  getOtherConnection(connection) {
    return (connection === this.localConnection) ? this.remoteConnection : this.localConnection;
  }

  // control actions
  createConnection() {
    const servers = null;
    
    this.createPeerConnection('localConnection', servers);
    this.sendChannel = this.localConnection.createDataChannel('sendChannel'
    , this.dataConstraint);
    this.sendChannel.onopen = this.onSendChannelStateChange.bind(this);
    this.sendChannel.onclose = this.onSendChannelStateChange.bind(this);
    
    this.createPeerConnection('remoteConnection', servers);
    this.remoteConnection.ondatachannel = this.receiveChannelCallback.bind(this);
    
    this.localConnection.createOffer()
      .then(this.onCreateOfferSuccess.bind(this))
  }

  sendData() {
    console.log('sending data');
    const data = this.text.local.value;
    this.sendChannel.send(data);
  }

  closeChannels() {
    this.sendChannel.close();
    this.receiveChannel.close();
    this.localConnection.close();
    this.remoteConnection.close();
    this.localConnection = null;
    this.remoteConnection = null;

    this.text.local.value = '';
    this.text.remote.value = '';

    this.setButtonState('send', true)
    this.setButtonState('close', true)
    this.setButtonState('close', false)
  }

  //  connection utils
  createPeerConnection(pcName, servers) {
    this[pcName] = new RTCPeerConnection(servers);
    this[pcName].onicecandidate = (e) => {
      this.onIceCandidate(this[pcName], e)
    }
  }

  onCreateOfferSuccess(desc) {
    console.log('here in offer success')
    this.localConnection.setLocalDescription(desc);
    this.remoteConnection.setRemoteDescription(desc);

    this.remoteConnection.createAnswer()
      .then((desc2) => {
        this.remoteConnection.setLocalDescription(desc2);
        this.localConnection.setRemoteDescription(desc2);
      })
  }

  onIceCandidate(connection, e) {
    console.log('here ice candidate')
    if (e.candidate) {
      console.log(e)
      this.getOtherConnection(connection).addIceCandidate(
        new RTCIceCandidate(e.candidate)
      )
      .then(() => { console.log('ice candidate success')})
    }
  }

  receiveChannelCallback(e) {
    console.log('receive callback')
    this.receiveChannel = e.channel;
    this.receiveChannel.onmessage = (e) => {
      this.text.remote.value = e.data
    }
  }

  onSendChannelStateChange() {
    const { readyState } = this.sendChannel;
    if (readyState === 'open') {

      this.text.local.disabled = false;
      this.text.local.focus();
      this.setButtonState('start', true);
      this.setButtonState('send', false);
      this.setButtonState('close', false);
    } else {
      this.setButtonState('start', false);
      this.setButtonState('close', true);
      this.setButtonState('send', true);
      this.text.local.disabled = true;
    }
  }
}

const messageSender = new MessageSender();
messageSender.boot();