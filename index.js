const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const bot = new Discord.Client({disableEveryone: true});
const fs = require("fs");
bot.commands = new Discord.Collection();
let cooldown = new Set();
let cdseconds = 5;


fs.readdir("./commands/", (err, files) => {

  if(err) console.log(err);

  let jsfile = files.filter(f => f.split(".").pop () === "js")
  if(jsfile.length <= 0){
    console.log("Couldn't find commands file.");
    return;
  }

  jsfile.forEach((f, i) =>{
    let props = require(`./commands/${f}`);
    console.log(`${f} Loaded!`);
    bot.commands.set(props.help.name, props);
})


});


bot.on("ready", async () => {
    console.log(`${bot.user.username} is online!`)
    bot.user.setGame("With ATOM Discord.js");
});



bot.on("message", async message => {
  let prefix = botconfig.prefix;
  if (message.author.bot) return;
  if(message.channel.type == "dm") return;
  if(!message.content.startsWith(prefix)) return;
  if(cooldown.has(message.author.id)){
    message.delete();
    return message.reply("You have to wait 5 seconds between each command! 😠")
  }
  //if(!message.member.hasPermission("ADMINISTRATOR")){
    cooldown.add(message.author.id);
  //}

  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);

  let commandfile = bot.commands.get(cmd.slice(prefix.length));
  if(commandfile) commandfile.run(bot,message,args);

  setTimeout(() => {
    cooldown.delete(message.author.id)
  }, cdseconds * 1000)

  if(cmd ===  `${prefix}hello`){
  return message.channel.send("Hello!");
}

if(cmd === `${prefix}verify`){
  let role = message.guild.roles.get("530299519758499840")
    message.channel.send(`${role}`, new Discord.RichEmbed()
        .setDescription ("A DISCORD MOD HAS BEEN NOTIFIED")
        .setColor("#ffffff"));
}

if(cmd ===  `${prefix}localinfo`){
  let uicon = message.author.displayAvatarURL
  let botembed = new Discord.RichEmbed()
  .setAuthor(message.author.username)
  .setDescription("Here is some local info I was able to find from Discord database!")
  .setColor("#ffffff")
  .setThumbnail(uicon)
  .addField("Account created on", message.author.createdAt.toLocaleString().toString().split(" ").slice(0, 5).join(" "))
  .addField("You joined this server on", message.member.joinedAt.toLocaleString().toString().split(" ").slice(0, 5).join(" "))
  .addField("Requested By :", message.author.username)
  .setFooter(message.author.id)
  return message.channel.send(botembed);
}



if(cmd ===  `${prefix}serverinfo`){

  let sicon = message.guild.displayAvatarURL;
  let serverembed = new Discord.RichEmbed()
  .setDescription("This is info on this currently selected server!")
  .setColor("#ffffff")
  .setThumbnail(sicon)
  .addField("Server Name", message.guild.name)
  .addField("Created On", message.guild.createdAt.toLocaleString().toString().split(" ").slice(0, 5).join(" "))
  .addField("You Joined", message.member.joinedAt.toLocaleString().toString().split(" ").slice(0, 5).join(" "))
  .addField("Total Members", message.guild.memberCount);
return message.channel.send(serverembed);
}


if(cmd ===  `${prefix}botinfo`){

  let bicon = bot.user.displayAvatarURL;
  let botembed = new Discord.RichEmbed()
  .setDescription("Bot Information")
  .setColor("#ffffff")
  .setThumbnail(bicon)
  .addField("Bot Name", bot.user.username)
  .addField("Creator", "This bot was created by Privlot#6255, Also coded in Node.js!")
  .addField("Created On", bot.user.createdAt.toLocaleString().toString().split(" ").slice(0, 5).join(" "))
  return message.channel.send(botembed);
}

});

bot.login(botconfig.token);
