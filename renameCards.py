import json
import os
import sys

# load data/pokemons.json
with open('data/pokemons.json') as f:
    pokemons = json.load(f)
    
    
# find all the different series names from pokemons
series_names = []
for pokemon in pokemons:
    if pokemon['seriesName'] not in series_names:
        series_names.append(pokemon['seriesName'])
    
# print all the series names and let the user choose one
print('Series Names:')
for i, name in enumerate(series_names):
    print(f'{i+1}. {name}')
    
series_index = int(input('Enter the index of the series you want to rename: ')) - 1
if series_index < 0 or series_index >= len(series_names):
    print('Invalid index')
    sys.exit(1)    
    
target_series = list(series_names)[series_index]
target_series_lower = target_series.lower().replace(' ', '-')
    
# load all the cards from images/cards/space-time-smackdown
cards = os.listdir(f'images/cards/{target_series_lower}')
# remove all non-webp files
cards = [card for card in cards if card.endswith('.webp') or card.endswith('.png')]

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
            
            # if the card is already a webp file, rename it to the new name
            if card.endswith('.webp'):
                os.rename(original, new)
                break
            # if the card is a png file, convert it to a webp file using magick and then rename it
            elif card.endswith('.png'):
                os.system(f'magick {original} {new}')
                os.remove(original)
                break
    else:
        print(f'Could not find a pokemon with number {number} to rename {card}')
        sys.exit(1)