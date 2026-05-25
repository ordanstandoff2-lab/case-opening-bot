const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// Case data structure - ADD YOUR ITEMS HERE
const cases = {
  'valor': {
    name: 'Valor Case',
    rarities: {
      'RARE': 59,
      'EPIC': 33,
      'LEGENDARY': 7,
      'ARCANE': 1
    },
    items: [
      { name: 'Kara', rarity: 'RARE', imageUrl: 'https://media.discordapp.net/attachments/820902388579172383/1507719395923857418/IMG_0333.png?ex=6a158f9c&is=6a143e1c&hm=8ac7b324046c953c2e94390ad9294a9e98edd9c450e0d0a8002dbeb355275627&=&format=webp&quality=lossless&width=1375&height=960' }
    ]
  },
  'dynasty': {
    name: 'Dynasty Case',
    rarities: {
      'RARE': 58,
      'EPIC': 33,
      'LEGENDARY': 7,
      'ARCANE': 2
    },
    items: []
  },
  'chameleon': {
    name: 'Chameleon Case',
    rarities: {
      'RARE': 58,
      'EPIC': 33,
      'LEGENDARY': 7,
      'ARCANE': 2
    },
    items: []
  },
  'division': {
    name: 'Division Case',
    rarities: {
      'RARE': 58,
      'EPIC': 33,
      'LEGENDARY': 7,
      'ARCANE': 2
    },
    items: []
  }
};

// Get random item based on rarity
function getRandomItem(caseData) {
  const rand = Math.random() * 100;
  let cumulative = 0;
  let selectedRarity = 'RARE';

  for (const [rarity, chance] of Object.entries(caseData.rarities)) {
    cumulative += chance;
    if (rand <= cumulative) {
      selectedRarity = rarity;
      break;
    }
  }

  const itemsOfRarity = caseData.items.filter(item => item.rarity === selectedRarity);
  if (itemsOfRarity.length === 0) return null;

  return itemsOfRarity[Math.floor(Math.random() * itemsOfRarity.length)];
}

client.on('ready', () => {
  console.log(`✅ Bot logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const args = message.content.toLowerCase().split(' ');
  const command = args[0];

  // Check if it's a case opening command
  if (command.startsWith('case')) {
    const caseName = args[1]?.toLowerCase();

    if (!caseName || !cases[caseName]) {
      return message.reply(`❌ Case not found! Available cases: ${Object.keys(cases).map(c => cases[c].name).join(', ')}`);
    }

    const caseData = cases[caseName];
    if (caseData.items.length === 0) {
      return message.reply(`❌ This case has no items yet!`);
    }

    const item = getRandomItem(caseData);
    if (!item) {
      return message.reply(`❌ No items found for this rarity!`);
    }

    // Create embed
    const embed = new EmbedBuilder()
      .setTitle(`🎁 ${caseData.name} Opened!`)
      .setDescription(`**${item.name}**`)
      .addFields(
        { name: 'Rarity', value: item.rarity, inline: true },
        { name: 'Chance', value: `${caseData.rarities[item.rarity]}%`, inline: true }
      )
      .setColor(getRarityColor(item.rarity))
      .setImage(item.imageUrl)
      .setFooter({ text: `Opened by ${message.author.username}` })
      .setTimestamp();

    message.reply({ embeds: [embed] });
  }
});

// Color based on rarity
function getRarityColor(rarity) {
  const colors = {
    'RARE': '#4169E1',      // Blue
    'EPIC': '#9370DB',      // Purple
    'LEGENDARY': '#FFD700', // Gold
    'ARCANE': '#FF1493'     // Deep Pink
  };
  return colors[rarity] || '#808080';
}

client.login(process.env.DISCORD_TOKEN);

