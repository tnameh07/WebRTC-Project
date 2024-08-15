import { useEffect } from 'react'
import prepForCall from '../webrtcUtilities/prepForCall'
import socketConnection from '../webrtcUtilities/socketConnection'
import clientSocketListeners from '../webrtcUtilities/clientSocketListeners'
import { useState } from 'react'
import createPeerConnection from '../webrtcUtilities/createPeerConn'
import { useSearchParams, useNavigate } from 'react-router-dom';

const Home = ({callStatus,updateCallStatus,setLocalStream,
    setRemoteStream,remoteStream,peerConnection,setPeerConnection,
    localStream,userName, setUserName,offerData,setOfferData})=>{

    const [ typeOfCall, setTypeOfCall ] = useState()
    const [joined, setJoined] = useState(false)
    const [availableCalls, setAvailableCalls] = useState([])
    const navigate = useNavigate();

    //called on "Call" or "Answer"
    const initCall = async(typeOfCall)=>{
//set local Strean and GUM
console.log("Preparing for call :");
await prepForCall(callStatus,updateCallStatus,setLocalStream)
console.log("typeOfCall : Offer => :", typeOfCall);

setTypeOfCall(typeOfCall)//offer or answer 

    }

    //Test backend connection
    // useEffect(()=>{
    //     const test = async()=>{
    //         const socket = socketConnection("test")
    //     }
    //     //if this works, you will get pong in the console!
    //     test()
    // },[])
    
    //Nothing happens until the user clicks join
    //(Helps with React double render)
    useEffect(()=>{
        console.log(" User connected to sserver ");
        
if(joined){
    const userName = prompt("Enter user name ");
    setUserName(userName);

    const setCalls = data =>{
        console.log( "Setting available calls :  data printed +>" , data);
        setAvailableCalls(data)


        // console.log( "this shoud be printed just after clicking join " );
        
    }
    const socket = socketConnection(userName)
    socket.on('availableOffers', setCalls)
    socket.on('newOfferWaiting', setCalls)
}},[joined])


    //We have media via GUM. setup the peerConnection w/listeners
    useEffect(()=>{
if(callStatus.haveMedia && !peerConnection){
    // prep for call has fished running 
    const {peerConnection, remoteStream} =  createPeerConnection(userName, typeOfCall);
    setPeerConnection(peerConnection)
    setRemoteStream(remoteStream);
}

    },[callStatus.haveMedia])

    //We know which type of client this is and have PC.
    //Add socketlisteners
    useEffect(()=>{
        if(typeOfCall && peerConnection){
            const socket = socketConnection(userName)
            clientSocketListeners(socket, typeOfCall,callStatus,
                updateCallStatus,peerConnection
            )
        }

    },[typeOfCall,peerConnection])

    //once remoteStream AND pc are ready, navigate
    useEffect(()=>{
if(remoteStream && peerConnection){
    // console.log("GOt error here ? ");
    
    navigate(`/${typeOfCall}?token=${Math.random()}`)
    // console.log("not here  ? ");
}
       
    },[remoteStream,peerConnection])

    useEffect(()=>{
        
    })

    const call = async()=>{
        //call related stuff goes here
        console.log("Start calling ");
        initCall('offer')
        // console.log("Start calling ");
        
    }
    useEffect(() => {
       if(peerConnection){
        peerConnection.ontrack = e =>{
            if(e?.streams?.length){
                // setVideoMessage("");
            }else{
                // setVideoMessage("Disconnected")
            }
        }
       }
    }, [peerConnection]);
    

    const answer = (callData)=>{
        //answer related stuff goes here
initCall('answer');
setOfferData(callData)
    }

    if(!joined){
        return(
            <div className="container d-flex align-items-center justify-content-center min-vh-100">
                <button 
                    onClick={()=>setJoined(true)} 
                    className="btn btn-primary btn-lg"
                >Join</button>
            </div> 
        )
    }

    return (
        <div className="container">
            <div className="row">
                <h1>{userName}</h1>
                <div className="col-6"> 
                    <h2>Make a call</h2>
                    <button 
                        onClick={call} 
                        className="btn btn-success btn-lg hang-up"
                    >
                        Start Call
                    </button>
                </div>
                <div className="col-6"> 
                    <h2>Available Calls</h2>
                    {availableCalls.map((callData,i)=>
                        <div className="col mb-2" key={i}>
                            <button 
                                onClick={()=>{answer(callData)}}
                                className="btn btn-lg btn-warning hang-up"
                        >
                            Answer Call From {callData.offererUserName}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Home
