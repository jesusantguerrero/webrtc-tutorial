class Peer {
  constructor() {
    this.cameras = {
      local: document.querySelector('#local-camera'),
      remote: document.querySelector('#remote-camera')
    }

    this.btn = {
      start: document.querySelector('#btn-start'),
      call: document.querySelector('#btn-call'),
      hangup: document.querySelector('#btn-hangup')
    };
     
    this.pc1 = null;
    this.pc2 = null;
    this.localStream = null;

    this.offerOptions = {
      'offerToReceiveAudio': 1,
      'offerToReceiveVideo': 1,
    }
  }

  boot() {
    this.setButtonState('call', true);
    this.setButtonState('hangup', true);
    
    //handle controls click 
    this.btn.start.addEventListener('click', this.start.bind(this));
    this.btn.call.addEventListener('click', this.call.bind(this));
    this.btn.hangup.addEventListener('click', this.hangup.bind(this));
  }

  //  utils

  setButtonState(buttonName, disabled) {
    this.btn[buttonName].disabled = disabled;
  }

  start() {
    this.setButtonState('call', true);
    navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true
    })
      .then((stream) => {
        this.cameras.local.srcObject = stream;
        this.localStream = stream;
        this.setButtonState('call', false);
      })
      .catch((err) => console.log('media error', err))
  }

  call() {
    this.setButtonState('call', true);
    this.setButtonState('hangup', false);
    const servers = null;

    this.createPeerConnection('pc1', servers)
    this.createPeerConnection('pc2', servers)

    this.pc2.onaddstream = (e) => {
      console.log('here adding stream', e)
      this.remoteStream = e.stream;
      this.cameras.remote.srcObject = e.stream;
    }

    this.pc1.addStream(this.localStream);
    this.pc1.createOffer(
      this.offerOptions
    )
      .then(this.onCreateOfferSuccess.bind(this))
      .catch((err) => console.log('offer error', err))
  }

  hangup() {

  }

  createPeerConnection(pcName, servers) {
    this[pcName] = new RTCPeerConnection(servers);
    this[pcName].onicecandidate = (e) => {
      this.onIceCandidate(this[pcName], e)
    }
  }

  onIceCandidate(pc, event) {
    console.log(event)
    console.log('here ice candidate')
    if (event.candidate) {
      console.log(event)
      this.getOtherPc(pc).addIceCandidate(
        new RTCIceCandidate(event.candidate)
      )
      .then(() => { console.log('ice candidate success')})
    }
  }

  onCreateOfferSuccess(desc) {
    console.log('offer success')
    this.pc1.setLocalDescription(desc)
    this.pc2.setRemoteDescription(desc)
    
    this.pc2.createAnswer().then((desc2) => {
      console.log('creating answer')
      this.pc2.setLocalDescription(desc2).then((e) => { console.log('exito')});
      this.pc1.setRemoteDescription(desc2);
    })
  }

  getOtherPc(pc) {
    return (pc === this.pc1) ? this.pc2 : this.pc1;
  }
 
}

const peer = new Peer();
peer.boot();