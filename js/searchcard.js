let currentPage = 1;
let resultString = '';
const cardsPerPage = 10;

document.getElementById('searchButton').addEventListener('click', function () {
    const searchBarValue = document.getElementById('searchInput').value;
    const raceSelectorValue = document.getElementById('raceSelector').value;
    const typeSelectorValue = document.getElementById('typeSelector').value;

    resultString = 'https://db.ygoprodeck.com/api/v7/cardinfo.php?';

    if (searchBarValue.trim() !== '') {
        resultString += 'fname=' + searchBarValue + "&";
    }
    if (raceSelectorValue.trim() !== '') {
        resultString += 'race=' + raceSelectorValue + "&";
    }
    if (typeSelectorValue.trim() !== '') {
        resultString += 'type=' + typeSelectorValue + "&";
    }

    console.log(resultString);
    fetchValueInfo(resultString, currentPage);

    document.getElementById('raceSelector').value = '';
    document.getElementById('typeSelector').value = '';
    document.getElementById('searchInput').value = '';
});

function fetchValueInfo(searchvalue, page) {
    const startIndex = (page - 1) * cardsPerPage;
    const endIndex = startIndex + cardsPerPage;

    fetch(searchvalue)
        .then(res => res.json())
        .then(data => {
            if (data && data.data && data.data.length > 0) {
                const currentData = data.data.slice(startIndex, endIndex);
                displayValueInfo(currentData);
                displayPageButtons(data.data, page);

                // Scrolla verso l'alto della pagina
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                displayErrorMessage('Nessuna informazione disponibile per questo archetipo.');
            }
        })
        .catch(error => {
            console.error(error);
            displayErrorMessage('Si è verificato un errore durante il recupero delle informazioni.');
        });
}

function displayValueInfo(archetypeData) {
    const ValueDetailsContainer = document.getElementById('ViewDetails');
    ValueDetailsContainer.innerHTML = '';

    archetypeData.forEach(card => {
        const cardElement = createCardElement(card);
        ValueDetailsContainer.appendChild(cardElement);
    });
}

function createCardElement(card) {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card-details', 'row');

    const cardImageElement = document.createElement('img');
    cardImageElement.src = card.card_images[0].image_url;
    cardImageElement.alt = card.name;
    cardImageElement.classList.add('card-image', 'col-md-3', 'mx-auto', 'text-center');

    cardImageElement.addEventListener('click', function () {
        window.location.href = `displaycard.html?name=${card.name}`;
    });

    cardElement.appendChild(cardImageElement);

    const cardDetailsElement = document.createElement('div');
    cardDetailsElement.classList.add('card-details-right', 'col-md-8');

    const cardNameElement = document.createElement('h2');
    cardNameElement.textContent = card.name;
    cardDetailsElement.appendChild(cardNameElement);

    const cardTypeElement = document.createElement('p');
    cardTypeElement.textContent = `Tipo: ${card.type}`;
    cardDetailsElement.appendChild(cardTypeElement);

    const cardDescElement = document.createElement('p');
    cardDescElement.textContent = `Descrizione: ${card.desc}`;
    cardDetailsElement.appendChild(cardDescElement);

    const ygoprodeckLinkElement = document.createElement('p');
    ygoprodeckLinkElement.innerHTML = `<a href="${card.ygoprodeck_url}" target="_blank">Dettagli su YGOProDeck</a>`;
    cardDetailsElement.appendChild(ygoprodeckLinkElement);

    const cardSetsElement = document.createElement('div');
    cardSetsElement.classList.add('card-sets');
    cardSetsElement.innerHTML = '<h3>Set:</h3>';

    if (card.card_sets && card.card_sets.length > 0) {
        card.card_sets.forEach(set => {
            const setElement = document.createElement('p');
            setElement.textContent = `${set.set_name} - ${set.set_rarity}`;
            cardSetsElement.appendChild(setElement);
        });
    } else {
        const noSetsElement = document.createElement('p');
        noSetsElement.textContent = 'Nessun set disponibile.';
        cardSetsElement.appendChild(noSetsElement);
    }

    cardDetailsElement.appendChild(cardSetsElement);
    cardElement.appendChild(cardDetailsElement);
    return cardElement;
}


function displayPageButtons(allData, page) {
    const totalPages = Math.ceil(allData.length / cardsPerPage);
    const pageButtonsContainer = document.getElementById('PageButtonsContainer');

    if (!pageButtonsContainer) {
        console.error('Elemento PageButtonsContainer non trovato.');
        return;
    }

    console.log('Total Pages:', totalPages);

    pageButtonsContainer.innerHTML = '';

    if (totalPages > 1) {
        console.log('Creating buttons...');

        const prevButton = createPageButton('❮', () => {
            if (currentPage > 1) {
                currentPage--;
                fetchValueInfo(resultString, currentPage);
            }
        });

        const nextButton = createPageButton('❯', () => {
            if (currentPage < totalPages) {
                currentPage++;
                fetchValueInfo(resultString, currentPage);
            }
        });

        const buttonsWrapper = document.createElement('div');
        buttonsWrapper.classList.add('text-center');

        buttonsWrapper.appendChild(prevButton);

        // Always show the first page button
        const firstPageButton = createPageButton(1, () => {
            currentPage = 1;
            fetchValueInfo(resultString, currentPage);
        });
        buttonsWrapper.appendChild(firstPageButton);

        // Show up to 7 numbered page buttons
        const startPage = Math.max(1, page - 3);
        const endPage = Math.min(totalPages, startPage + 6);

        for (let i = startPage; i <= endPage; i++) {
            const pageButton = createPageButton(i, () => {
                currentPage = i;
                fetchValueInfo(resultString, currentPage);
            });

            if (i === page) {
                pageButton.classList.add('btn-primary'); // Highlight the current page
            }

            buttonsWrapper.appendChild(pageButton);
        }

        // Always show the last page button
        const lastPageButton = createPageButton(totalPages, () => {
            currentPage = totalPages;
            fetchValueInfo(resultString, currentPage);
        });
        
        buttonsWrapper.appendChild(lastPageButton);
        buttonsWrapper.appendChild(nextButton);

        pageButtonsContainer.appendChild(buttonsWrapper);
    } else {
        console.log('No buttons to create.');
    }
}



function createPageButton(text, onClickHandler) {
    const button = document.createElement('button');
    button.textContent = text;
    button.classList.add('btn', 'btn-outline-secondary', 'mx-2'); // Add Bootstrap button classes
    button.addEventListener('click', onClickHandler);
    return button;
}


function displayErrorMessage(message) {
    const ValueDetailsContainer = document.getElementById('ViewDetails');
    const errorMessageElement = document.createElement('p');
    errorMessageElement.textContent = message;
    errorMessageElement.classList.add('error-message');
    ValueDetailsContainer.appendChild(errorMessageElement);
}