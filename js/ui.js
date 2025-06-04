

function displayCards() {
    const container = document.getElementById('cardContainer');
    const collapsedSets = new Set(JSON.parse(localStorage.getItem('collapsedSets') || '[]'));

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
        cardSetEl.classList.toggle('active', !collapsedSets.has(series.codename));
        container.appendChild(cardSetEl);

        titleEl.addEventListener('click', () => {
            cardSetEl.classList.toggle('active');

            if (cardSetEl.classList.contains('active'))
                collapsedSets.delete(series.codename);
            else
                collapsedSets.add(series.codename);

            localStorage.setItem('collapsedSets', JSON.stringify([...collapsedSets]));
        });

        series.cards.forEach(card => {
            const cardEl = document.createElement('div');
            cardEl.className = 'card';
            if (obtainedCards.has(`${series.codename}-${card.number}`))
                cardEl.classList.add('obtained');

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

    // get the number of regular cards obtained which is the number of obtained cards below normalCardCount
    // if normalCardCount is 0 or not defined, then all cards are considered regular

    var normalObtained = 0;
    var specialObtained = 0;
    var textDisplay = '';
    var titleText = '';

    let normalCardCount = series.normalCardCount;
    if (normalCardCount === 0 || !normalCardCount) {
        normalObtained = series.cards.filter(card => obtainedCards.has(`${series.codename}-${card.number}`)).length;

        textDisplay = `(${normalObtained})`;
        titleText = `(${normalObtained}/${series.cards.length})`;
    }
    else {
        normalObtained = series.cards.filter(card => obtainedCards.has(`${series.codename}-${card.number}`) && card.number <= normalCardCount).length;
        specialObtained = series.cards.filter(card => obtainedCards.has(`${series.codename}-${card.number}`) && card.number > normalCardCount).length;

        // set the display to (♦ normalObtained/normalCarcCount) (★ specialObtained)
        textDisplay = `(♦ ${normalObtained}/${normalCardCount}) (★ ${specialObtained})`;
        titleText = `(♦ ${normalObtained}/${normalCardCount}) (★ ${specialObtained}/${series.cards.length - normalCardCount})`;
    }

    counterEl.textContent = textDisplay;
    counterEl.title = titleText;

    // const obtainedCount = series.cards.filter(card => obtainedCards.has(`${series.codename}-${card.number}`)).length;



    // counterEl.textContent = `(${obtainedCount}/${series.normalCardCount})`;
}
