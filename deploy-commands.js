const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');
const fs = require('node:fs');  // Acquiring node file system to read our commands directory and identify our command files
const path = require('node:path');  // Constructs a pathway to our desired files and directories

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
        } else if (file.name.endsWith(".js")){
            commandFiles.push(`${dir}/${file.name}`); // If the files do not get detected, but ends with js, .push will put the file name at the end of our array
        }
    }
    return commandFiles;
}

let commands = [];
const commandFiles = getFiles('./commands'); // Grabs the files from the commands directory

for(const file of commandFiles){    // JSON of every individual file
    const command = require(file);
    commands.push(command.data.toJSON()); // converts our created commands to a JSON data type, so it can be read
}

const rest = new REST({version: '10'}).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), {body : commands}) // passes in all the commands that have been converted into JSON files
    .then(() => console.log('Successfully registered application commands!'))
    .catch(console.error);