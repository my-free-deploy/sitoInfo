// archetype.js

document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const selectedArchetype = urlParams.get('archetype');

    if (selectedArchetype) {
        fetchArchetypeInfo(selectedArchetype);
    } else {
        displayErrorMessage('Nessun archetipo selezionato.');
    }
});

function fetchArchetypeInfo(archetype) {
    const apiUrl = `https://db.ygoprodeck.com/api/v7/cardinfo.php?archetype=${encodeURIComponent(archetype)}`;

    fetch(apiUrl)
        .then(res => res.json())
        .then(data => {
            if (data && data.data && data.data.length > 0) {
                displayArchetypeInfo(data.data);
            } else {
                displayErrorMessage('Nessuna informazione disponibile per questo archetipo.');
            }
        })
        .catch(error => {
            console.log(error);
            displayErrorMessage('Si è verificato un errore durante il recupero delle informazioni.');
        });
}

function displayArchetypeInfo(archetypeData) {
    const archetypeDetailsContainer = document.getElementById('archetypeDetails');

    archetypeData.forEach(card => {
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
        archetypeDetailsContainer.appendChild(cardElement);
    });
}

function displayErrorMessage(message) {
    const archetypeDetailsContainer = document.getElementById('archetypeDetails');
    const errorMessageElement = document.createElement('p');
    errorMessageElement.textContent = message;
    errorMessageElement.classList.add('error-message');
    archetypeDetailsContainer.appendChild(errorMessageElement);
}
