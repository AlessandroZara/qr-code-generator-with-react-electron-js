/* eslint-disable jsx-a11y/alt-text */
import QRCode from "qrcode";
import { useState, useEffect } from "react";
import { Button } from "@mui/material";

function Qrcode() {
  const [url, setUrl] = useState("https://");
  const [qr, setQr] = useState("");
  const [error, setError] = useState("");
  const [width, setWidth] = useState("");
  const [colorLight, setColorLight] = useState("");
  const [colorDark, setColorDark] = useState("");
  const pattern = new RegExp(
    "(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?"
  );
  const check = pattern.test(url);

  const GenerateQRCode = () => {
    if (url === "https://") {
      setError("Inserisci un indirizzo url perfavore");
      setQr("");
      setUrl("https://");
      setWidth("")
    } else if (check === false) {
      setError("Inserisci un URL valido perfavore");
      setQr("");
      setUrl("https://");
      setWidth("")
    } else if(width === ""){
      setError("Inserisci la grandezza in pixel");
      setQr("");
      setUrl("https://");
      setWidth("")
    } else if(width < 50 || width > 1000 ){
      setError("Inserisci un numero compreso tra 50 e 1000 nel campo grandezza");
      setQr("");
      setUrl("https://");
      setWidth("")
    } else if(width < 50 || width > 1000 ){
      setError("Inserisci un numero compreso tra 50 e 1000 nel campo grandezza");
      setQr("");
      setUrl("https://");
      setWidth("")
      
    }
    else if(colorLight && colorDark ==="" ){
      setError("Inserisci i colori per lo sfondo e per la grafica del qr code");
      setQr("");
      setUrl("https://");
      setWidth("")
    }
      else {
      QRCode.toDataURL(
        url,
        {
          width: parseInt(width),
          height: parseInt(width),
          margin: 2,
          color: {
            light:colorLight,
            dark:colorDark,
          }
        },
        (err, url) => {
          if (err) return console.error(err);

          setQr(url);
        }
      );
    }
    console.log(width)
  };
  const ResetQRCode = () => {
    setQr("");
    setUrl("https://");
    setWidth("");
    setColorDark("");
    setColorLight("");
  };

  useEffect(() => {
    window.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        GenerateQRCode();
        console.log("Generating QR Code");
      } else if (e.key === "Delete") {
        if (url) {
          ResetQRCode();
          console.log("Delete");
        }
      }
    });
  });

  useEffect(() => {
    if (error) {
      setTimeout(function () {
        setError("");
      }, 3000);
    }
  });

  return (
    <div className="app">
    <div className="link-generator-container">
      <h1>QR Generator</h1>
      <h3 className="link">Inserisci il link url</h3>
      <input
        type="text"
        placeholder="e.g. https://google.com"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <br />
      <br />
      <br />
      </div>
      <div className="dimesion-qrcode-width">
      <h3 className="link">Inserisci la grandezza del qr code (basta il numero)</h3>
      <input type="text" placeholder="Grandezza qrcode in pixel" value={width} onChange={(e)=>setWidth(e.target.value)}/>
      </div>
      <br />
      <br />
      <div className="qrcode-color">
      <h3 className="link">Inserisci il colore del qr code in formato EsaDecimale(Hex)</h3>
      <input type="text" placeholder="Colore Sfondo Qr code" value={colorLight} onChange={(e)=>setColorLight(e.target.value)}/>
      <br/>
      <br/>
      <input type="text" placeholder="Colore del qr code" value={colorDark} onChange={(e)=>setColorDark(e.target.value)}/>
      </div>
      <Button style={{marginTop:"20px"}}variant="contained" onClick={GenerateQRCode}>
        Generate
      </Button>

      {qr && (
        <>
          <Button
            style={{ marginLeft: "20px",marginTop: "20px" }}
            variant="contained"
            onClick={ResetQRCode}
          >
            Reset
          </Button>
        </>
      )}
      {qr ? (
        <>
          <img src={qr} style={{ width: `${width}px`, height:`${width}px` }} alt="QR Code" />
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
