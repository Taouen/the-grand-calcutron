
const {Client, MessageEmbed} = require("discord.js");
const keepAlive = require("./server");
const client = new Client();

function doCalc(deck, copies, drawn, successes, exact = false) {
  
    if (exact) {
      if (successes > 0) {
        pr = hyp(deck, copies, drawn, successes) - hyp(deck, copies, drawn, successes - 1)
    }
    else
        pr = hyp(deck, copies, drawn, 0);
    if (pr < 1e-6)
        pr = 0;
    pr = (100 * pr).toPrecision(3) + '%';

    return pr;
    
    } else {
    //Chance to draw x or more cards
    if (successes > 0)
        pral = 1 - hyp(deck, copies, drawn, successes - 1);
        // (successes - 1, drawn, copies, deck);
    else
        pral = 1;
    if (pral < 1e-6)
        pral = 0;
    pral = (100 * pral).toPrecision(3) + '%'

    return pral;
    }
}

// Population Size, Subpopulation Size, Sample Size, value
function hyp(ps, ss, sz, x) {
    var nz, mz;
    if (ss < sz) {
        nz = ss;
        mz = sz
    } else {
        nz = sz;
        mz = ss
    }
    var h = 1;
    var s = 1;
    var k = 0;
    var i = 0;
    while (i < x) {
        while (s > 1 && k < nz) {
            h = h * (1 - mz / (ps - k));
            s = s * (1 - mz / (ps - k));
            k = k + 1;
        }
        h = h * (nz - i) * (mz - i) / (i + 1) / (ps - nz - mz + i + 1);
        s = s + h;
        i = i + 1;
    }
    while (k < nz) {
        s = s * (1 - mz / (ps - k));
        k = k + 1;
    }
    return s;
}


client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on("message", msg => {
  if (msg.author.bot) {
    return;
  }

  if (msg.content.startsWith("/odds")) {
    const strings = msg.content.split(' ');
    strings.splice(0,1);
    const values = strings.map(item => Number(item));
    
    const embed = new MessageEmbed()
      // Set the title of the field
      .setTitle(`${doCalc(...values)}`)
      // Set the color of the embed
      .setColor('#2ba64c')
      // Set the main content of the embed
      .setDescription(`Odds of drawing ${values[3]} or more of the selected card`);
    // Send the embed to the same channel as the message
    msg.channel.send(embed);
  }

  if (msg.content.startsWith('/exact')) {
    const strings = msg.content.split(' ');
    strings.splice(0,1);
    const values = strings.map(item => Number(item));
    console.log(...values);
    
    // msg.reply(compute(...values));
    const embed = new MessageEmbed()
      // Set the title of the field
      .setTitle(`${doCalc(...values, true)}`)
      // Set the color of the embed
      .setColor('#2ba64c')
      // Set the main content of the embed
      .setDescription(`Odds of drawing exactly ${values[3]} of the selected card`);
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
      .setDescription('Format commands as follows: \n\ \n\ <command> DeckSize SuccessesInDeck CardsDrawn SuccessesWanted \n\ DeckSize - Total number of cards in the deck \n\ SuccessesInDeck - Total number of the wanted card in the deck \n\ CardsDrawn - Number of cards drawn at the point you want the odds \n\ SuccessesWanted - Number of the wanted card you want to draw \n\ \n\ Example: /odds 40 9 7 2 - get odds of drawing 2 copies of a card with 9 copies in a 40 card deck in your opening hand. \n\ \n\ \n\ Commands \n\ \n\ /odds - Get odds of drawing a selected number or more of a given card. \n\ /exact - Get odds of drawing exactly the selected number of a given card.');
    // Send the embed to the same channel as the message
    msg.channel.send(embed);
    
  }
})
keepAlive();
client.login(process.env.TOKEN)