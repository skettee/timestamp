document.addEventListener('DOMContentLoaded', async () => {
    const video = document.getElementById('camera');
    const canvas = document.getElementById('canvas');
    const captureBtn = document.getElementById('capture');
    const timestampDiv = document.getElementById('timestamp');
    const ctx = canvas.getContext('2d');

    // Request camera access
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' },
            audio: false
        });
        video.srcObject = stream;
    } catch (err) {
        console.error('Error accessing camera:', err);
        alert('Error accessing camera. Please make sure you have granted camera permissions.');
    }

    // Update timestamp every second
    function updateTimestamp() {
        const now = new Date();
        const timestamp = now.toISOString()
            .replace('T', ' ')
            .replace(/\.\d+Z$/, '');
        timestampDiv.textContent = timestamp;
    }
    updateTimestamp();
    setInterval(updateTimestamp, 1000);

    // Handle photo capture
    captureBtn.addEventListener('click', () => {
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw video frame to canvas
        ctx.drawImage(video, 0, 0);

        // Add timestamp to the image
        const timestamp = timestampDiv.textContent;
        ctx.font = '20px monospace';
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        
        // Position timestamp at bottom center
        const textMetrics = ctx.measureText(timestamp);
        const x = (canvas.width - textMetrics.width) / 2;
        const y = canvas.height - 20;

        // Draw text with stroke for better visibility
        ctx.strokeText(timestamp, x, y);
        ctx.fillText(timestamp, x, y);

        // Convert to image and trigger download
        const image = canvas.toDataURL('image/jpeg');
        const link = document.createElement('a');
        link.href = image;
        link.download = `photo_${timestamp.replace(/[: ]/g, '-')}.jpg`;
        link.click();
    });
});