"use client";

import React, { useRef, useEffect } from "react";
import Webcam from "react-webcam";
import Stats from 'stats.js';
import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { Unity, useUnityContext, SendMessage } from "react-unity-webgl";

export default function App() {

    const { unityProvider, sendMessage, isLoaded } = useUnityContext({
    loaderUrl: "../web build/Build/web build.loader.js",
    dataUrl: "../web build/Build/web build.data",
    frameworkUrl: "../web build/Build/web build.framework.js",
    codeUrl: "../web build/Build/web build.wasm",
  });

   
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const statsRef = useRef(null);
    const handLandmarkerRef = useRef(null); // Change variable name to 'handLandmarkerRef'

    // Check if webcam access is supported
    function hasGetUserMedia() {
        return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    }

    useEffect(() => {
        if(isLoaded){
        if (!hasGetUserMedia()) {
            console.warn("getUserMedia() is not supported by your browser");
            return;
        }

        statsRef.current = new Stats();
        statsRef.current.showPanel(0);
        document.body.appendChild(statsRef.current.dom);

        // Initialize handLandmarker
        (async () => {
            const vision = await FilesetResolver.forVisionTasks(
                "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
            );

            const handLandmarker = await HandLandmarker.createFromOptions(vision, {
                baseOptions: {
                    modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
                    delegate: "GPU"
                },
                runningMode: "VIDEO",
                numHands: 1
            });
            await handLandmarker.setOptions({ runningMode: "VIDEO" });

            handLandmarkerRef.current = handLandmarker; // Assign to 'handLandmarkerRef'

            let lastVideoTime = -1; 
            async function renderLoop() {
                const video = webcamRef.current.video;
                let timestamp = performance.now();
                if (video.currentTime !== lastVideoTime) {
                    const handLandmarkerResult = await handLandmarkerRef.current.detectForVideo(video, timestamp);
                    processResults(handLandmarkerResult);
                   const landmarks = JSON.stringify(handLandmarkerResult.landmarks); // Implement this function to get landmarks
                    sendMessage("Manager", "ReceiveHandLandmarks", landmarks);
 
                    lastVideoTime = video.currentTime; 
                }  
     
                requestAnimationFrame(() => {
                    renderLoop();
                });
            } 
  
            await renderLoop(); 
        })();  
        }    
    }, [isLoaded]);

    // Define a function to process handLandmarker r esults
    function processResults(results) {
       const res =  JSON.stringify(results.landmarks);

        console.log(res);  
    }
    const containerStyle = {
        display: "flex",
        flexDirection: "column",  
        justifyContent: "center",
        alignItems: "center",
        height: "100vh", // Make the container take up the full viewport height
      };
    const webcamStyle = {
        transform: "scaleX(-1)",
        width: "20vw", 
        height: "20vh",
        marginTop: "0px", 
      };
 
    return (
        <div style={containerStyle}>
        <div>
            <Webcam
                ref={webcamRef}
                style={webcamStyle}  
            />
 
            <canvas
                ref={canvasRef}
                style={{ display: 'none' }}
            />
             
        </div>
        <div>
            <Unity unityProvider={unityProvider} style={{ width: "60vw", height: "80vh" }}/>;

        </div>
        </div>
    )
}