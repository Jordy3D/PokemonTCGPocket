var urlBase = "https://raw.githubusercontent.com/Jordy3D/PokemonTCGPocket/refs/heads/main/images"
if (window.location.href.includes('localhost') || window.location.href.includes('127.0.0.1')) {
    console.log('Running on localhost');
}
urlBase = 'images';

// █▀▀ █   ▄▀█ █▀ █▀ █▀▀ █▀ 
// █▄▄ █▄▄ █▀█ ▄█ ▄█ ██▄ ▄█ 

//#region Classes
class Series {
    constructor(seriesName, codename, normalCardCount, cards) {
        this.seriesName = seriesName;
        this.seriesNameHyphen = seriesName.replace(' ', '-').toLowerCase();
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
            <img src="${urlBase}/logos/${this.seriesNameHyphen}.webp" alt="${this.seriesName} series" class="series-logo" />
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
        let imageName = `${urlBase}/cards/`;
        imageName += `${this.seriesName.toLowerCase()}/`;
        imageName += `${this.number}-${this.name}-${this.seriesName}.webp`;
        imageName = imageName.replace(/ /g, '-').replace(/\'/g, '');
        // remove invalid characters (will be updated as needed)
        var invalidChars = ":\"\\|?*<>";
        for (let char of invalidChars) {
            imageName = imageName.replace(new RegExp(`\\${char}`, 'g'), '');
        }
        return imageName;
    }

    generateCardDetailHTML() {
        let rarity = null;
        if (this.rarity != '' || this.rarity != null) {
            rarity = this.rarity.toLowerCase();
        }
        let type = this.type;

        const invalid_types = [
            "Trainer",
            "Supporter",
            "Item",
            "Tool"
        ]

        if (invalid_types.includes(type))
            type = '';

        if (type != '' || type != null) {
            type = type.toLowerCase();
        }

        // generate subseries badge
        let subseriesBadge = '';
        if (this.subseries && this.subseries.length == 1) {
            subseriesBadge = `<span class="subseries-badge">${this.subseries}</span>`;
        }

        // generate type badge
        // if it's a trainer card, set type to ''
        if (this.type == 'trainer') {
            type = '';
        }

        return `
            <div class="card-details">
                <h3>${this.name}</h3>
                <p>#${this.number}</p>
                ${subseriesBadge}
                <div class="card-badges">
                ${type ? `<span class="type-badge ${type}"><img src="${urlBase}/type/${type}.webp" alt="${type} type" /></span>` : ''}
                ${rarity ? `<span class="rarity-badge ${rarity}"><img src="${urlBase}/rarity/${rarity}.webp" alt="${rarity} rarity" /></span>` : ''}
                </div>
            </div>
            <div class="card-image" style='background-image: url("${this.imageName}")'>
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


var allData = [];

async function loadAllData() {
    try {
        const response = await fetch('data/index.json');
        allData = await response.json();

        console.log('Loaded data index.');

        loadCards();
    } catch (error) {
        console.error('Error loading all data:', error);
    }
}

loadAllData();

async function loadCards() {
    try {
        const loadPromises = allData.map(async (seriesInfo) => {
            const { name, codename } = seriesInfo;
            const response = await fetch(`data/sets/${codename}.json`);
            if (!response.ok) {
                console.error(`Failed to load set ${codename}: ${response.status}`);
                return null;
            }
            const seriesData = await response.json();
            
            var cards = [];
            seriesData.cards.forEach(card => {
                // check if the card has a details object
                if (card.details) {
                    card.type = card.details.type.toLowerCase();
                }

                let newCard = new Card(card.number, card.name, card.type, card.rarity, card.subseries, card.generation, seriesData.seriesName);
                cards.push(newCard);
            });

            var newSeries = new Series(seriesData.seriesName, seriesData.codename, seriesData.normalCardCount, cards);
            return newSeries;
        });

        // Wait for all promises to resolve
        const loadedSets = await Promise.all(loadPromises);
        
        // Filter out any null values (failed loads)
        sets = loadedSets.filter(set => set !== null);

        displayCards();
    } catch (error) {
        console.error('Error loading cards:', error);
    }
}
//#endregion
