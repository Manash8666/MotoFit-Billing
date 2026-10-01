const fs = require('fs');

async function generateAPK() {
  console.log("Generating APK via PWABuilder API...");
  
  const payload = {
    "additionalTrustedOrigins": [],
    "appVersion": "1.0.0.0",
    "appVersionCode": 1,
    "backgroundColor": "#0b132b",
    "display": "standalone",
    "enableNotifications": true,
    "enableSiteSettingsShortcut": true,
    "fallbackType": "customtabs",
    "features": {
      "locationDelegation": { "enabled": true },
      "playBilling": { "enabled": false }
    },
    "host": "https://billing.motofit2.in",
    "iconUrl": "https://billing.motofit2.in/icon-512.png",
    "includeSourceCode": false,
    "isChromeOSOnly": false,
    "launcherName": "MotoFit 2",
    "name": "MotoFit 2 - Garage CRM",
    "packageId": "in.motofit2.billing",
    "signingMode": "new",
    "startUrl": "/",
    "themeColor": "#f04923",
    "manifestUrl": "https://billing.motofit2.in/manifest.json",
    "manifest": {
      "name": "MotoFit 2",
      "short_name": "MotoFit",
      "start_url": "/",
      "display": "standalone",
      "background_color": "#0b132b",
      "theme_color": "#f04923",
      "icons": [
        {
          "src": "https://billing.motofit2.in/icon-192.png",
          "sizes": "192x192",
          "type": "image/png"
        },
        {
          "src": "https://billing.motofit2.in/icon-512.png",
          "sizes": "512x512",
          "type": "image/png"
        }
      ]
    }
  };

  try {
    const res = await fetch("https://pwabuilder-android-cloud.azurewebsites.net/api/generateAppPackage", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/zip'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Failed!", res.status, text);
      return;
    }

    const buffer = await res.arrayBuffer();
    fs.writeFileSync("MotoFit2-PWA-Android.zip", Buffer.from(buffer));
    console.log("✅ SUCCESS! Saved as MotoFit2-PWA-Android.zip");
  } catch (err) {
    console.error("Error:", err);
  }
}

generateAPK();
