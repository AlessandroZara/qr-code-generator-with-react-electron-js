import { TextField } from "@mui/material";

function UrlInput({ url, setUrl }) {
  return (
    <TextField
      fullWidth
      label="Inserisci l'URL"
      value={url}
      onChange={(e) => setUrl(e.target.value)}
      placeholder="e.g. https://google.com"
      // Stili inline che non possono essere sovrascritti
      style={{
        overflow: 'visible',
        whiteSpace: 'nowrap',
        textOverflow: 'clip',
      }}
      InputProps={{
        style: {
          overflow: 'visible',
        },
      }}
    />
  );
}

export default UrlInput;