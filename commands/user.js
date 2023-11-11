const { SlashCommandBuilder } = require('discord.js');
// Gives information on the user and when they joined
module.exports = {
    data: new SlashCommandBuilder()
        .setName("user")
        .setDescription("Provides information about the user."),
    
        async execute(interaction){
        const user = interaction.options.getUser('user') || interaction.user;
        await interaction.reply(`This command was run by ${interaction.user.tag}, who joined on ${interaction.member.joinedAt}.`);
    }
}
