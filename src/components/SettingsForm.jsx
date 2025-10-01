import React from 'react';
import { TextField, Typography, Box, Grid, Button, Checkbox, FormControlLabel } from "@mui/material";
import ColorInputGroup from './ColorInputGroup';
import ContentInputs from './ContentInputs'; 

/**
 * Componente che gestisce tutti i campi di input e i pulsanti del form.
 */
function SettingsForm({ state, setters, handlers }) {
  const { width, colorLight, colorDark, isTransparent } = state;
  const { setWidth, setColorLight, setColorDark, setLogoFile, setIsTransparent } = setters;
  const { handleGenerateQRCode, handleReset } = handlers;

  return (
    <>
      {/* Nuovo Componente per la Selezione del Contenuto */}
      <ContentInputs state={state} setters={setters} />

      <Grid container spacing={2} sx={{ mt: 1 }}>
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
        
        {/* Input Colore Sfondo */}
        <Grid item xs={12} sm={6}>
          <ColorInputGroup
            label="Colore Sfondo (HEX)"
            value={colorLight}
            onChange={setColorLight}
            disabled={isTransparent} // Disabilita se trasparente è selezionato
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={isTransparent}
                onChange={(e) => setIsTransparent(e.target.checked)}
              />
            }
            label="Sfondo Trasparente"
          />
        </Grid>

        {/* Input Colore QR Code */}
        <Grid item xs={12} sm={6}>
          <ColorInputGroup
            label="Colore QR Code (HEX)"
            value={colorDark}
            onChange={setColorDark}
          />
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
    </>
  );
}

export default SettingsForm;