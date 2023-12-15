// tipocarta.js

document.addEventListener('DOMContentLoaded', function() {
    // Recupera il valore del parametro "letter" dall'URL
    const urlParams = new URLSearchParams(window.location.search);
    const selectedLetter = urlParams.get('letter') || 'TUTTE';

    // Mostra gli archetipi corrispondenti alla lettera selezionata
    filterArchetypesByLetter(selectedLetter);

    // Aggiungi un gestore di eventi per ciascun link nel menu a discesa
    document.querySelectorAll('.dropdown-item').forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const letter = this.getAttribute('data-letter').trim();
            // Naviga verso la stessa pagina con il parametro "letter" nell'URL
            window.location.href = `tipoCarta.html?letter=${letter}`;
        });
    });
});

function filterArchetypesByLetter(letter) {
    const inputLetters = letter.split('-').map(letter => letter.trim().toUpperCase());

    fetch('https://db.ygoprodeck.com/api/v7/archetypes.php')
        .then(res => res.json())
        .then(data => {
            const gameInfoContainer = document.getElementById('gameInfoContainer');
            gameInfoContainer.classList.add('dimension');

            gameInfoContainer.innerHTML = '';

            if (data && data.length > 0) {
                if (inputLetters.includes('TUTTE')) {
                    // Se l'input è "TUTTE", mostra tutti gli archetipi
                    data.forEach(archetype => {
                        createArchetypeButton(archetype.archetype_name);
                    });
                } else {
                    // Altrimenti, filtra gli archetipi per ogni lettera specificata
                    inputLetters.forEach(inputLetter => {
                        const filteredArchetypes = data.filter(archetype => {
                            const archetypeName = archetype.archetype_name.toUpperCase();
                            return archetypeName.startsWith(inputLetter);
                        });

                        if (filteredArchetypes.length > 0) {
                            createHeader(`Archetipi che iniziano con: ${inputLetter}`);
                            filteredArchetypes.forEach(archetype => {
                                createArchetypeButton(archetype.archetype_name);
                            });
                        } else {
                            createMessage(`Nessun archetipo disponibile con questa lettera: ${inputLetter}`);
                        }
                    });
                }
            } else {
                createMessage('Nessun dato sugli archetipi disponibile.');
            }
        })
        .catch(error => console.log(error));
}

function createArchetypeButton(archetypeName) {
    const gameInfoContainer = document.getElementById('gameInfoContainer');

    const button = document.createElement('button');
    button.textContent = archetypeName;
    button.className = 'archetype-button';

    // Aggiungi un gestore di eventi al bottone
    button.addEventListener('click', function() {
        // Naviga verso la pagina "archetype" con il parametro "archetypeName" nella query string
        window.location.href = `archetype.html?archetype=${encodeURIComponent(archetypeName)}`;
    });

    gameInfoContainer.appendChild(button);
}

function createHeader(text) {
    const gameInfoContainer = document.getElementById('gameInfoContainer');
    const header = document.createElement('h3');
    header.textContent = text;
    gameInfoContainer.appendChild(header);
}

function createMessage(text) {
    const gameInfoContainer = document.getElementById('gameInfoContainer');
    const message = document.createElement('p');
    message.textContent = text;
    gameInfoContainer.appendChild(message);
}


