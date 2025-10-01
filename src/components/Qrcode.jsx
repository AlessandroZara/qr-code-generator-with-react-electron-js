/* eslint-disable jsx-a11y/alt-text */
import { useState, useCallback } from "react";
import {
  Button,
  Typography,
  Container,
  Paper,
  Box,
  Alert,
  Snackbar,
} from "@mui/material";

// Importa i componenti e la logica dai file esterni
import SettingsForm from './SettingsForm';
import { generateQrcodeData, addLogoToQr, makeBackgroundTransparent } from './QrGeneratorLogic';
import { buildQrContent } from './qrContentBuilder'; 

// --- Costanti ---
const URL_PATTERN = new RegExp(
  "(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?"
);
const PLACEHOLDER_COLOR = '#FFFFFF';
const TRANSPARENT_KEY = 'transparent-key';

// --- STATO INIZIALE VCARD ---
const initialVCardDetails = { 
  firstName: "", 
  lastName: "", 
  mobile: "", 
  office: "", 
  email: "",
  position: "",
  company: ""
};

function Qrcode() {
  // --- STATO DELL'APPLICAZIONE ---
  const [url, setUrl] = useState("https://");
  const [qr, setQr] = useState("");
  const [width, setWidth] = useState("256");
  const [colorLight, setColorLight] = useState("#FFFFFF");
  const [colorDark, setColorDark] = useState("#000000");
  const [error, setError] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  
  // STATI PER NUOVE FUNZIONALITÀ (Ripristinati)
  const [contentType, setContentType] = useState("url"); 
  const [textValue, setTextValue] = useState(""); 
  const [wifiDetails, setWifiDetails] = useState({ ssid: "", password: "", encryption: "WPA" }); 
  const [vCardDetails, setVCardDetails] = useState(initialVCardDetails); // Aggiornato
  const [isTransparent, setIsTransparent] = useState(false); 


  // --- FUNZIONI PRINCIPALI ---

  const handleGenerateQRCode = useCallback(async () => {
    setError("");

    // 1. COSTRUZIONE DEL CONTENUTO E VALIDAZIONE INIZIALE
    const details = { url, textValue, wifiDetails, vCardDetails };
    const content = buildQrContent(contentType, details);

    // Gestione dei casi in cui non ci sono contenuti validi
    if (contentType !== 'vcard' && (!content || content === 'https://')) {
        setError("Per favore, inserisci un contenuto valido.");
        return;
    }
    // Per vCard, controlliamo se almeno un campo è compilato
    if (contentType === 'vcard') {
        const isAnyVCardFieldFilled = Object.values(vCardDetails).some(val => val.trim() !== '');
        if (!isAnyVCardFieldFilled) {
             setError("Per favore, compila almeno un campo della vCard.");
             return;
        }
    }

    if (contentType === 'url' && url.length > 0 && url !== 'https://' && !URL_PATTERN.test(url)) {
      setError("Per favor, inserisci un URL valido.");
      return;
    }
    
    // Validazione generale
    const parsedWidth = parseInt(width);
    if (isNaN(parsedWidth) || parsedWidth < 50 || parsedWidth > 1000) {
      setError("Grandezza non valida. Inserisci un numero tra 50 e 1000.");
      return;
    }
    if (!colorDark) {
      setError("Per favore, seleziona il colore del QR Code.");
      return;
    }

    // 2. IMPOSTAZIONE DEL COLORE DI SFONDO (Gestione Trasparenza)
    const qrCodeLightColor = isTransparent ? PLACEHOLDER_COLOR : colorLight;

    try {
      // 3. GENERAZIONE DEL QR CODE
      let qrUrl = await generateQrcodeData(content, parsedWidth, qrCodeLightColor, colorDark);

      let finalQr = qrUrl;

      // 4. AGGIUNTA DEL LOGO E DELL'AREA SILENZIOSA
      if (logoFile) {
        const logoLightColor = isTransparent ? TRANSPARENT_KEY : colorLight; 
        finalQr = await addLogoToQr(qrUrl, logoFile, parsedWidth, logoLightColor);
      }
      
      // 5. RENDI LO SFONDO TRASPARENTE (Solo se NON è stato applicato il logo)
      if (isTransparent && !logoFile) {
          finalQr = await makeBackgroundTransparent(qrUrl, parsedWidth);
      }
      
      setQr(finalQr);
    } catch (err) {
      setError("Errore nella generazione del QR Code: " + err.message);
      console.error(err);
    }
  }, [
    url, width, colorLight, colorDark, logoFile, isTransparent, contentType,
    textValue, wifiDetails, vCardDetails,
  ]); 

  const handleReset = useCallback(() => {
    setQr("");
    setUrl("https://");
    setWidth("256");
    setColorLight("#FFFFFF");
    setColorDark("#000000");
    setLogoFile(null);
    setError("");
    // Reset dei nuovi stati
    setContentType("url");
    setTextValue("");
    setWifiDetails({ ssid: "", password: "", encryption: "WPA" });
    setVCardDetails(initialVCardDetails); // Reset VCARD
    setIsTransparent(false);
  }, []);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = qr;
    link.download = "qrcode.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const state = { url, width, colorLight, colorDark, contentType, textValue, wifiDetails, vCardDetails, isTransparent };
  const setters = { setUrl, setWidth, setColorLight, setColorDark, setLogoFile, setContentType, setTextValue, setWifiDetails, setVCardDetails, setIsTransparent };
  const handlers = { handleGenerateQRCode, handleReset };

  // --- RENDERIZZAZIONE ---

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h3" gutterBottom align="center" color="#007bff">
          QR Code Generator
        </Typography>
        <Typography variant="h6" align="center" color="textSecondary" sx={{ mb: 4 }}>
          Crea i tuoi QR Code personalizzati in modo rapido e semplice!
        </Typography>

        <SettingsForm 
          state={state} 
          setters={setters} 
          handlers={handlers}
        />

        {qr && (
          <Box
            sx={{
              mt: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              // Stili a scacchiera sul contenitore per mostrare la trasparenza
              padding: isTransparent ? '20px' : '0', 
              backgroundImage: isTransparent ? 'repeating-linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), repeating-linear-gradient(45deg, #ccc 25%, #fff 25%, #fff 75%, #ccc 75%, #ccc)' : 'none',
              backgroundSize: isTransparent ? '20px 20px' : 'none',
              backgroundPosition: isTransparent ? '0 0, 10px 10px' : 'none',
              border: isTransparent ? '1px solid #ccc' : 'none'
            }}
          >
            <Typography variant="h6" gutterBottom>
              Il tuo QR Code è pronto!
            </Typography>
            <img 
                src={qr} 
                style={{ 
                    maxWidth: "100%", 
                    height: "auto",
                }} 
                alt="QR Code" 
            />
            <Button
              variant="contained"
              color="success"
              sx={{ mt: 2 }}
              onClick={handleDownload}
            >
              Download
            </Button>
          </Box>
        )}

        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError("")}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert onClose={() => setError("")} severity="error">
            {error}
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
}

export default Qrcode;