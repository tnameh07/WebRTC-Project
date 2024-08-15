
const VideoButton = ({localFeedEl,callStatus,localStream,updateCallStatus,peerConnection})=>{

    //handle user clicking on video button
    const startStopVideo = ()=>{

        // use cases 1 : Video  is enabled , so we need to disable 

        const copyCallStatus ={...callStatus}
        if(copyCallStatus.videoEnabled){
       copyCallStatus.videoEnabled =false;
       updateCallStatus(copyCallStatus)
       const tracks = localStream.getVideoTracks();
       tracks.forEach(track => {
        track.enabled = false;
       })
        }else if(copyCallStatus.videoEnabled === false){
            copyCallStatus.videoEnabled =true;
            updateCallStatus(copyCallStatus)
            const tracks = localStream.getVideoTracks();
            tracks.forEach(track => {
             track.enabled = true;
            })
        }else if(copyCallStatus.videoEnabled === null ) {
console.log("Init Video ");
copyCallStatus.videoEnabled = true;
updateCallStatus(copyCallStatus);
// we are not adding tracks so they are visible in the video tag. we are 
// adding tthem for peerConnection so they can be send
localStream.getTracks().forEach( track => {
    peerConnection.addTrack(track, localStream)
})

        }
        // 2 : Video is disable , so enable it

        // 3 
    }

    return(
        <div className="button-wrapper video-button d-inline-block">
            <i className="fa fa-caret-up choose-video"></i>
            <div className="button camera" onClick={startStopVideo}>
                <i className="fa fa-video"></i>
                <div className="btn-text">{callStatus.video === "enabled" ? "Stop" : "Start"} Video</div>
            </div>
        </div>
    )
}
export default VideoButton;