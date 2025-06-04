

window.mobileCheck = function () {
    let check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};

console.log('Mobile:', mobileCheck());

document.body.classList.toggle('mobile', mobileCheck());

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

// store the name of each theme, the class name to be added to the body, and an emoji to display
const themes = {
    light: { className: '', emoji: '🌞' },
    dark: { className: 'dark-mode', emoji: '🌜' },
    pocket: { className: 'pocket', emoji: '👜' }
};

var currentTheme = 'light';

function cycleTheme(storedTheme) {
    const themeKeys = Object.keys(themes);
    let nextTheme = storedTheme && themes[storedTheme]
        ? storedTheme
        : themeKeys[(themeKeys.indexOf(currentTheme) + 1) % themeKeys.length];

    // remove all theme classes and add the next theme class
    document.body.className = themes[nextTheme].className;

    // if mobile, keep the mobile class
    if (mobileCheck())
        document.body.classList.add('mobile');

    document.getElementById('themeIcon').textContent = themes[nextTheme].emoji;
    localStorage.setItem('storedTheme', nextTheme);
    currentTheme = nextTheme;
}

// Load saved theme preference
const savedTheme = localStorage.getItem('storedTheme');
if (savedTheme && themes[savedTheme]) {
    cycleTheme(savedTheme);
} else {
    cycleTheme(currentTheme);
}

document.getElementById('themeToggle').addEventListener('click', () => {
    cycleTheme();
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

// █▀▄▀█ ▄▀█ █ █▄ █ 
// █ ▀ █ █▀█ █ █ ▀█ 

loadCards();

if (mobileCheck()) {
    const searchToggle = document.getElementById('searchToggle');
    const searchClose = document.querySelector('.search-close');
    const searchContainer = document.querySelector('.search-container');

    searchToggle.addEventListener('click', () => {
        searchContainer.classList.add('active');
    });

    searchClose.addEventListener('click', () => {
        searchContainer.classList.remove('active');
    });
}