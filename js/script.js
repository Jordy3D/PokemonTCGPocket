
// █▀▀ █   ▄▀█ █▀ █▀ █▀▀ █▀ 
// █▄▄ █▄▄ █▀█ ▄█ ▄█ ██▄ ▄█ 

//#region Classes
class Series {
    constructor(seriesName, codename, normalCardCount, cards) {
        this.seriesName = seriesName;
        this.seriesNameHyphen = seriesName.replace(' ', '-');
        this.codename = codename;
        this.normalCardCount = normalCardCount;
        this.cards = cards;
    }

    getObtainedCards() {
        return this.cards.filter(card => card.obtained);
    }

    getUnobtainedCards() {
        return this.cards.filter(card => !card.obtained);
    }

    generateSeriesTitleHTML() {
        return `
            <img src="images/logos/${this.seriesNameHyphen}.webp" alt="${this.seriesName} series" class="series-logo" />
            <h2>${this.seriesName} (${this.codename})</h2>
            <span class="series-count">(${this.normalCardCount})</span>
        `;
    }
}

class Card {
    constructor(number, name, type, rarity, subseries, generation, seriesName) {
        this.number = number;
        this.name = name;
        this.type = type;
        this.rarity = rarity;
        this.subseries = subseries;
        this.obtained = false;
        this.generation = generation
        this.seriesName = seriesName;
        this.imageName = this.generateImageName();
    }

