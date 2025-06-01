document.addEventListener('DOMContentLoaded', async () => {
    const video = document.getElementById('camera');
    const canvas = document.getElementById('canvas');
    const captureBtn = document.getElementById('capture');
    const switchBtn = document.getElementById('switch-camera');
    const timestampDiv = document.getElementById('timestamp');
    const ctx = canvas.getContext('2d');
    let currentFacingMode = 'environment';

    // Function to start camera with specified facing mode
    async function startCamera(facingMode) {
        try {
            // Stop any existing stream
            if (video.srcObject) {
                video.srcObject.getTracks().forEach(track => track.stop());
            }
            
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: facingMode },
                audio: false
            });
            video.srcObject = stream;
            currentFacingMode = facingMode;
        } catch (err) {
            console.error('Error accessing camera:', err);
            alert('Error accessing camera. Please make sure you have granted camera permissions.');
        }
    }

    // Initial camera start with back camera
    await startCamera('environment');

    // Switch camera button handler
    switchBtn.addEventListener('click', async () => {
        const newMode = currentFacingMode === 'environment' ? 'user' : 'environment';
        await startCamera(newMode);
    });

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
        
        // Position timestamp at top center
        const textMetrics = ctx.measureText(timestamp);
        const x = (canvas.width - textMetrics.width) / 2;
        const y = 40;  // 상단에서 40px 아래에 위치

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