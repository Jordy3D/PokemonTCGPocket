import os
import json
from pathlib import Path

# load data/pokemons.json into a variable called data
with open("data/pokemons.json", "r", encoding="utf-8") as file:
    data = json.load(file)
    
# get the series from data with codename A1a
data_series = None
for series in data:
    if series["codename"] == "A1a":
        data_series = series
        break
    
# print a list of all images in images/cards/Mythical-Island
image_files = list(Path("images/cards/Mythical-Island").rglob("*.png"))
for image_file in image_files:
    # get just the filename, without the path or extension
    name = image_file.stem
    
    # if the name isn't just a number, skip it
    if not name.isnumeric():
        continue
    
    # find the card with the number that matches the filename
    card = None
    for card_ in data_series["cards"]:
        if card_["number"] == name:
            card = card_
            break
            
    # rename the card to follow the format
    # 1-pokemon-name-Mythical-Island.png
    new_name = f"{card['number']}-{card['name'].replace(' ', '-')}-Mythical-Island.png"
    
    # rename the file while converting it to webp
    image_file.rename(image_file.with_name(new_name))
    
    new_webp_name = new_name.replace(".png", ".webp")
    
    # convert the image to webp
    os.system(f"convert images/cards/Mythical-Island/{new_name} images/cards/Mythical-Island/{new_webp_name}")
    