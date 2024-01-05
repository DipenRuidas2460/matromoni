class Peerservice {
  constructor() {
    if (!this.peer) {
      this.peer = new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:global.stun.twilio.com:3478",
            ],
          },
        ],
        sdpSemantics: "plan-b",
      });
    }
  }

  async getAnswer(offer) {
    if (this.peer) {
      await this.peer.setRemoteDescription(offer);
      const ans = await this.peer.createAnswer();
      await this.peer.setLocalDescription(new RTCSessionDescription(ans));
      return ans;
    }
  }

  async getOffer() {
    if (this.peer) {
      const offer = await this.peer.createOffer();
      await this.peer.setLocalDescription(new RTCSessionDescription(offer));
      return offer;
    }
  }

  async setLocalDescription(ans) {
    // if (
    //   this.peer.signalingState !== "have-remote-offer" &&
    //   this.peer.connectionState !== "stable"
    // ) {
    //   await this.peer.setRemoteDescription(new RTCSessionDescription(ans));
    // } 

    await this.peer.setRemoteDescription(new RTCSessionDescription(ans));
  }
}

// eslint-disable-next-line
export default new Peerservice();
