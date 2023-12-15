document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const cardName = urlParams.get('name');

    if (cardName) {
        fetchCardInfo(cardName);
    } else {
        fetchRandomCardInfo();
    }
});

function fetchCardInfo(cardName) {
    const apiUrl = `https://db.ygoprodeck.com/api/v7/cardinfo.php?name=${encodeURIComponent(cardName)}`;

    fetch(apiUrl)
        .then(res => res.json())
        .then(data => {
            const card = data.data && data.data.length > 0 ? data.data[0] : null;

            if (card) {
                displayCardInfo(card);
            } else {
                displayErrorMessage('Nessuna informazione disponibile per questa carta.');
            }
        })
        .catch(error => {
            console.error(error);
            displayErrorMessage('Si è verificato un errore durante il recupero delle informazioni.');
        });
}


function fetchRandomCardInfo() {
    const apiUrl = 'https://db.ygoprodeck.com/api/v7/randomcard.php';

    fetch(apiUrl)
        .then(res => res.json())
        .then(data => {
            if (data) {
                displayCardInfo(data);
            } else {
                displayErrorMessage('Nessuna informazione disponibile per questa carta. random');
            }
        })
        .catch(error => {
            console.log(error);
            displayErrorMessage('Si è verificato un errore durante il recupero delle informazioni. random');
        });
}


function displayCardInfo(data) {
    const gameInfoContainer = document.getElementById('gameInfoContainer');

    const cardContainer = document.createElement('div');
    cardContainer.classList.add('set-info-display', 'd-flex', 'flex-md-row', 'flex-column');

    const textInfoContainer = document.createElement('div');
    textInfoContainer.classList.add('text-info', 'mb-3');

    const infoList = document.createElement('ul');

    infoList.innerHTML = `
    <h3>${data.name}</h3>
    <li><strong>Descrizione:</strong> ${data.desc}</li>
    <li><strong>ATK:</strong> ${data.atk}</li>
    <li><strong>DEF:</strong> ${data.def}</li>
    <li><strong>Livello:</strong> ${data.level}</li>
    <li><strong>Razza:</strong> ${data.race}</li>
    <li><strong>Attributo:</strong> ${data.attribute}</li>
    <li><strong>Archetipo:</strong> ${data.archetype}</li>`;

    textInfoContainer.appendChild(infoList);

    const cardImage = document.createElement('img');
    cardImage.src = data.card_images[0].image_url;
    cardImage.alt = data.name;
    cardImage.classList.add('card-image'); // Aggiungi la classe card-image

    cardContainer.appendChild(textInfoContainer);
    cardContainer.appendChild(cardImage);

    gameInfoContainer.appendChild(cardContainer);


    const gridcontainer = document.createElement('div');
    gridcontainer.classList.add('set-info', 'flex-md-row', 'flex-column');

    const cardSetsGrid = document.createElement('div');
    cardSetsGrid.classList.add('table-responsive');

    const cardSetsTable = document.createElement('table');
    cardSetsTable.classList.add('table', 'table-bordered', 'table-hover');

    const tableHeader = document.createElement('thead');
    tableHeader.innerHTML = `
    <tr>
        <th colspan="4">Dove trovarla</th>
    </tr>
    <tr>
        <th>Set Name</th>
        <th>Set Code</th>
        <th>Set Rarity</th>
        <th>Set Price</th>
    </tr>
`;

    cardSetsTable.appendChild(tableHeader);

    const tableBody = document.createElement('tbody');

    data.card_sets.forEach(set => {
        const tableRow = document.createElement('tr');

        tableRow.innerHTML = `
        <td>${set.set_name}</td>
        <td>${set.set_code}</td>
        <td>${set.set_rarity}</td>
        <td>${set.set_price}</td>
    `;

        tableBody.appendChild(tableRow);
    });

    cardSetsTable.appendChild(tableBody);
    cardSetsGrid.appendChild(cardSetsTable);
    gridcontainer.appendChild(cardSetsGrid);

    const cardPricesGrid = document.createElement('div');
    cardPricesGrid.classList.add('table-responsive');

    const cardPricesTable = document.createElement('table');
    cardPricesTable.classList.add('table', 'table-bordered', 'table-hover');

    const pricesTableHeader = document.createElement('thead');
    pricesTableHeader.innerHTML = `
    <tr>
        <th colspan="4">Prezzi</th>
    </tr>
    <tr>
        <th>Cardmarket Price</th>
        <th>TCGPlayer Price</th>
        <th>eBay Price</th>
        <th>Amazon Price</th>
    </tr>
`;

    cardPricesTable.appendChild(pricesTableHeader);

    const pricesTableBody = document.createElement('tbody');

    if (data.card_prices && data.card_prices.length > 0) {
        data.card_prices.forEach(price => {
            const priceTableRow = document.createElement('tr');

            priceTableRow.innerHTML = `
            <td>${price.cardmarket_price}</td>
            <td>${price.tcgplayer_price}</td>
            <td>${price.ebay_price}</td>
            <td>${price.amazon_price}</td>
        `;

            pricesTableBody.appendChild(priceTableRow);
        });
    } else {
        console.log('Nessun dato sui prezzi delle carte disponibile');
    }

    cardPricesTable.appendChild(pricesTableBody);
    cardPricesGrid.appendChild(cardPricesTable);
    gridcontainer.appendChild(cardPricesGrid);

    gameInfoContainer.appendChild(gridcontainer);
}

function displayErrorMessage(message) {
    const gameInfoContainer = document.getElementById('gameInfoContainer');
    const errorMessageElement = document.createElement('p');
    errorMessageElement.textContent = message;
    errorMessageElement.classList.add('error-message');
    gameInfoContainer.appendChild(errorMessageElement);
}
