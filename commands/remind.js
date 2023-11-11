const { SlashCommandBuilder, userMention } = require('discord.js'); // Acquring a class from the discord.js library
const { CHANNEL_ID_1 } = require('../config.json');
const cron = require('cron');


module.exports = {                                      // Allows us to export all the data in the curly braces
    data: new SlashCommandBuilder()                     // Data object -- basically anything in the braces are JSON -- look at your config.json (needs commas)
        .setName('remind')                           // Contains all the data of our ping command 
        .setDescription("Reminds someone hourly")     // Sets the description             API DOCUMENTATION -- setDescription(description) -- read the bottom (it states the data type)
        .addUserOption(option => 
            option
                .setName('user')
                .setDescription('The bot will remind a user hourly')
                .setRequired(true)
        ),
        
        
        async execute(interaction){                // async is a function type that will run "in the background", this will not intefere with the actual program, thus allowing it to run smoothly
        const user = interaction.options.getUser('user') || interaction.user;          // await is genrally paired with async, once the async function is 'completed', it will execute the function body
        
        let botRemind = new cron.CronJob('0 * * * *', () => {
            interaction.channel.send(`${user}`);
        });
        botRemind.start();
    }
}

