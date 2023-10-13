# Hand Tracking Game
The project is a consists of a hand tracking game with unity and mediapipe that allows the user to pick and move objects around with their hand.  
In this repository you will find the Next.js project as well as the files with which we created the simulation in the Unity game engine from C# scripts to the objects used in the scene.

# Quick breakdown of the project
Within the Next app, I used Google's Mediapipe web implementation to run the hand tracking task on the user's webcam feed to detect their hand.   
I created the Unity game with the code necessary to retrieve the hand landmarks from the web app and of course, all the desired functionalities of the simulation.  
Thanks to the amazing and extremely helpful library of React-Unity-WebGL (https://react-unity-webgl.dev/docs/api/send-message) I managed to embed the Unity WebGL build of the simulation within the web app and successfully continuously send the hand landmarks from Next.js to Unity. Finally, the app was deployed using Vercel.  



## Result

![ezgif-5-0f3e6b7dac](https://github.com/ahmedbenaissa/HandTrackingGame/assets/78700276/d97d015f-2d0b-4235-81b3-e16d3c314551)
