const { token, clientId, guildId, CHANNEL_ID_1 } = require('./config.json');     // This contains our discord bot's token, where it is hidden away in config.json, along with the ID values 
const { Client, Events, GatewayIntentBits, SlashCommandBuilder, InteractionCollector, Collection } = require('discord.js');
const fs = require('node:fs');

const cron = require('cron');


const client = new Client({         // This creates our bot and declares its desired features
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
]})

client.commands = getCommands('./commands');        // The bot itself needs access to the commands (think of it as two bots connecting to each other), the one in discord and the one in your code
                                                    // By lining up the names we are able to call the command in discord and respond accordingly
client.on(Events.ClientReady, c => {                  // Activates the bot, only once - that's all you really need to keep it on 
    console.log(`Logged in as ${c.user.tag}`);          //An arrow function is regularly expressed as interaction({ body }); NOTE: parentheses are outside due to us running the code
    c.user.setActivity('looking for people to greet');

    let gm = new cron.CronJob('0 0 * * *', () => {
        client.channels.cache.get(CHANNEL_ID_1).send("Good Morning"); // Sends this at exactly 12:00 AM of a new day -- requires the bot to be on at all times 
    })

    gm.start();

});

client.on('messageCreate', (message) => {
    let num;
    let msg = '';

    if(message.author.bot){
        return;
    }

    for(let i = 0; i < message.content.length; i++)         // word checker (could be used to ban certain words from being used -- simply needs to add discord's function to remove the user's message, or detect any word to perform an action)
    {
        msg += message.content.charAt(i).toLowerCase();
        console.log(msg);
        if (msg == "hello") // the variable msg needs to be fully lowercase
            {
        
                num = Math.round(Math.random() * 2) + 1;
                console.log(num);
        
                switch (num){               // Giving the AI multiple options of response
                    case 1: 
                    {
                        message.reply("Hello! How are you doing today?");
                        break;
                    }
                    case 2:
                    {
                        message.reply("Hello.");
                        break;
                    }    
                    case 3:
                    {
                        message.reply({files: ["./images/bear hello.gif"]});        // Capable of replying with images and gifs
                        break;
                    }
                    default:
                        return;

                    }

            }
        if(message.content.charAt(i) == ' ')
        {   
            msg = '';

        }
    }
    
    console.log(msg);
    console.log(message.content);
//try making it read user messages so when it spells out black, it will say this no matter what (there should be a way to avoid white spaces)
});


client.on(Events.InteractionCreate, interaction => {        //This handles our slash commands
    if(!interaction.isChatInputCommand()) return;
    
    let command = client.commands.get(interaction.commandName);

    try{
        if(interaction.replied)return;
        command.execute(interaction);
    } catch (error){
        console.error(error);
    }

});

client.login(token);

function getCommands(dir){
    let commands = new Collection();
    const commandFiles = getFiles(dir);

    for(const commandFile of commandFiles){
        let command = require(commandFile);                                // Everything exported from the module export now resides in the collection "command"
        commands.set(command.data.toJSON().name, command);            // Javascript Object Notation -- .set is how you put things into a collection
    }
    return commands;
}

function getFiles(dir) {                            // dir in the function allows it to be called recursively
    const files = fs.readdirSync(dir,{
        withFileTypes: true                         // Allows us to check and make sure that the files are a .js file
    });
    let commandFiles = [];

    for(const file of files) {                      // Going through each of the files through fs
        if(file.isDirectory()){                     // Checks if there is a folder in our "commands" folder, if so our array of commands will add the files from the nested folders
            commandFiles = [
                ...commandFiles,                    
                ...getFiles(`${dir}/${file.name}`)  // This is where the recursive comes in 
            ]
        } else if (file.name.endsWith('.js')){
            commandFiles.push(`${dir}/${file.name}`); // If the files do not get detected, but ends with js, .push will put the file name at the end of our array
        }
    }
    return commandFiles;
}
    
// const command = interaction.client.commands.get(interaction.commandName);
// (message.content + ', ' + message.author.username)
//seconds, minutes, hour, day of month, month, day of week / means every 1(hourly),2(every other hour)