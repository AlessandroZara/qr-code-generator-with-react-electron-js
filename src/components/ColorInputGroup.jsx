import React from 'react';
import { TextField, Box } from "@mui/material";

/**
 * Componente riutilizzabile per l'input del colore (testo HEX + selettore visivo).
 */
function ColorInputGroup({ label, value, onChange }) {
  // Calcola l'altezza necessaria per allinearsi visivamente con il TextField.
  const inputColorSize = 36; 
  
  return (
    // Avvolgiamo tutto in un Box per gestire la spaziatura uniforme all'interno della Grid.
    // Aggiungiamo un padding leggero su tutti i lati del gruppo di input per migliorare l'estetica.
    <Box 
      display="flex" 
      alignItems="center" 
      sx={{ 
        // Aggiunge un padding orizzontale per distanziare il contenuto dai bordi della Grid
        px: 0.5, 
        // Rende il Box flex per affiancare gli elementi
        display: 'flex', 
        alignItems: 'center' 
      }}
    >
      <TextField
        fullWidth
        label={label}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        sx={{ 
          // Aumentiamo leggermente il margine destro per separare dal selettore
          mr: 1.5 
        }}
      />
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        // Stili per forma quadrata e allineamento visivo
        style={{ 
          width: inputColorSize, 
          height: inputColorSize, 
          padding: 4, 
          minHeight: 0, 
          border: '1px solid #ccc', 
          borderRadius: '4px', 
          background: 'transparent', 
          cursor: 'pointer',
          // Aggiungiamo un margine per dare spazio a destra del quadrato.
          marginRight: '8px' // Spazio extra sul lato destro del selettore
        }}
      />
    </Box>
  );
}

export default ColorInputGroup;