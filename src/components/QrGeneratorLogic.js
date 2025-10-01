import QRCode from "qrcode";

// Chiave usata nel componente principale per indicare la trasparenza
const TRANSPARENT_KEY = 'transparent-key'; 

/**
 * Funzione per aggiungere un logo a un QR Code esistente, includendo l'Area Silenziosa.
 * @param {string} qrDataUrl - La stringa Data URL del QR Code.
 * @param {File} logoFile - L'oggetto File del logo caricato.
 * @param {number} size - La dimensione (larghezza/altezza) del QR Code in pixel.
 * @param {string} colorLight - Il colore di sfondo (o TRANSPARENT_KEY).
 * @returns {Promise<string>} - La Data URL del QR Code con il logo incorporato.
 */
export const addLogoToQr = (qrDataUrl, logoFile, size, colorLight) => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");

    // Imposta lo sfondo del canvas a trasparente fin dall'inizio
    if (colorLight === TRANSPARENT_KEY) {
        ctx.clearRect(0, 0, size, size);
    }

    const qrImage = new Image();
    qrImage.onload = () => {
      // 1. Disegna il QR Code di base
      ctx.drawImage(qrImage, 0, 0, size, size);

      const logoImage = new Image();
      const reader = new FileReader();
      reader.onload = (e) => {
        logoImage.onload = () => {
          // PARAMETRI CORRETTI PER LA LEGGIBILITÀ DEL QR CODE
          const logoSilentZoneRatio = 0.20; // Area silenziosa 20% del QR (Sicuro)
          const maxLogoSize = size * 0.15; // Dimensione massima del logo 15% (Sicuro)

          // 2. Disegna l'Area Silenziosa (quadrato bianco/colore chiaro)
          const silentZoneSize = size * logoSilentZoneRatio;
          const silentZoneX = (size - silentZoneSize) / 2;
          const silentZoneY = (size - silentZoneSize) / 2;
          
          // Usa il colore light del QR code come colore dell'area silenziosa (se non trasparente)
          ctx.fillStyle = colorLight === TRANSPARENT_KEY ? '#FFFFFF' : colorLight; 
          ctx.fillRect(silentZoneX, silentZoneY, silentZoneSize, silentZoneSize);

          // 3. Calcola le dimensioni finali del logo mantenendo l'aspect ratio
          let newWidth = logoImage.width;
          let newHeight = logoImage.height;
          const aspectRatio = logoImage.width / logoImage.height;

          if (newWidth > newHeight) {
            newWidth = maxLogoSize;
            newHeight = newWidth / aspectRatio;
          } else {
            newHeight = maxLogoSize;
            newWidth = newHeight * aspectRatio;
          }
          
          // 4. Calcola la posizione centrale del logo
          const x = (size - newWidth) / 2;
          const y = (size - newHeight) / 2;
          
          // 5. Disegna il logo
          ctx.drawImage(logoImage, x, y, newWidth, newHeight);
          resolve(canvas.toDataURL());
        };
        logoImage.src = e.target.result;
      };
      reader.readAsDataURL(logoFile);
    };
    qrImage.src = qrDataUrl;
  });
};

/**
 * Funzione principale per la generazione del QR Code (usa colore placeholder se necessario).
 */
export const generateQrcodeData = async (content, parsedWidth, colorLight, colorDark) => {
  return QRCode.toDataURL(content, {
    width: parsedWidth,
    height: parsedWidth,
    margin: 2,
    color: {
      light: colorLight, // Sarà #FFFFFF se trasparente
      dark: colorDark,
    },
  });
};

/**
 * Rende lo sfondo del QR Code trasparente (usato quando NON c'è il logo).
 */
export const makeBackgroundTransparent = (qrDataUrl, size) => {
    return new Promise((resolve) => {
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");

        const qrImage = new Image();
        qrImage.onload = () => {
            // 1. Disegna l'immagine sulla tela
            ctx.drawImage(qrImage, 0, 0, size, size);

            // 2. Ottieni i dati dell'immagine
            const imageData = ctx.getImageData(0, 0, size, size);
            const data = imageData.data;

            // 3. Itera sui pixel e rendi trasparenti i pixel bianchi (sfondo)
            const whiteR = 255, whiteG = 255, whiteB = 255;
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                // Se il colore è bianco (il nostro PLACEHOLDER), imposta l'alpha a 0
                if (r === whiteR && g === whiteG && b === whiteB) {
                    data[i + 3] = 0; // Canale Alpha
                }
            }

            // 4. Metti i dati modificati nel canvas e risolvi
            ctx.putImageData(imageData, 0, 0);
            resolve(canvas.toDataURL());
        };
        qrImage.src = qrDataUrl;
    });
};