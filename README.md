<div align="center">
  <h1>Pokemon TCG Pocket Collection</h1>
  <img src="https://github.com/Jordy3D/PokemonTCGPocket/raw/main/images/favicon.png" height=100>
  <p>Track your PTCGP collection</p> 
</div>

## About

Got bored, wanted a way to track and my collection without needing to open the app.

## Features

- Set obtained status of cards
- Search for cards by a variety of terms
- Filter cards by set, type, and rarity status (or inverse)
- View (some) card details
- View (basic) collection statistics
- Import/Export collection data
- Toggle between a more detailed view and a "Binder" view

### Search

The search bar supports searching for a variety of terms, including:
| Search Term     | Example            |
|-----------------|--------------------|
| Card name       | `Charizard` |
| Series name     | `Genetic Apex` |
| Series code     | `A1` |
| Subseries name  | `Pikachu` |
| Card number     | `1`                  |
| Type            | `Electric`         |
| Rarity          | `1d` for 1 Diamond<br>`2s` for 2 Star<br>`1c` for Crown, etc |
| Generation      | `gen1`             |
| Obtained status | `caught`           |

Each term can be negated with a `!` (ie: `!Charizard` to exclude Charizard cards), and a `;` can be used to separate multiple terms (ie: `Electric;gen1` to search for Electric type cards from Generation 1).

Some examples:
| Search Term     | Description            |
|-----------------|--------------------|
| `Electric;gen5` | All Electric type cards from Generation 5. |
| `gen1;!ex`      | All cards from Generation 1 that are not EX cards.<br>NOTE: Disable the Series search to avoid filtering out Genetic Ap`ex`. Alternatively, use `gen1;! ex` instead. |
| `!gen1`         | All cards that are not from Generation 1. |
| `2s;trainer`    | All 2 Star rarity Trainer cards. |
| `gen1;! ex;!1s;!2s;!3s;!promo` | All Generation 1 cards that are not some form of special card.<br> (Good for tracking progress to Mew!) |

## Data

### Card Data

Card data is stored in the `data/pokemons.json` file. If you want to add more data, follow the existing format and either submit a PR or open an issue with the data you want to add.

### Collection Data

Collection data is stored in local storage. You can export your collection data to a file, and import it back in later.  
This data is stored in the browser, so be careful when clearing your browser data.

