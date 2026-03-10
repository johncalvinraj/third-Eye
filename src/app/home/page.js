'use client'
import './page.css'
import {useState} from 'react'
import {
  GestureRecognizer,
  FilesetResolver,
  DrawingUtils
} from "@mediapipe/tasks-vision";
import Image from 'next/image'
import emergencyButton from './emergency-stop-button-red-warning-press-vector-31047051.jpg'

//special thanks to the mediapipe gesture recognition team for their interactive codepen from which most of this code is taken
//IMPORTANT: To implement multiple cameras use https://stackoverflow.com/questions/22787549/accessing-multiple-camera-javascript-getusermedia


export default function home() {
    let [cam, setCam] = useState([<></>])
    let gestureRecognizer = '';
    let mediaDevices = navigator.mediaDevices;
    async function start () {
      let devices = await navigator.mediaDevices.enumerateDevices()
      let cams = []
      let video = document.getElementById('test')
      for(let i = 0; i < devices.length; i++) {
        if (devices[i].kind === 'videoinput') cams.push(devices[i].deviceId)
      }
      console.log(cams)
      for (let camCount = 0; camCount < cams.length; camCount++) {
        mediaDevices.getUserMedia({video: {deviceId: {exact: cams[camCount]}}}).then((stream) => {
          video.srcObject = stream
          video.addEventListener("loadedmetadata", () => {
            predictWebcam()
            video.play();
          });
        })
        .catch(alert);
      }
    }
    function emergency () {
      alert('Emergency button pressed')
      var audio = new Audio('/mixkit-facility-alarm-sound-999 (1).wav');
      audio.play();
    }
    const createGestureRecognizer = async () => {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
      );
      gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
          delegate: "GPU"
        },
        numHands: 2 
      });
    };
    createGestureRecognizer();

    let lastVideoTime = -1;
    let results = undefined;
    let webcamRunning = true;
    let flag = false;
    let temp = true;
    async function predictWebcam () {
      let video = document.getElementById('test')
      if (!gestureRecognizer) {
        alert("Please wait for gestureRecognizer to load");
        return;
      }
      if (temp) {
        await gestureRecognizer.setOptions({ runningMode: "VIDEO" });
        temp = false
      }
      let nowInMs = Date.now();
      if (video.currentTime !== lastVideoTime) {
        lastVideoTime = video.currentTime;
        results = gestureRecognizer.recognizeForVideo(video, nowInMs);
        if(results.gestures[0] != undefined) {
          if (results.gestures[0][0].categoryName === 'Open_Palm') {
            flag = true
            setTimeout(() => {
              flag = false
            }, 1000);
          }
          console.log(results)
          if (results.gestures[0][0].categoryName === 'Closed_Fist' && flag) {
            console.log("HELP")
            alert('Gesture Detected. Help Called')
            emergency()
          }
        }
      }
      if (webcamRunning === true) {
        window.requestAnimationFrame(predictWebcam);
      }
    }
    function addCamera () {
      setCam(cam => [...cam, <h1>Web Camera</h1>])
    }
    function removeCam() {
      setCam(cam.map((value, index) => {
        if(index != cam.length-1) return value
        return <></>
      }))
    }

    return(<>
      <h1 id = 'title'>Real Time Surveillance System</h1>
      <div id = 'complete-wrapper'>
        <div id = 'navbar'>
          <div id = 'camera-container'>
            {cam}
          </div>
          <div>
            <div id = 'start-camera' onClick = {start}>
              <h2>Start Camera</h2>
            </div>
            <div id = 'add-camera' onClick={addCamera}>
              <h2>Add Camera</h2>
            </div>
            <div id = 'remove-camera' onClick={removeCam}>
              <h2>Remove Camera</h2>
            </div>
          </div>
        </div>
        <video id = 'test'></video>
      </div>
      <Image src={emergencyButton} height={200} width={200} onClick = {emergency} id = 'alert-button'/>
    </>)
}