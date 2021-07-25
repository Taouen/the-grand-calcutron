# The Grand Calcutron

The Grand Calcutron is a discord bot that can be used to find Hypergeometric probabilities.

Hypergeometric probability is commonly used to determine the odds of drawing certain cards from a deck in games like Magic: The Gathering and Yu-Gi-Oh.

---

## Usage

You can [invite The Grand Calcutron to your Discord server](https://discord.com/api/oauth2/authorize?client_id=867235663119646731&permissions=2148002880&scope=bot) or clone it from GitHub to run it yourself.

### Command Structure

`<command> DeckSize SuccessesInDeck CardsDrawn SuccessesWanted`

**DeckSize** - Total number of cards in the deck  
**SuccessesInDeck** - Total number of the wanted card in the deck  
**CardsDrawn** - Number of cards drawn at the point you want the odds  
**SuccessesWanted** - Number of the wanted card you want to draw

### Commands

/help - Provides the format for command usage and a list of commands  
/odds - Odds of drawing the selected number or more of the selected card  
/exact - Odds of drawing exactly the selected number of the selected card

### Example

![Example of Odds command on Discord](/assets/example1.png)

The example shows the /odds command, followed by 40 (the size of the deck), 8 (the number of copies of the wanted card in the deck), 7 (the number of cards drawn), and 1 (the number of copies of the wanted card we want to draw). The Grand Calcutron tells us that the odds of drawing 1 or more of the wanted card in that many draws is 81.9%.

---

## Installation

```
  npm install
  # or
  yarn install
```

You can follow this tutorial to [set up your discord bot.](https://www.freecodecamp.org/news/create-a-discord-bot-with-javascript-nodejs/) The tutorial also explains how you can set up the code for the bot on [replit.com](https://replit.com/), and how to use [Uptime Robot](https://uptimerobot.com/) to make sure it is on all the time.

To run the bot server locally:

```
npm start
```

The bot will only respond on Discord as long as your server is running, which is useful for development. The server will restart automatically when you save changes to any file.

This bot uses [discord.js](https://discord.js.org/#/docs/main/stable/general/welcome), a Node module that allows you to interact with the Discord API.
