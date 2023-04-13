/* eslint-disable jsx-a11y/alt-text */
import QRCode from "qrcode";
import { useState, useEffect } from "react";
import { Button } from "@mui/material";

function Qrcode() {
  const [url, setUrl] = useState("https://");
  const [qr, setQr] = useState("");
  const [error, setError] = useState("");

  const pattern = new RegExp(
    "(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?"
  );
  const check = pattern.test(url);

  const GenerateQRCode = () => {
    if (url === "https://") {
      setError("Inserisci un indirizzo url perfavore");
      setQr("");
      setUrl("https://");
    } else if (check === false) {
      setError("Inserisci un URL valido perfavore");
      setQr("");
      setUrl("https://");
    } else {
      QRCode.toDataURL(
        url,
        {
          width: 800,
          margin: 2,
          color: {
            // black: '#335383FF',
            // blue: '#EEEEEEFF'
          },
        },
        (err, url) => {
          if (err) return console.error(err);

          setQr(url);
        }
      );
    }
  };
  const ResetQRCode = () => {
    setQr("");
    setUrl("https://");
  };
  
  useEffect(() => {
    window.addEventListener('keydown', e => {
     if(e.key === 'Enter'){
      GenerateQRCode();
     }
    })
   })

  useEffect(() => {
    if (error) {
      setTimeout(function () {
        setError("");
      }, 2000);
    }
  });

  return (
    <div className="app">
      <h1>QR Generator</h1>
      <input
        type="text"
        placeholder="e.g. https://google.com"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <Button variant="contained" onClick={GenerateQRCode}>
        Generate
      </Button>
    
      {qr && (
        <>
          <Button
            style={{ marginLeft: "20px" }}
            variant="contained"
            onClick={ResetQRCode}
          >
            Reset
          </Button>
        </>
      )}
      {qr ? (
        <>
          <img src={qr} />
          <Button
            variant="contained"
            color="success"
            href={qr}
            download="qrcode.png"
          >
            Download
          </Button>
        </>
      ) : (
        <>
          <p style={{ fontSize: "20px" }}>{error}</p>
        </>
      )}
    </div>
  );
}

export default Qrcode;
