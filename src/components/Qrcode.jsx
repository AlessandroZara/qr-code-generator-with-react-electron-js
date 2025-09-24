/* eslint-disable jsx-a11y/alt-text */
import QRCode from "qrcode";
import { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Box,
  Alert,
  Snackbar,
  Grid,
} from "@mui/material";

function Qrcode() {
  const [url, setUrl] = useState("https://");
  const [qr, setQr] = useState("");
  const [width, setWidth] = useState("256");
  const [colorLight, setColorLight] = useState("#FFFFFF");
  const [colorDark, setColorDark] = useState("#000000");
  const [error, setError] = useState("");
  const [logoFile, setLogoFile] = useState(null);

  const pattern = new RegExp(
    "(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?"
  );

  const handleGenerateQRCode = async () => {
    setError("");

    // Validazione dei campi di input
    if (!url || url === "https://") {
      setError("Per favore, inserisci un indirizzo URL.");
      return;
    }
    if (!pattern.test(url)) {
      setError("Per favor, inserisci un URL valido.");
      return;
    }
    const parsedWidth = parseInt(width);
    if (isNaN(parsedWidth) || parsedWidth < 50 || parsedWidth > 1000) {
      setError("Grandezza non valida. Inserisci un numero tra 50 e 1000.");
      return;
    }
    if (!colorLight || !colorDark) {
      setError("Per favore, seleziona entrambi i colori.");
      return;
    }

    try {
      const qrUrl = await QRCode.toDataURL(url, {
        width: parsedWidth,
        height: parsedWidth,
        margin: 2,
        color: {
          light: colorLight,
          dark: colorDark,
        },
      });

      let finalQr = qrUrl;

      // Logica per inserire il logo solo se è stato caricato un file
      if (logoFile) {
        finalQr = await addLogoToQr(qrUrl, logoFile, parsedWidth);
      }

      setQr(finalQr);
    } catch (err) {
      setError("Errore nella generazione del QR Code.");
      console.error(err);
    }
  };

  const addLogoToQr = (qrDataUrl, logoFile, size) => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");

      const qrImage = new Image();
      qrImage.onload = () => {
        ctx.drawImage(qrImage, 0, 0, size, size);

        const logoImage = new Image();
        const reader = new FileReader();
        reader.onload = (e) => {
          logoImage.onload = () => {
            const maxLogoSize = size * 0.3; // Mantenuto al 30% come richiesto
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

            const x = (size - newWidth) / 2;
            const y = (size - newHeight) / 2;
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

  const handleReset = () => {
    setQr("");
    setUrl("https://");
    setWidth("256");
    setColorLight("#FFFFFF");
    setColorDark("#000000");
    setLogoFile(null);
    setError("");
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = qr;
    link.download = "qrcode.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h3" gutterBottom align="center" color="#007bff">
          QR Code Generator
        </Typography>
        <Typography variant="h6" align="center" color="textSecondary" sx={{ mb: 4 }}>
          Crea i tuoi QR Code personalizzati in modo rapido e semplice!
        </Typography>

        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Inserisci l'URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="e.g. https://google.com"
            sx={{
              '& .MuiInputBase-input': {
                overflow: 'visible',
                textOverflow: 'clip',
                padding: '12px 14px',
              },
            }}
          />
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Grandezza in pixel (50-1000)"
              type="number"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              placeholder="256"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" sx={{ height: '100%' }}>
              <Typography variant="body1" sx={{ mr: 1, minWidth: 'fit-content' }}>Carica Logo (Opzionale):</Typography>
              <input
                type="file"
                onChange={(e) => setLogoFile(e.target.files[0])}
              />
            </Box>
          </Grid>
          {/* Campo di input per il colore di sfondo con selettore visibile */}
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center">
              <TextField
                fullWidth
                label="Colore Sfondo (HEX)"
                type="text"
                value={colorLight}
                onChange={(e) => setColorLight(e.target.value)}
                sx={{ mr: 1 }}
              />
              <input
                type="color"
                value={colorLight}
                onChange={(e) => setColorLight(e.target.value)}
                // Stili aumentati per il selettore di colore
                style={{ width: 50, height: 50, border: '1px solid #ccc', borderRadius: '4px', background: 'transparent', cursor: 'pointer' }}
              />
            </Box>
          </Grid>
          {/* Campo di input per il colore del QR Code con selettore visibile */}
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center">
              <TextField
                fullWidth
                label="Colore QR Code (HEX)"
                type="text"
                value={colorDark}
                onChange={(e) => setColorDark(e.target.value)}
                sx={{ mr: 1 }}
              />
              <input
                type="color"
                value={colorDark}
                onChange={(e) => setColorDark(e.target.value)}
                // Stili aumentati per il selettore di colore
                style={{ width: 50, height: 50, border: '1px solid #ccc', borderRadius: '4px', background: 'transparent', cursor: 'pointer' }}
              />
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: "flex", justifyContent: "center", gap: 2 }}>
          <Button variant="contained" onClick={handleGenerateQRCode}>
            Genera
          </Button>
          <Button variant="outlined" color="error" onClick={handleReset}>
            Reset
          </Button>
        </Box>

        {qr && (
          <Box
            sx={{
              mt: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Il tuo QR Code è pronto!
            </Typography>
            <img src={qr} style={{ maxWidth: "100%", height: "auto" }} alt="QR Code" />
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