// script.js

const video = document.getElementById('camera');
const canvas = document.getElementById('canvas');
const captureButton = document.getElementById('captureButton');

// Access the device camera
async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
  } catch (error) {
    console.error('Error accessing the camera:', error);
    alert('Unable to access the camera. Please check permissions.');
  }
}

// Capture the image
captureButton.addEventListener('click', async () => {
  const context = canvas.getContext('2d');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  // Draw the video frame onto the canvas
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Convert the image to a Blob and send it to the backend
  const imageBlob = await new Promise((resolve) => canvas.toBlob(resolve));
  uploadImage(imageBlob);
});

// Send the image to the backend for processing
async function uploadImage(imageBlob) {
  const formData = new FormData();
  formData.append('image', imageBlob);

  const response = await fetch('http://localhost:5000/process', {
    method: 'POST',
    body: formData,
  });

  const views = await response.json();
  displayViews(views);
}

// Update the view containers with the generated views
function displayViews(views) {
  document.getElementById('topView').style.backgroundImage = `url(${views.top})`;
  document.getElementById('bottomView').style.backgroundImage = `url(${views.bottom})`;
  document.getElementById('frontView').style.backgroundImage = `url(${views.front})`;
  document.getElementById('leftView').style.backgroundImage = `url(${views.left})`;
  document.getElementById('rightView').style.backgroundImage = `url(${views.right})`;

  document.querySelectorAll('.view').forEach(view => {
    view.style.backgroundSize = 'cover';
    view.style.backgroundPosition = 'center';
  });
}

// Start the camera on page load
startCamera();
