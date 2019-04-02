const url = 'http://thisnode.info/cgi-bin/client_ip'

export default () => new Promise((resolve, reject) => {
  window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;//compatibility for Firefox and chrome
  var pc = new RTCPeerConnection({iceServers:[]}), noop = function(){};      
  pc.createDataChannel('');//create a bogus data channel
  pc.createOffer(pc.setLocalDescription.bind(pc), noop);// create offer and set local description
  pc.onicecandidate = function(ice) {
    if (ice && ice.candidate && ice.candidate.candidate) {
      var myIP = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/.exec(ice.candidate.candidate)[1];
      // console.log('my IP: ', myIP);   
      pc.onicecandidate = noop;
      if (myIP) resolve(myIP)
      else {
        fetch(url)
        .then(i => {
          console.log(i)
          return JSON.parse(i) 
        })
        .then((res) => {
          console.log('Ubus res: ', res)
          if (res && res.result[1]) {
            resolve(res.result[1])
          } else if (res.error) {
            reject(res.error)
          }
        })
        .catch((err) => {
          console.log('Erro no Ubus', err)
        })
      }
    }
  }
})
