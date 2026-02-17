import {
  FilesetResolver,
  HandLandmarker,
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

  const options = {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
      delegate: "GPU",
    },
    runningMode: "VIDEO",
    numHands: 2,
    minHandDetectionConfidence: 0.5,
    minHandPresenceConfidence: 0.5,
    minTrackingConfidence: 0.5,
  };

  try {
    return await HandLandmarker.createFromOptions(vision, options);
  } catch (error) {
    console.warn("Fallo en GPU, usando CPU", error);
    return HandLandmarker.createFromOptions(vision, {
      ...options,
      baseOptions: {
        ...options.baseOptions,
        delegate: "CPU",
      },
    });
  }
}

function resizeCanvas() {
  const { videoWidth, videoHeight } = video;
  if (videoWidth && videoHeight) {
    canvas.width = videoWidth;
    canvas.height = videoHeight;
  }
}

function drawLandmarks(landmarks) {
  ctx.fillStyle = "#6c7bff";
  for (const point of landmarks) {
    const x = point.x * canvas.width;
    const y = point.y * canvas.height;
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawConnectors(landmarks, connections) {
  ctx.strokeStyle = "#f5f7ff";
  ctx.lineWidth = 2;
  for (const [start, end] of connections) {
    const startPoint = landmarks[start];
    const endPoint = landmarks[end];
    if (!startPoint || !endPoint) {
      continue;
    }
    ctx.beginPath();
    ctx.moveTo(startPoint.x * canvas.width, startPoint.y * canvas.height);
    ctx.lineTo(endPoint.x * canvas.width, endPoint.y * canvas.height);
    ctx.stroke();
  }
}

function drawResults(results) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (results.landmarks) {
    for (const landmarks of results.landmarks) {
      drawConnectors(landmarks, HandLandmarker.HAND_CONNECTIONS);
      drawLandmarks(landmarks);
    }
  }
}

async function renderLoop() {
  if (!running || !handLandmarker) {
    return;
  }

  if (!canvas.width || !canvas.height) {
    resizeCanvas();
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
video.addEventListener("loadedmetadata", resizeCanvas);

setStatus("Pulsa Iniciar cámara");
