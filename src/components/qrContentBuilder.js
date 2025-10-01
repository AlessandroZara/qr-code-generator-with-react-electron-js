/**
 * Costruisce la stringa di dati finali da codificare nel QR Code in base al tipo di contenuto.
 * @param {string} contentType - 'url', 'text', 'wifi', 'vcard'
 * @param {object} details - Dettagli del contenuto.
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
            const { 
                firstName, 
                lastName, 
                mobile, 
                office, 
                email,
                position,
                company
            } = details.vCardDetails;

            // Formato vCard 3.0
            let vCardString = 'BEGIN:VCARD\nVERSION:3.0\n';

            // 1. NOME E COGNOME (N e FN sono campi richiesti dal formato, ma qui opzionali se non compilati)
            const fullName = `${firstName} ${lastName}`.trim();
            if (lastName || firstName) {
                // N: Cognome;Nome;;;
                vCardString += `N:${lastName};${firstName};;;\n`; 
            }
            if (fullName) {
                 vCardString += `FN:${fullName}\n`; 
            }

            // 2. TELEFONI (TYPE=CELL, TYPE=WORK)
            if (mobile) {
                vCardString += `TEL;TYPE=CELL:${mobile}\n`;
            }
            if (office) {
                vCardString += `TEL;TYPE=WORK:${office}\n`;
            }

            // 3. EMAIL
            if (email) {
                vCardString += `EMAIL;TYPE=WORK:${email}\n`;
            }

            // 4. POSIZIONE (TITLE) e AZIENDA (ORG)
            if (position) {
                vCardString += `TITLE:${position}\n`;
            }
            if (company) {
                vCardString += `ORG:${company}\n`;
            }

            vCardString += 'END:VCARD';
            return vCardString;

        case 'url':
        default:
            if (!details.url || details.url === 'https://') {
                return '';
            }
            return details.url;
    }
};