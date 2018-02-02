class MessageSender {
  constructor() {
    this.text = {
      local: document.querySelector('#local-text-channel'),
      remote: document.querySelector('#remote-text-channel')
    }

    this.btn = {
      start: document.querySelector('#btn-start'),
      send: document.querySelector('#btn-send'),
      close: document.querySelector('#btn-close')
    };
     
    this.sendChannel = null;
    this.receiveChannel = null;
    this.localConnection = null;
    this.remoteConnection = null;

    this.dataConstraint = {

    };

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
    this.btn.call.addEventListener('click', this.sendData.bind(this));
    this.btn.hangup.addEventListener('click', this.closeChannels.bind(this));
  }

  //  utils
  setButtonState(buttonName, disabled) {
    this.btn[buttonName].disabled = disabled;
  }

  changeCameraClass(cameraName, method = 'add') {
    this.cameras[cameraName].classList[method]('just-local');
  }

  getOtherPc(pc) {
    return (pc === this.pc1) ? this.pc2 : this.pc1;
  }

  // control actions
  createConnection() {
    this.setButtonState('send', true);
    const servers = null;

    this.createPeerConnection('localConnection', servers);
    this.sendChannel = this.localConnection.createDataChannel('sendChannel'
    , this.dataConstraint);


    this.createPeerConnection('remoteConnection', servers);

    this.remoteConnection.ondatachannel = this.receiveChannelCallback;

    this.localConnection.createOffer(this.onCreateOfferSuccess)
  }

  sendData() {
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

  //  call utils
  createPeerConnection(pcName, servers) {
    this[pcName] = new RTCPeerConnection(servers);
    this[pcName].onicecandidate = (e) => {
      this.onIceCandidate(this[pcName], e)
    }
  }

  onCreateOfferSuccess() {
    this.localConnection.setLocalDescription(desc);
    this.remoteConnection.setRemoteDescription(desc);

    this.remoteConnection.createAnswer((desc2) => {
      this.remoteConnection.setLocalDescription(desc2);
      this.localConnection.setRemoteDescription(desc2);
    })
  }

  onIceCandidate(connection, event) {
    console.log(event)
    console.log('here ice candidate')
    if (event.candidate) {
      console.log(event)
      this.getOtherConnection(connection).addIceCandidate(
        new RTCIceCandidate(event.candidate)
      )
      .then(() => { console.log('ice candidate success')})
    }
  }
}

const messageSender = new MessageSender();
messageSender.boot();