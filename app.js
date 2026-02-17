import {
  FilesetResolver,
  HandLandmarker,
  DrawingUtils,
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.20";

const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const statusLabel = document.getElementById("status");
const video = document.getElementById("inputVideo");
const canvas = document.getElementById("outputCanvas");
const ctx = canvas.getContext("2d");

let handLandmarker = null;
let animationId = null;
let running = false;
let lastVideoTime = -1;

function setStatus(text) {
  statusLabel.textContent = text;
}

function formatError(error) {
  if (!error) {
    return "Error desconocido.";
  }
  if (typeof error === "string") {
    return error;
  }
  return error.message || "Error desconocido.";
}

async function createLandmarker() {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.20/wasm"
  );

  return HandLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
      delegate: "GPU",
    },
    runningMode: "VIDEO",
    numHands: 2,
  });
}

function resizeCanvas() {
  const { videoWidth, videoHeight } = video;
  if (videoWidth && videoHeight) {
    canvas.width = videoWidth;
    canvas.height = videoHeight;
  }
}

function drawResults(results) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const drawingUtils = new DrawingUtils(ctx);

  if (results.landmarks) {
    for (const landmarks of results.landmarks) {
      drawingUtils.drawLandmarks(landmarks, {
        color: "#6c7bff",
        lineWidth: 2,
      });
      drawingUtils.drawConnectors(
        landmarks,
        HandLandmarker.HAND_CONNECTIONS,
        {
          color: "#f5f7ff",
          lineWidth: 2,
        }
      );
    }
  }
}

async function renderLoop() {
  if (!running || !handLandmarker) {
    return;
  }

  if (video.currentTime !== lastVideoTime) {
    lastVideoTime = video.currentTime;
    const results = handLandmarker.detectForVideo(video, performance.now());
    drawResults(results);
  }

  animationId = requestAnimationFrame(renderLoop);
}

async function startCamera() {
  setStatus("Solicitando permiso de cámara...");
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error("Tu navegador no soporta cámara web.");
  }
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: "user" },
    audio: false,
  });

  video.muted = true;
  video.setAttribute("muted", "");
  video.srcObject = stream;
  await video.play();
  resizeCanvas();
  setStatus("Cámara activa. Detectando manos...");
}

async function startApp() {
  try {
    startButton.disabled = true;
    setStatus("Cargando modelo...");

    if (!handLandmarker) {
      handLandmarker = await createLandmarker();
    }

    await startCamera();
    running = true;
    stopButton.disabled = false;
    renderLoop();
  } catch (error) {
    console.error(error);
    setStatus(`No se pudo iniciar la cámara: ${formatError(error)}`);
    startButton.disabled = false;
  }
}

function stopApp() {
  running = false;
  stopButton.disabled = true;
  startButton.disabled = false;
  setStatus("Cámara detenida.");

  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }

  if (video.srcObject) {
    for (const track of video.srcObject.getTracks()) {
      track.stop();
    }
    video.srcObject = null;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

startButton.addEventListener("click", startApp);
stopButton.addEventListener("click", stopApp);

window.addEventListener("resize", resizeCanvas);

setStatus("Pulsa Iniciar cámara");
