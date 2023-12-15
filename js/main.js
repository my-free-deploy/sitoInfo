fetch('https://db.ygoprodeck.com/api/v7/cardsets.php')
    .then(res => {
        return res.json();
    })
    .then(data => {
        // Seleziona l'elemento del DOM in cui desideri visualizzare gli elementi
        const gameInfoContainer = document.getElementById('gameInfoContainer');

        // Itera per ottenere 10 elementi casuali
        for (let i = 0; i < 10; i++) {
            // Ottieni un indice casuale nell'intervallo [0, data.length)
            const randomIndex = Math.floor(Math.random() * data.length);

            // Prendi l'elemento corrispondente all'indice casuale
            const randomElement = data[randomIndex];

            // Creazione di un elemento <div> per ogni set
            const setDiv = document.createElement('div');
            setDiv.className = 'set-info main-div';

            // Creazione di un elemento <img> per l'immagine e aggiunta al <div>
            const img = document.createElement('img');
            img.src = randomElement.set_image;
            img.alt = randomElement.set_name;
            setDiv.appendChild(img);

            // Creazione di un div per i testi
            const textDiv = document.createElement('div');
            textDiv.className = 'text-info';

            // Creazione di elementi <p> per ogni campo e aggiunta al div dei testi
            const namePara = document.createElement('p');
            namePara.textContent = `Name: ${randomElement.set_name}`;
            textDiv.appendChild(namePara);

            const codePara = document.createElement('p');
            codePara.textContent = `Code: ${randomElement.set_code}`;
            textDiv.appendChild(codePara);

            const cardsPara = document.createElement('p');
            cardsPara.textContent = `Number of Cards: ${randomElement.num_of_cards}`;
            textDiv.appendChild(cardsPara);

            const datePara = document.createElement('p');
            datePara.textContent = `TCG Date: ${randomElement.tcg_date}`;
            textDiv.appendChild(datePara);

            // Aggiungi il div dei testi all'elemento <div> principale
            setDiv.appendChild(textDiv);

            // Aggiungi l'elemento <div> creato al container nel DOM
            gameInfoContainer.appendChild(setDiv);
        }
    })
    .catch(error => console.log(error));
