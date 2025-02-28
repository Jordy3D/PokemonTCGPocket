import json
import os
import sys

# load data/pokemons.json
with open('data/pokemons.json') as f:
    pokemons = json.load(f)
    
    
target_series = 'Triumphant Light'
target_series_lower = target_series.lower().replace(' ', '-')
    
# load all the cards from images/cards/space-time-smackdown
cards = os.listdir(f'images/cards/{target_series_lower}')
# remove all non-webp files
cards = [card for card in cards if card.endswith('.webp')]

# load the pokemon object from pokemons that has the given seriesName
series = None
for pokemon in pokemons:
    if pokemon['seriesName'] == target_series:
        series = pokemon
        break
else:
    print(f'Could not find a pokemon with seriesName {target_series}') 
    sys.exit(1)

# rename the cards by finding the card whose number matches the pokemon's number
# go from 1-whatever.webp to 1-Oddish-Space-Time-Smackdown.webp
for card in cards:
    number = card.split('-')[0].split('.')[0]
    number = number.lstrip('0')
    for pokemon in series['cards']:
        if pokemon['number'] == number:
            pokemon_name = pokemon['name']
            # replace spaces with dashes
            pokemon_name = pokemon_name.replace(' ', '-')
            pokemon_name = pokemon_name.replace("'", '')
            
            original = f'images/cards/{target_series_lower}/{card}'
            new = f'images/cards/{target_series_lower}/{number}-{pokemon_name}-{target_series.replace(" ", "-")}.webp'
            
            os.rename(original, new)
            break
    else:
        print(f'Could not find a pokemon with number {number} to rename {card}')
        sys.exit(1)