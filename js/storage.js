//#region Export/Import Collection
function exportCollection() {
    fetch('data/pokemons.json')
        .then(response => response.json())
        .then(data => {
            const exportData = {
                exportDate: new Date().toISOString(),
                collectionStats: {
                    totalCards: 0,
                    obtainedCards: obtainedCards.size,
                    series: []
                },
                collection: []
            };

            data.forEach(series => {
                const seriesStats = {
                    name: series.seriesName,
                    codename: series.codename,
                    totalCards: series.cards.length,
                    obtainedCards: series.cards.filter(card =>
                        obtainedCards.has(`${series.codename}-${card.number}`)
                    ).length
                };
                exportData.collectionStats.series.push(seriesStats);
                exportData.collectionStats.totalCards += series.cards.length;

                series.cards.forEach(card => {
                    const cardId = `${series.codename}-${card.number}`;
                    exportData.collection.push({
                        series: series.series,
                        codename: series.codename,
                        number: card.number,
                        name: card.name,
                        type: card.type,
                        rarity: card.rarity,
                        subseries: card.subseries || null,
                        obtained: obtainedCards.has(cardId)
                    });
                });
            });

            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `pokemon-tcg-collection-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
}

document.getElementById('exportButton').addEventListener('click', exportCollection);

function importCollection(data) {
    try {
        // Clear existing obtained cards
        obtainedCards.clear();

        // Add cards from import data
        data.collection.forEach(card => {
            if (card.obtained) {
                const cardId = `${card.codename}-${card.number}`;
                obtainedCards.add(cardId);
            }
        });

        // Save to localStorage
        localStorage.setItem('obtainedCards', JSON.stringify([...obtainedCards]));

        // Update UI
        document.querySelectorAll('.card').forEach(cardEl => {
            const cardId = `${cardEl.getAttribute('data-codename')}-${cardEl.getAttribute('data-number')}`;
            cardEl.classList.toggle('obtained', obtainedCards.has(cardId));
            cardEl.setAttribute('aria-pressed', obtainedCards.has(cardId));
        });

        // Update all counters
        document.querySelectorAll('.counter').forEach(counter => {
            const setId = counter.parentElement.getAttribute('data-set');
            const cardSet = data.collectionStats.series.find(s => s.codename === setId);
            if (cardSet) {
                counter.textContent = `(${cardSet.obtainedCards}/${cardSet.totalCards})`;
            }
        });

        // TODO: Update set obtained counts

        alert('Collection imported successfully!');
    } catch (error) {
        console.error('Error importing collection:', error);
        alert('Error importing collection. Please check the file format.');
    }
}

// Add drag and drop handlers
const dropZone = document.getElementById('dropZone');

document.addEventListener('dragenter', e => {
    e.preventDefault();
    dropZone.classList.add('active');
});

dropZone.addEventListener('dragleave', e => {
    e.preventDefault();
    dropZone.classList.remove('active');
});

dropZone.addEventListener('dragover', e => {
    e.preventDefault();
});

dropZone.addEventListener('drop', e => {
    e.preventDefault();
    dropZone.classList.remove('active');

    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/json') {
        const reader = new FileReader();
        reader.onload = e => {
            try {
                const data = JSON.parse(e.target.result);
                importCollection(data);
            } catch (error) {
                console.error('Error parsing JSON:', error);
                alert('Error reading file. Please make sure it\'s a valid collection export.');
            }
        };
        reader.readAsText(file);
    } else {
        alert('Please drop a valid collection export file (JSON)');
    }
});

// Update drag event handlers to ignore internal drags
document.addEventListener('dragstart', e => {
    // Prevent drags from within the app
    if (window.getSelection().toString() || e.target.closest('[data-internal="true"]')) {
        e.dataTransfer.effectAllowed = 'none';
        e.preventDefault();
    }
});

// Add load button functionality
document.getElementById('loadButton').addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = e => {
        const file = e.target.files[0];
        if (file && file.type === 'application/json') {
            const reader = new FileReader();
            reader.onload = e => {
                try {
                    const data = JSON.parse(e.target.result);
                    importCollection(data);
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                    alert('Error reading file. Please make sure it\'s a valid collection export.');
                }
            };
            reader.readAsText(file);
        }
    };
    input.click();
});

//#endregion

