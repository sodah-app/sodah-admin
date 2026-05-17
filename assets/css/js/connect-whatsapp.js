const API_BASE = "http://89.167.127.70:8080";
const API_KEY = "sodah123";
const INSTANCE_NAME = "sodah";

const generateBtn = document.getElementById("generateBtn");
const statusDiv = document.getElementById("status");
const qrContainer = document.getElementById("qrContainer");
const qrImage = document.getElementById("qrImage");

generateBtn.addEventListener("click", generateQRCode);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function apiRequest(url, method = "GET") {
  const response = await fetch(url, {
    method,
    headers: {
      apikey: API_KEY,
      "Content-Type": "application/json"
    }
  });

  try {
    return await response.json();
  } catch {
    return {};
  }
}

async function generateQRCode() {
  generateBtn.disabled = true;
  qrContainer.style.display = "none";
  statusDiv.textContent = "Restarting WhatsApp instance...";

  try {
    // 1. Disconnect current session (ignore errors)
    await apiRequest(
      `${API_BASE}/instance/logout/${INSTANCE_NAME}`,
      "DELETE"
    ).catch(() => {});

    // 2. Restart the instance
    await apiRequest(
      `${API_BASE}/instance/restart/${INSTANCE_NAME}`,
      "PUT"
    ).catch(() => {});

    // 3. Wait for Evolution API to restart
    statusDiv.textContent = "Preparing WhatsApp connection...";
    await sleep(10000);

    // 4. Trigger connection
    await apiRequest(
      `${API_BASE}/instance/connect/${INSTANCE_NAME}`,
      "GET"
    );

    // 5. Poll for QR code
    const maxAttempts = 30;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      statusDiv.textContent =
        `Waiting for QR code... Attempt ${attempt} of ${maxAttempts}`;

      const data = await apiRequest(
        `${API_BASE}/instance/connect/${INSTANCE_NAME}`,
        "GET"
      );

      console.log("Evolution API Response:", data);

      const qrCode =
        data.base64 ||
        data.qrcode?.base64 ||
        data.qrcode?.code ||
        data.qr ||
        data.response?.base64 ||
        data.response?.qrcode?.base64;

      if (qrCode) {
        if (qrCode.startsWith("data:image")) {
          qrImage.src = qrCode;
        } else {
          qrImage.src = `data:image/png;base64,${qrCode}`;
        }

        qrContainer.style.display = "block";
        statusDiv.textContent =
          "Scan this QR code with WhatsApp on your phone.";
        generateBtn.disabled = false;
        return;
      }

      await sleep(3000);
    }

    statusDiv.textContent =
      "QR code was not generated. Please ensure the Evolution API instance is running and try again.";
  } catch (error) {
    console.error(error);
    statusDiv.textContent =
      "Error communicating with Evolution API.";
  }

  generateBtn.disabled = false;
}