    generateImageName() {
        let imageName = 'images/cards/';
        imageName += `${this.seriesName}/`;
        imageName += `${this.number}-${this.name}-${this.seriesName}.webp`;
        imageName = imageName.replace(/ /g, '-').replace(/'/g, '');
        return imageName;
    }

    generateCardDetailHTML() {
        let rarity = null;
        if (this.rarity != '' || this.rarity != null) {
            rarity = this.rarity.toLowerCase();
        }
        let type = this.type;
        if (type == "Trainer")
            type = '';

        if (type != '' || type != null) {
            type = type.toLowerCase();
        }

        return `
            <div class="card-details">
                <h3>${this.name}</h3>
                <p>#${this.number}</p>
                ${this.subseries ? `<span class="subseries-badge">${this.subseries}</span>` : ''}
                <div class="card-badges">
                ${type ? `<span class="type-badge ${type}"><img src="images/type/${type}.webp" alt="${type} type" /></span>` : ''}
                ${rarity ? `<span class="rarity-badge ${rarity}"><img src="images/rarity/${rarity}.webp" alt="${rarity} rarity" /></span>` : ''}
                </div>
            </div>
            <div class="card-image" style='background-image: url(${this.imageName})'>
                <img src="${this.imageName}" alt="${this.name} card" />
            </div>
        `;
    }
}
//#endregion

// █   █▀█ ▄▀█ █▀▄ 
// █▄▄ █▄█ █▀█ █▄▀ 

//#region Load Cards
const obtainedCards = new Set(JSON.parse(localStorage.getItem('obtainedCards') || '[]'));
var sets = [];

async function loadCards() {
    try {
        const response = await fetch('data/pokemons.json');
        const data = await response.json();

        data.forEach(series => {

            var cards = [];
            series.cards.forEach(card => {
                let newCard = new Card(card.number, card.name, card.type, card.rarity, card.subseries, card.generation, series.seriesName);
                cards.push(newCard);
            });

            var newSeries = new Series(series.seriesName, series.codename, series.normalCardCount, cards);

            sets.push(newSeries);
        });

        displayCards();
    } catch (error) {
        console.error('Error loading cards:', error);
    }
}

function displayCards() {
    const container = document.getElementById('cardContainer');

    for (var i = 0; i < sets.length; i++) {
        createSeries(sets[i]);
    }

    function createSeries(series) {
        const titleEl = document.createElement('div');
        titleEl.className = 'series-title';
        titleEl.innerHTML = series.generateSeriesTitleHTML();

        const counterEl = titleEl.querySelector('.series-count');
        updateCounter(counterEl, series);

        titleEl.appendChild(counterEl);
        container.appendChild(titleEl);

        const cardSetEl = document.createElement('div');
        cardSetEl.className = 'card-set';
        cardSetEl.id = series.codename;
        cardSetEl.classList.toggle('active');
        container.appendChild(cardSetEl);

        titleEl.addEventListener('click', () => {
            cardSetEl.classList.toggle('active');
        });

        series.cards.forEach(card => {
            const cardEl = document.createElement('div');
            cardEl.className = 'card';
            if (obtainedCards.has(`${series.codename}-${card.number}`)) {
                cardEl.classList.add('obtained');
            }

            cardEl.innerHTML = card.generateCardDetailHTML();

            cardEl.addEventListener('click', () => {
                const cardId = `${series.codename}-${card.number}`;
                if (obtainedCards.has(cardId)) {
                    obtainedCards.delete(cardId);
                    cardEl.classList.remove('obtained');
                } else {
                    obtainedCards.add(cardId);
                    cardEl.classList.add('obtained');
                }
                localStorage.setItem('obtainedCards', JSON.stringify([...obtainedCards]));
                updateCounter(counterEl, series);
            });

            // add data attributes to the card element
            cardEl.setAttribute('data-series', series.seriesName);
            cardEl.setAttribute('data-codename', series.codename);
            cardEl.setAttribute('data-number', card.number);
            cardEl.setAttribute('data-name', card.name);
            cardEl.setAttribute('data-subseries', card.subseries);
            cardEl.setAttribute('data-rarity', card.rarity);
            cardEl.setAttribute('data-type', card.type);
            cardEl.setAttribute('data-generation', card.generation || 'none');

            // add accessibility attributes
            cardEl.setAttribute('role', 'button');
            cardEl.setAttribute('tabindex', '0');
            cardEl.setAttribute('aria-label', `Card #${card.number} - ${card.name}`);
            cardEl.setAttribute('aria-pressed', obtainedCards.has(`${series.codename}-${card.number}`));
            // cardEl.title = `Card #${card.number} - ${card.name}`;

            cardSetEl.appendChild(cardEl);
        });

        // Add data-set attributes
        titleEl.setAttribute('data-set', series.codename);
        cardSetEl.setAttribute('data-series', series.seriesName);
        cardSetEl.setAttribute('data-codename', series.codename);
    }
}

function updateCounter(counterEl, series) {
    const obtainedCount = series.cards.filter(card => obtainedCards.has(`${series.codename}-${card.number}`)).length;
    counterEl.textContent = `(${obtainedCount}/${series.normalCardCount})`;
}
//#endregion

// █▀ █▀▀ ▄▀█ █▀█ █▀▀ █ █ 
// ▄█ ██▄ █▀█ █▀▄ █▄▄ █▀█ 

//#region Search Filter

function isGenerationTerm(term) {
    return /^(g|gen)\d+$/.test(term);
}

function filterCards(searchTerms) {
    let foundCards = 0;
    let foundObtainedCards = 0;

    const filters = {
        name: document.getElementById('filterName').checked,
        number: document.getElementById('filterNumber').checked,
        series: document.getElementById('filterSeries').checked,
        subseries: document.getElementById('filterSubseries').checked,
        status: document.getElementById('filterStatus').checked,
        rarity: document.getElementById('filterRarity').checked,
        type: document.getElementById('filterType').checked,
        generation: document.getElementById('filterGeneration').checked,

        raritySelect: document.getElementById('filterRaritySelect').value,
        raritySelectInverted: document.getElementById('invertRarity').checked,
        typeSelect: document.getElementById('filterTypeSelect').value,
        typeSelectInverted: document.getElementById('invertType').checked,
        generationSelect: document.getElementById('filterGenerationSelect').value,
        generationSelectInverted: document.getElementById('invertGeneration').checked
    };

    const allCards = document.querySelectorAll('.card');
    const allSets = document.querySelectorAll('.card-set');
    const allTitles = document.querySelectorAll('.series-title');

    var terms = [];

    // Handle empty search with rarity filter
    if (!searchTerms || !searchTerms.trim()) {
        if (filters.raritySelect === 'all' && filters.typeSelect === 'all' && filters.generationSelect === 'all') {
            allCards.forEach(card => card.style.display = '');
            allSets.forEach(set => set.classList.add('active'));
            allTitles.forEach(title => title.style.display = '');

            document.getElementById('searchCount').textContent = ``;
            return;
        }
        terms = [];  // Empty terms will make the search only use rarity filter
    } else {
        terms = searchTerms.toLowerCase().split(';')
            .map(term => term.trim())
            .filter(term => term !== '')
            .map(term => ({
                isNegated: term.startsWith('!'),
                value: term.startsWith('!') ? term.slice(1) : term
            }));
    }

    allCards.forEach(card => {
        const cardData = {
            name: card.getAttribute('data-name').toLowerCase(),
            number: card.getAttribute('data-number').toLowerCase(),
            subseries: card.getAttribute('data-subseries').toLowerCase(),
            isCaught: card.classList.contains('obtained'),
            series: card.getAttribute('data-series').toLowerCase(),
            codename: card.getAttribute('data-codename').toLowerCase(),
            rarity: card.getAttribute('data-rarity'),
            type: card.getAttribute('data-type').toLowerCase(),
            generation: card.getAttribute('data-generation').toLowerCase()
        };

        let visible;
        if (terms.length === 0) {
            var rarityMatch = filters.raritySelect === 'all' || cardData.rarity.includes(filters.raritySelect);
            if (filters.raritySelectInverted) rarityMatch = !rarityMatch;

            var typeMatch = filters.typeSelect === 'all' || cardData.type.includes(filters.typeSelect);
            if (filters.typeSelectInverted) typeMatch = !typeMatch;

            var generationMatch = filters.generationSelect === 'all' || cardData.generation.includes(filters.generationSelect);
            if (filters.generationSelectInverted) generationMatch = !generationMatch;

            visible = rarityMatch && typeMatch && generationMatch;
        } else {
            visible = terms.every(term => {
                if (filters.status && term.value === 'caught')
                    return term.isNegated ? !cardData.isCaught : cardData.isCaught;
                if (filters.status && term.value === 'uncaught')
                    return term.isNegated ? cardData.isCaught : !cardData.isCaught;

                // Check if the term matches any searchable field
                const isGenSearch = isGenerationTerm(term.value);
                const termMatch = (
                    (filters.name && cardData.name.includes(term.value)) ||
                    (filters.number && cardData.number.includes(term.value)) ||
                    (filters.subseries && cardData.subseries.includes(term.value)) ||
                    (filters.series && (cardData.series.includes(term.value) || cardData.codename.includes(term.value))) ||
                    (filters.rarity && cardData.rarity.includes(term.value)) ||
                    (filters.type && cardData.type.includes(term.value)) ||
                    (filters.generation && isGenSearch && cardData.generation.includes(term.value.replace('gen', '').replace('g', '')))
                );

                // Apply filter selections only if they're not 'all'
                const rarityFilterMatch = filters.raritySelect === 'all' ||
                    (filters.raritySelectInverted ? !cardData.rarity.includes(filters.raritySelect) : cardData.rarity.includes(filters.raritySelect));

                const typeFilterMatch = filters.typeSelect === 'all' ||
                    (filters.typeSelectInverted ? !cardData.type.includes(filters.typeSelect) : cardData.type.includes(filters.typeSelect));

                const generationFilterMatch = filters.generationSelect === 'all' ||
                    (filters.generationSelectInverted ? !cardData.generation.includes(filters.generationSelect) : cardData.generation.includes(filters.generationSelect));

                return (term.isNegated ? !termMatch : termMatch) &&
                    rarityFilterMatch && typeFilterMatch && generationFilterMatch;
            });
        }

        if (visible) {
            foundCards++;
            if (card.classList.contains('obtained'))
                foundObtainedCards++;
        }

        card.style.display = visible ? '' : 'none';
    });

    // update the #searchCount span with the number of found cards
    document.getElementById('searchCount').textContent = `Found ${foundCards} cards (${foundObtainedCards} obtained)`;

    // Show/hide series titles based on whether they have visible cards
    allSets.forEach(set => {
        const hasVisibleCards = Array.from(set.querySelectorAll('.card'))
            .some(card => card.style.display !== 'none');
        set.classList.toggle('active', hasVisibleCards);
        const title = document.querySelector(`[data-set="${set.id}"]`);
        if (title) {
            title.style.display = hasVisibleCards ? '' : 'none';
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.getElementById('searchBar');
    const filterInputs = document.querySelectorAll('.search-filters input');
    const filterSelects = document.querySelectorAll('.search-filters select');

    const clearSearch = document.getElementById('clearSearch');
    clearSearch.addEventListener('click', () => {
        searchBar.value = '';
        filterCards('');
    });

    searchBar.addEventListener('input', (e) => filterCards(e.target.value));
    filterInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            e.target.parentElement.classList.toggle('active');
            filterCards(searchBar.value);
        });
    });

