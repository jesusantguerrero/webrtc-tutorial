'use strict';

// it is a new technology so Other browsers may use prefixes
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

// the media that you need to call 
class VideoApp {
  constructor() {
    // dom vars
    this.$video = document.querySelector('video');
    this.$select = document.querySelector('.select-video-filter');

    this.constraints = {
      audio: true,
      video: true
    }
  }

  boot() {
    // we call bind to have access to the current object
    navigator.getUserMedia(this.constraints, this._videoSuccess.bind(this), this._videoSuccess.bind(this))
    
    this._selectListener();
  }

  _videoSuccess(stream) {
    window.stream = stream;
    if (window.URL) {
      this.$video.src = window.URL.createObjectURL(stream);
    } else {
      this.$video.src = stream;
    }
  }

  _videoError(err) {
    console.log('get user media error: ', err);
  }

  _selectListener() {
    this.$select.addEventListener('change', (e) => {
      const filter = e.target.value;
      this.$video.className = filter;
    })
  }
}

const videoApp = new VideoApp();
videoApp.boot();



// filters



