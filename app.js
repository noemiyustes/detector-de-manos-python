const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const statusLabel = document.getElementById("status");
const video = document.getElementById("inputVideo");
const canvas = document.getElementById("outputCanvas");
const ctx = canvas.getContext("2d");

let hands = null;
let animationId = null;
let running = false;

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

function resizeCanvas() {
  const { videoWidth, videoHeight } = video;
  if (videoWidth && videoHeight) {
    canvas.width = videoWidth;
    canvas.height = videoHeight;
  }
}

function onResults(results) {
  ctx.save();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
    for (const landmarks of results.multiHandLandmarks) {
      drawConnectors(ctx, landmarks, HAND_CONNECTIONS, {
        color: "#f5f7ff",
        lineWidth: 2,
      });
      drawLandmarks(ctx, landmarks, {
        color: "#6c7bff",
        lineWidth: 2,
      });
    }
    setStatus(`Manos detectadas: ${results.multiHandLandmarks.length}`);
  } else {
    setStatus("Detectando manos...");
  }

  ctx.restore();
}

function initHands() {
  hands = new Hands({
    locateFile: (file) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
  });

  hands.setOptions({
    maxNumHands: 2,
    modelComplexity: 0,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
  });

  hands.onResults(onResults);
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

async function renderLoop() {
  if (!running || !hands) {
    return;
  }

  if (!canvas.width || !canvas.height) {
    resizeCanvas();
  }

  if (video.readyState >= 2) {
    await hands.send({ image: video });
  }

  animationId = requestAnimationFrame(renderLoop);
}

async function startApp() {
  try {
    startButton.disabled = true;
    setStatus("Cargando modelo...");

    if (!hands) {
      initHands();
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