    filterSelects.forEach(select => {
        select.addEventListener('change', () => filterCards(searchBar.value));
    });
});
//#endregion

// ▀█▀ █▀█ █▀▀ █▀▀ █   █▀▀ █▀ 
//  █  █▄█ █▄█ █▄█ █▄▄ ██▄ ▄█ 

//#region Toggles

//#region Theme Toggle
function toggleTheme(isDark) {
    document.body.classList.toggle('dark-mode', isDark);
    document.querySelector('.header').classList.toggle('dark-mode', isDark);
    document.querySelectorAll('.card').forEach(card => card.classList.toggle('dark-mode', isDark));
    document.querySelectorAll('.series-title').forEach(title => title.classList.toggle('dark-mode', isDark));
    document.getElementById('themeToggle').classList.toggle('dark-mode', isDark);
    const themeIcon = document.getElementById('themeIcon');
    themeIcon.textContent = isDark ? '🌜' : '🌞';
    localStorage.setItem('darkMode', isDark);
}

// Load saved theme preference
const savedTheme = localStorage.getItem('darkMode');
if (savedTheme === 'true') {
    toggleTheme(true);
}

document.getElementById('themeToggle').addEventListener('click', () => {
    const isDark = !document.body.classList.contains('dark-mode');
    toggleTheme(isDark);
});
//#endregion

//#region View Toggle
function toggleView(isBinder) {
    document.body.classList.toggle('binder', isBinder);
    document.getElementById('viewToggle').textContent = isBinder ? '📖' : '🗃️';
    localStorage.setItem('binderView', isBinder);
}

// Load saved view preference
const savedView = localStorage.getItem('binderView');
if (savedView === 'true') {
    toggleView(true);
}

document.getElementById('viewToggle').addEventListener('click', () => {
    const isBinder = !document.body.classList.contains('binder');
    toggleView(isBinder);
});
//#endregion

//#endregion

// █▀▄ ▄▀█ ▀█▀ ▄▀█ 
// █▄▀ █▀█  █  █▀█ 

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
//#endregion

// █▀▄▀█ ▄▀█ █ █▄ █ 
// █ ▀ █ █▀█ █ █ ▀█ 

loadCards();