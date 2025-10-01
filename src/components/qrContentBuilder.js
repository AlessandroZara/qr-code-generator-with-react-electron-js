/**
 * Costruisce la stringa di dati finali da codificare nel QR Code in base al tipo di contenuto.
 * @param {string} contentType - 'url', 'text', 'wifi', 'vcard'
 * @param {object} details - Dettagli del contenuto (url, textValue, wifiDetails, vCardDetails).
 * @returns {string} - La stringa di dati finale.
 */
export const buildQrContent = (contentType, details) => {
    switch (contentType) {
        case 'text':
            return details.textValue;

        case 'wifi':
            const { ssid, password, encryption } = details.wifiDetails;
            // Formato standard Wi-Fi: WIFI:T:<encryption>;S:<ssid>;P:<password>;;
            return `WIFI:T:${encryption};S:${ssid};P:${password};;`;

        case 'vcard':
            const { name, phone, email } = details.vCardDetails;
            // Formato standard vCard (solo i campi base)
            return (
                `BEGIN:VCARD\nVERSION:3.0\nN:${name}\nFN:${name}\nTEL:${phone}\nEMAIL:${email}\nEND:VCARD`
            );

        case 'url':
        default:
            // Se l'URL è solo 'https://' o vuoto, restituisce vuoto per la validazione
            if (!details.url || details.url === 'https://') {
                return '';
            }
            return details.url;
    }
};