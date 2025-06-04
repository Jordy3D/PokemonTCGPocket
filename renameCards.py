import json
import os
import sys

# Load data/index.json
with open('data/index.json') as f:
    index = json.load(f)
    
# Print all the series names from index.json and let the user choose one
print('Series Names:')
for i, series in enumerate(index):
    print(f'{i+1}. {series["name"]} ({series["codename"]})')
    
series_index = int(input('Enter the index of the series you want to rename: ')) - 1
if series_index < 0 or series_index >= len(index):
    print('Invalid index')
    sys.exit(1)    
    
target_series = index[series_index]["name"]
target_codename = index[series_index]["codename"]
target_series_lower = target_series.lower().replace(' ', '-')

# Load the specific set file
try:
    with open(f'data/sets/{target_codename}.json') as f:
        series_data = json.load(f)
except FileNotFoundError:
    print(f"Error: Could not find set file data/sets/{target_codename}.json")
    sys.exit(1)

# load all the cards from images/cards/[series-name]
cards_dir = f'images/cards/{target_series_lower}'
try:
    cards = os.listdir(cards_dir)
    # remove all non-webp and non-png files
    cards = [card for card in cards if card.endswith('.webp') or card.endswith('.png')]
except FileNotFoundError:
    print(f"Error: Directory {cards_dir} not found")
    sys.exit(1)

# rename the cards by finding the card whose number matches the series card's number
# go from 1-whatever.webp to 1-Oddish-Space-Time-Smackdown.webp
for card in cards:
    number = card.split('-')[0].split('.')[0]
    number = number.lstrip('0')
    for pokemon in series_data['cards']:
        if pokemon['number'] == number:
            pokemon_name = pokemon['name']
            # replace spaces with dashes
            pokemon_name = pokemon_name.replace(' ', '-')
            pokemon_name = pokemon_name.replace("'", '')
            # replace : with ''
            pokemon_name = pokemon_name.replace(':', '')
            
            original = f'{cards_dir}/{card}'
            new = f'{cards_dir}/{number}-{pokemon_name}-{target_series.replace(" ", "-")}.webp'
            
            print(f"Renaming: {original} -> {new}")
            
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

print(f"Finished renaming cards for {target_series} ({target_codename})")