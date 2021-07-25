require('dotenv').config();
const { Client, MessageEmbed } = require('discord.js');
const keepAlive = require('./server');
const client = new Client();

// Hypergeometric calculation formula copied from https://gist.github.com/adamnovak/f34e6cf2c08684752a9d

function calculateProbability(
  deck,
  copies,
  cardsDrawn,
  successes,
  exact = false
) {
  if (exact) {
    //Chance to exactly x cards
    let probability;
    if (successes > 0) {
      probability =
        hyp(deck, copies, cardsDrawn, successes) -
        hyp(deck, copies, cardsDrawn, successes - 1);
    } else probability = hyp(deck, copies, cardsDrawn, 0);
    if (probability < 1e-6) probability = 0;
    probability = (100 * probability).toPrecision(3) + '%';

    return probability;
  } else {
    //Chance to draw x or more cards
    let probability;
    if (successes > 0)
      probability = 1 - hyp(deck, copies, cardsDrawn, successes - 1);
    else probability = 1;
    if (probability < 1e-6) probability = 0;
    probability = (100 * probability).toPrecision(3) + '%';

    return probability;
  }
}

function hyp(popSize, successesAvailable, sampled, successesObserved) {
  var smallerSet, largerSet;

  if (successesAvailable < sampled) {
    smallerSet = successesAvailable;
    largerSet = sampled;
  } else {
    smallerSet = sampled;
    largerSet = successesAvailable;
  }

  var h = 1;

  var s = 1;

  var k = 0;

  var i = 0;

  while (i < successesObserved) {
    while (s > 1 && k < smallerSet) {
      h = h * (1 - largerSet / (popSize - k));
      s = s * (1 - largerSet / (popSize - k));
      k = k + 1;
    }
    h =
      (h * (smallerSet - i) * (largerSet - i)) /
      (i + 1) /
      (popSize - smallerSet - largerSet + i + 1);
    s = s + h;
    i = i + 1;
  }

  while (k < smallerSet) {
    s = s * (1 - largerSet / (popSize - k));
    k = k + 1;
  }

  return s;
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', (msg) => {
  if (msg.author.bot) {
    return;
  }

  let message = msg.content.toLowerCase();

  if (message.startsWith('/odds')) {
    const strings = message.split(' ');
    strings.splice(0, 1);
    const values = strings.map((item) => Number(item));

    const embed = new MessageEmbed()
      // Set the title of the field
      .setTitle(`${calculateProbability(...values)}`)
      // Set the color of the embed
      .setColor('#2ba64c')
      // Set the main content of the embed
      .setDescription(
        `Odds of drawing ${values[3]} or more of the selected card`
      );
    // Send the embed to the same channel as the message
    msg.channel.send(embed);
  }

  if (message.startsWith('/exact')) {
    const strings = message.split(' ');
    strings.splice(0, 1);
    const values = strings.map((item) => Number(item));

    // msg.reply(compute(...values));
    const embed = new MessageEmbed()
      // Set the title of the field
      .setTitle(`${calculateProbability(...values, true)}`)
      // Set the color of the embed
      .setColor('#2ba64c')
      // Set the main content of the embed
      .setDescription(
        `Odds of drawing exactly ${values[3]} of the selected card`
      );
    // Send the embed to the same channel as the message
    msg.channel.send(embed);
  }

  if (msg.content.startsWith('/help')) {
    const embed = new MessageEmbed()
      // Set the title of the field
      .setTitle('Help')
      // Set the color of the embed
      .setColor('#2ba64c')
      // Set the main content of the embed
      .setDescription(
        'Format commands as follows: \n \n <command> DeckSize SuccessesInDeck CardsDrawn SuccessesWanted \n \n DeckSize - Total number of cards in the deck \n SuccessesInDeck - Total number of the wanted card in the deck \n CardsDrawn - Number of cards drawn at the point you want the odds \n SuccessesWanted - Number of the wanted card you want to draw \n \n Example: /odds 40 9 7 2 - get odds of drawing 2 copies of a card with 9 copies in a 40 card deck in your opening hand. \n \n \n Commands \n \n /odds - Get odds of drawing a selected number or more of a given card. \n /exact - Get odds of drawing exactly the selected number of a given card.'
      );
    // Send the embed to the same channel as the message
    msg.channel.send(embed);
  }
});
keepAlive();
client.login(process.env.TOKEN);
