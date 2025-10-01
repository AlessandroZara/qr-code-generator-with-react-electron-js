import React from 'react';
import { TextField, MenuItem, Grid, Select, FormControl, InputLabel } from "@mui/material";

/**
 * Componente che gestisce i campi di input specifici in base al tipo di contenuto selezionato.
 */
function ContentInputs({ state, setters }) {
    const { contentType, textValue, wifiDetails, vCardDetails } = state;
    const { setContentType, setTextValue, setWifiDetails, setVCardDetails } = setters;

    // Gestione generica del cambiamento per i dettagli (vcard/wifi)
    const handleDetailChange = (type, key, value) => {
        if (type === 'wifi') {
            setWifiDetails(prev => ({ ...prev, [key]: value }));
        } else if (type === 'vcard') {
            setVCardDetails(prev => ({ ...prev, [key]: value }));
        }
    };

    return (
        <Grid container spacing={2}>
            {/* 1. SELETTORE TIPO CONTENUTO */}
            <Grid item xs={12}>
                <FormControl fullWidth>
                    <InputLabel id="content-type-label">Tipo di Contenuto</InputLabel>
                    <Select
                        labelId="content-type-label"
                        value={contentType}
                        label="Tipo di Contenuto"
                        onChange={(e) => setContentType(e.target.value)}
                    >
                        <MenuItem value="url">URL (Link)</MenuItem>
                        <MenuItem value="text">Testo Semplice</MenuItem>
                        <MenuItem value="wifi">Rete Wi-Fi</MenuItem>
                        <MenuItem value="vcard">Biglietto da Visita (vCard)</MenuItem>
                    </Select>
                </FormControl>
            </Grid>

            {/* 2. CAMPI INPUT CONDIZIONALI */}

            {/* URL Input (Default) */}
            {contentType === 'url' && (
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Inserisci l'URL"
                        value={state.url}
                        onChange={(e) => setters.setUrl(e.target.value)}
                        placeholder="e.g. https://google.com"
                    />
                </Grid>
            )}

            {/* Testo Semplice Input */}
            {contentType === 'text' && (
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Inserisci il Testo"
                        multiline
                        rows={4}
                        value={textValue}
                        onChange={(e) => setTextValue(e.target.value)}
                        placeholder="Il tuo messaggio o nota..."
                    />
                </Grid>
            )}

            {/* Wi-Fi Input */}
            {contentType === 'wifi' && (
                <>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            label="SSID (Nome Rete)"
                            value={wifiDetails.ssid}
                            onChange={(e) => handleDetailChange('wifi', 'ssid', e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            label="Password"
                            value={wifiDetails.password}
                            onChange={(e) => handleDetailChange('wifi', 'password', e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <FormControl fullWidth>
                            <InputLabel>Crittografia</InputLabel>
                            <Select
                                value={wifiDetails.encryption}
                                label="Crittografia"
                                onChange={(e) => handleDetailChange('wifi', 'encryption', e.target.value)}
                            >
                                <MenuItem value="WPA">WPA/WPA2</MenuItem>
                                <MenuItem value="WEP">WEP</MenuItem>
                                <MenuItem value="nopass">Nessuna (Open)</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </>
            )}

            {/* vCard Input */}
            {contentType === 'vcard' && (
                <>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            label="Nome Completo"
                            value={vCardDetails.name}
                            onChange={(e) => handleDetailChange('vcard', 'name', e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            label="Telefono"
                            value={vCardDetails.phone}
                            onChange={(e) => handleDetailChange('vcard', 'phone', e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            value={vCardDetails.email}
                            onChange={(e) => handleDetailChange('vcard', 'email', e.target.value)}
                        />
                    </Grid>
                </>
            )}
        </Grid>
    );
}

export default ContentInputs;