 // Funzione per filtrare gli elementi in base all'anno e al nome
 function filterByYear() {
    const selectedYear = document.getElementById('selectedYear').value;
    const searchInput = document.getElementById('searchInput').value.toLowerCase(); // Converte in minuscolo

    // Seleziona l'elemento del DOM in cui desideri visualizzare gli elementi
    const gameInfoContainer = document.getElementById('setInfoContainer');

    // Rimuovi tutti gli elementi esistenti nel container
    gameInfoContainer.innerHTML = '';

    fetch('https://db.ygoprodeck.com/api/v7/cardsets.php')
        .then(res => res.json())
        .then(data => {
            // Itera sugli ultimi 10 elementi e crea il markup
            for (let i = 0; i < data.length; i++) {
                const setName = data[i].set_name.toLowerCase();

                // Se l'utente ha selezionato "Tutti" o l'anno corrisponde e il nome contiene la parola cercata
                if ((selectedYear === 'all' || new Date(data[i].tcg_date).getFullYear() == selectedYear) &&
                    (setName.includes(searchInput) || searchInput === '')) {
                    // Creazione di un elemento <div> per ogni set con classe Bootstrap per 2 colonne
                    const setDiv = document.createElement('div');
                    setDiv.className = 'set-info col-md-6'; // Rimuovi la classe mb-4

                    // Creazione di un elemento <img> per l'immagine e applicazione degli stili
                    const img = document.createElement('img');
                    img.src = data[i].set_image;
                    img.alt = data[i].set_name;
                    img.style.maxWidth = '100%'; // Stile per la larghezza massima
                    img.style.height = 'auto';   // Stile per mantenere l'aspetto originale
                    setDiv.appendChild(img);

                    // Creazione di un div per i testi
                    const textDiv = document.createElement('div');
                    textDiv.className = 'text-info';

                    // Creazione di elementi <p> per ogni campo e aggiunta al div dei testi
                    const namePara = document.createElement('p');
                    namePara.textContent = `Name: ${data[i].set_name}`;
                    textDiv.appendChild(namePara);

                    const codePara = document.createElement('p');
                    codePara.textContent = `Code: ${data[i].set_code}`;
                    textDiv.appendChild(codePara);

                    const cardsPara = document.createElement('p');
                    cardsPara.textContent = `Number of Cards: ${data[i].num_of_cards}`;
                    textDiv.appendChild(cardsPara);

                    const datePara = document.createElement('p');
                    datePara.textContent = `TCG Date: ${data[i].tcg_date}`;
                    textDiv.appendChild(datePara);

                    // Aggiungi il div dei testi all'elemento <div> principale
                    setDiv.appendChild(textDiv);

                    // Aggiungi l'elemento <div> creato al container nel DOM
                    gameInfoContainer.appendChild(setDiv);
                }
            }
        })
        .catch(error => console.log(error));
}

// Chiama filterByYear all'avvio della pagina
filterByYear();