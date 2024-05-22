const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, EmbedBuilder, ActivityType  } = require('discord.js');
const fetch = require('node-fetch');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const token = "";
const clientid = "";
const guildid = "";
const apikey = "";
const botstatus = "Fluxus Bypass Bot | Bypassi Made This"
const embedcolor = "#000000";
const footer = "footer text here";

client.once('ready', async () => {
    console.log(`\x1b[36mSuccessfully Logged In As ${client.user.username}\x1b[0m`);
    client.user.setPresence({
        activities: [{ name: botstatus, type: ActivityType.Watching }],
        status: 'dnd',
    });

    const rest = new REST({ version: '10' }).setToken(token);
    try {
        console.log('\x1b[33mUpdating Commands..\x1b[0m');

        const commands = [
            new SlashCommandBuilder()
                .setName('fluxus')
                .setDescription('Gets Fluxus Key')
                .addStringOption(option =>
                    option.setName('link')
                        .setDescription('Fluxus Link')
                        .setRequired(true)
                )
        ];

        await rest.put(
            Routes.applicationGuildCommands(clientid, guildid),
            { body: commands },
        );

        const guild = await client.guilds.fetch(guildid);
        console.log(`\x1b[32mSuccessfully Updated Commands For ${guild.name}\x1b[0m`);
    } catch (error) {
        console.error('\x1b[31m' + error + '\x1b[0m');
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand() || interaction.commandName !== 'fluxus') return;
    const link = interaction.options.getString('link');
    if (link.startsWith("https://flux.li/android/external/start.php?HWID=")) {
        try {
            await interaction.deferReply();
            const headers = {
                "apikey": apikey
            }
    		const response = await fetch(`http://132.145.68.135:6056/?url=${link}`, { headers });
            const json = await response.json();
            if (json.status === "success") {
                const embed = new EmbedBuilder()
                    .setTitle("Fluxus Key")
                    .setDescription(`Key:\n\`\`\`${json.key}\`\`\`\nTime Taken:\n\`\`\`${json.time}\`\`\``)
                    .setColor(embedcolor)
                    .setFooter({text:footer})
                await interaction.editReply({ embeds: [embed]});
            }else if (json.status === "fail" && json.key === "Invalid HWID/Invalid Fluxus Link" ) {
                const embed = new EmbedBuilder()
                    .setTitle("Invalid Fluxus Link")
                    .setDescription(`The Fluxus Link You Entered Is Invalid.`)
                    .setColor(embedcolor)
                    .setFooter({text:footer})
                await interaction.editReply({ embeds: [embed]}); 
            }else {
                const embed = new EmbedBuilder()
                    .setTitle("Error")
                    .setDescription(`Most Likely An Error With API`)
                    .setColor(embedcolor)
                    .setFooter({text:footer})
                await interaction.editReply({ embeds: [embed]});
            }
        } catch (error) {
            console.error(error);
            const embed = new EmbedBuilder()
                .setTitle("Error")
                .setDescription(`Failed To Proccess Your Request. Try Again Later`)
                .setColor(embedcolor)
                .setFooter({text:footer})
            await interaction.editReply({ embeds: [embed]});
        }
    }else {
        const embed = new EmbedBuilder()
            .setTitle("Invalid Fluxus Link")
            .setDescription(`The Link You Entered Is Not A Fluxus Link. Try Again With A Valid Fluxus Link.`)
            .setColor(embedcolor)
            .setFooter({text:footer})
        await interaction.reply({ embeds: [embed]});
    }
});

client.login(token);
