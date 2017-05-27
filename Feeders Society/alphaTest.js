var irc = require("tmi.js");
var request = require('request');
var sys = require('util')
var exec = require('child_process').exec;
var fs = require('fs');

var options ={
    options: {
        debug: true
    },
    connection: {
		cluster: "aws",
        reconnect: true	
		//preferredServer: '199.9.253.119', 
		//preferredPort: '6667'
    },
    identity: {
        username: "ultimatere2",
        password: "oauth:xry9ne6tpcg2an9jrtw5qwy6x18ynq"
    },
    channels: ["_ultimatere2_1494949614489"]
};

var client = new irc.client(options);
// Connect the client to the server..
client.connect();
//var whisperClient = new irc.client(options1);
//whisperClient.connect();
process.stdin.resume (); 
process.stdin.setEncoding ('utf8'); 
process.stdin.on ('data',function(str){eval(str)});

var Rank = Object.freeze ({
	TRUSTED:"trusted",
	ADMIN:"admin",
	MOD:"mod",
	PLEB:""
});

var chatState = {
	timeout: {
		r9k: false,
	},
	cooldown: {
		plebCD: true,
		botCDMsg1: false, 
		botCDMsg2: false
	},
	massInvite: {
		cancel: false,
		active: false
	}
}

var path = "/var/lib/openshift/583dc32f0c1e66954200003e/nodejs/twitch/Feeders_Society/";

function getStaffList(){
	var staffFile = io.readFile(path + "mods.txt");
	return staffFile.split(" ");
}

function getStaff(){
/*
fs.writeFile( "filename.json", JSON.stringify( myJson ), "utf8", (err) => {
if (err) throw err;
});
*/
return require(path+"staff.json");
}

function getStaffNames1(){
	var staffNames=[];
	var arg = getStaffList();
	for(var i=0; i<arg.length-1;i++){
		var userRank = arg[i].split('.');
		staffNames[i] = userRank[0];	
	}
	return staffNames;
}

function getStaffRanks(){
	var staffRanks=[];
	var arg = getStaffList();
	for(var i=0; i<arg.length-1;i++){
		var userRank = arg[i].split('.');
		staffRanks[i] = userRank[1];	
	}
	return staffRanks;
}

function getStaffNames(rank){
	var staff="";
	var arg = getStaffList();
	for(var i=0; i<arg.length-1;i++){
		var userRank = arg[i].split('.');
		if(userRank[0]=="silver_surfin"){
			continue;
		}
		if(userRank[1]==rank)
			staff += "["+userRank[0]+"] ";	
		}
	return staff;
}

var Game = {
	username:"",
	args:"",
	rank:"",
	isGameRunning:function(args,username,rank){
		this.username=username;
		this.args=args;
		this.rank=rank;
		if(this.guess.number!=0){
			this.guess.isUserCorrect();
		}else if(this.mine.active&&this.mine.defuseTarget!=""){
			this.mine.didUserDefuse();
		}else if(this.mine.active){
			this.mine.randomMineGenerator();
		}

	},

	guess:{
		number:0,
		duration:"",
		isUserCorrect: function(){
			if(Game.args.length==1 && Game.args[0]==this.number){
				this.number=0;
				clearTimeout(this.duration);
				client.say(options.channels[0], Game.username+" you are a WINNER! ⎝ PogChamp ⎠ ");
			}
		}
	},

	mine:{
		defuseTarget:"",
		defuseWord:"",
		active: false,
		randomMineGenerator: function(){
			const RANDOM_NUMBER_RANGE = 15;
			var randomNumber = Math.floor(Math.random()*RANDOM_NUMBER_RANGE);
			console.log(randomNumber);
			console.log(Game.rank);
			if(randomNumber==0&&(Game.rank==Rank.PLEB)){
				client.timeout(options.channels[0], Game.username, 35);
				this.active=false;
				client.say(options.channels[0], "@"+Game.username+" ANELE twitchRaid KAPOW");
			}
		},
		didUserDefuse: function(){
			if(this.defuseWord==Game.args[0]){
				if(this.defuseTarget == Game.username){
					client.say(options.channels[0],Game.username+" successfully defused a bomb. KappaCool");
				}else{
					client.timeout(options.channels[0],this.defuseTarget,30);
					client.say(options.channels[0],Game.username +" detonates the mine right on "+ this.defuseTarget+" KAPOW ANELE");	
				}
			}else{
				if(Game.args[0].indexOf("͏")>-1){
					client.timeout(options.channels[0],Game.username,60);
					client.say(options.channels[0],Game.username +" nice copy and paste skills LUL");	
				}else{
					client.timeout(options.channels[0],Game.username,30)
					client.say(options.channels[0],Game.username+" misspelled the word and gets KAPOW to pieces! ANELE");
				}
			}
			this.defuseTarget="";
			this.defuseWord="";
			this.active=false;
		}
	}
}

var chatters=[];


function userData(){
	this.userList = [];

	this.User = function User(username){
		this.name = username;
	   	this.count = 0;
		this.longCount = 0;
		this.penalty = 60;
		this.timeout = "";
		this.active = "";
		this.cd=false;
		this.commandCD=false;
		this.step=0;
		this.energy=6;
		this.energyCD="";
		this.date = new Date();
		this.rank = function(){
			var staffList = getStaffList();
			for(var j=0; j<staffList.length;j++){
					if(staffList[j].substring(0,staffList[j].indexOf("."))==this.getName().toLowerCase()){ 
						return staffList[j].substring(staffList[j].indexOf(".")+1).toLowerCase().trim();	
					}		
			}
			return Rank.PLEB;		
		}

		this.getName = function(){
			return this.name;
		}
	}

	this.commandCdTimer = function(username,timer){
		if(!username.commandCD){
			username.commandCD = true;
			setTimeout(function(){username.commandCD = false;}, timer);
			return false;
		}else{
			return true;
		}
	}

	this.checkIfSpamming = function(username){
		if(username.energy==0){
			client.timeout(options.channels[0], username.name, 60);
			client.say(options.channels[0], username.getName() + " you have been timeout for spamming.");
			return true;
		}
		username.energy--;
		if(username.energyCD==""){
			username.energyCD = setTimeout(function(){username.energyCD=="";username.energy=4;}, 1000*3);
		}else{
			clearTimeout(username.energyCD);
			username.energyCD = setTimeout(function(){username.energyCD=="";username.energy=4;}, 1000*3);
		}
		return false;
	}

	this.getUser = function(username){
		for(var j=0;j<this.userList.length;j++){
			if(this.userList[j].getName().toLowerCase() == username.toLowerCase()){
				return this.userList[j];
			}
		}
		return "";
	}
	
	this.checkUser = function (username){
		var userFile = io.readFile('/var/lib/openshift/583dc32f0c1e66954200003e/nodejs/twitch/Feeders_Society/users.txt');
		var userList = userFile.split(",");
		var newPleb ="";
		for(var i =0;i<userList.length;i++){
			if(userList[i].toLowerCase()==username.toLowerCase()){
				this.checkUserList(username);
				return;
			}		
		}
		if(userFile=="")
			newPleb = username;
		else
			newPleb = ","+username;
		io.writeFile('/var/lib/openshift/583dc32f0c1e66954200003e/nodejs/twitch/Feeders_Society/users.txt', userFile + newPleb); 
		var userObject = new this.User(username);
		this.userList.push(userObject);
		client.whisper("#"+username.toLowerCase(),"This is a League of Legends focused chat group. You were invited from a random League stream. Enjoy your stay :D Type !commands to get started or !leave if you are not interested.");
		return;
	}

	this.checkUserList = function (username){
		for(var j=0;j<this.userList.length;j++){
			if(this.userList[j].getName().toLowerCase() == username.toLowerCase()){
				return;
			}
		}
		var userObject = new this.User(username);
		this.userList.push(userObject);
	}

	this.isUserActive = function(username){
		if(username.active==""){
			username.active=setTimeout(function(){username.active="";}, 1000*60*15);
		}else{
			clearTimeout(username.active);
			username.active=setTimeout(function(){username.active="";}, 1000*60*15);
		}
	}

	this.checkIfSilenced = function(username){
		var silenceFile = io.readFile('/var/lib/openshift/583dc32f0c1e66954200003e/nodejs/twitch/Feeders_Society/cage.txt');
		var silenceList = silenceFile.split(",");
		for(var i = 0;i<silenceList.length;i++){
			if(silenceList[i].toLowerCase()==username.toLowerCase()){
				clearTimeout(options.channels[0], silenceList[i], 2);
				return true;
			}
		}
		return false;
	}

	this.checkIfSellout = function(msg,username){
		var patt = new RegExp("twitch.tv/"+username.name, "i");
		if(patt.test(msg)){
			client.timeout(options.channels[0], username.name, 120);
			client.say(options.channels[0],"༼ຈل͜ຈ༽ﾉ·︻̷̿┻̿═━一I'VE GOT THE SELLOUT IN MY SIGHTS");
			return true;
		}
		return false;
	}

	this.checkIfBannedWord = function (msg, username){
	var banWordFile = io.readFile('/var/lib/openshift/583dc32f0c1e66954200003e/nodejs/twitch/Feeders_Society/bannedwords.txt');
	if(banWordFile=="")
		return;
	var banWordList = banWordFile.split("~");
	for(var i=0;i<banWordList.length;i++){
		if(msg.toLowerCase().indexOf(banWordList[i].toLowerCase()) > -1){
			client.timeout(options.channels[0], username, 30);
			return true;
		}
	}
	return false;
	}

	this.checkIfR9K = function(msg,username){
		for(var j=0;j<msg.length;j++){
			if(msg[j].charCodeAt(0)<31 || msg[j].charCodeAt(0)>127&&chatState.r9k){
				client.timeout(options.channels[0], username, 30);
				return true;
			}
		}
		return false;
	}
}

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};	


var userData = new userData();

client.on("chat", function (channel, user, message, self) {
	if(self)
		return;
	
	//userData.checkUser(user.username);
	//var currentUser = userData.getUser(user.username);
	//userData.isUserActive(currentUser);
	var args = message.split(" ");
	/*currentUser.date = new Date();

	if(currentUser.rank()==Rank.PLEB||currentUser.rank()==Rank.TRUSTED){
		if(userData.checkIfBannedWord(message,currentUser.getName()) || userData.checkIfR9K(message,currentUser.getName())){
			return;
		}
	}
	Game.isGameRunning(args,user.username,currentUser.rank());
	if(Game.guess.number!=0&&!isNaN(args[0]))
		return;

	if(userData.checkIfSilenced(currentUser.getName())){
		return;
	}

	if(userData.checkIfSellout(message,currentUser)){
		return;
	}

	if(userData.checkIfSpamming(currentUser)){
		return;
	}
*/
	if(args[0]=="!test"){
		myJson=require(path+"staff.json");
		console.log(myJson.mods[0]);
	}
	return;

			switch(args[0]){
				case "!online":
					if(args.length!=2){
						client.say(options.channels[0],"!online [user]")
						return;
					}
					if(userData.commandCdTimer(currentUser,5000))
						return;
					client.api({
						url: "http://tmi.twitch.tv/group/user/_triangletucker_1453389902311/chatters"
						}, function(err, res, body) {
								var viewSize=Object.size(body.chatters.viewers);
								for(var i =0;i<viewSize;i++){
									if(args[1].toLowerCase()==body.chatters.viewers[i].toLowerCase()){
										client.say(options.channels[0],args[1].toLowerCase()+" is online now.");
										return;
									}
								}
								client.say(options.channels[0],args[1].toLowerCase()+" is offline.");
						});
					break;
				case "!check":
					if(args.length!=3)
						return;
					if(userData.commandCdTimer(currentUser,5000)){
						return;
					}
					client.api({
						url: "http://tmi.twitch.tv/group/user/"+args[2].toLowerCase()+"/chatters"
						}, function(err, res, body) {
							if(body.chatters.viewers==="undefined"){
								return;
							}		
							var viewSize=Object.size(body.chatters.viewers);
							for(var i =0;i<viewSize;i++){
								if(args[1].toLowerCase()==body.chatters.viewers[i].toLowerCase()){
									client.say(options.channels[0],"GOT HIM! PogChamp");
									return;
								}
							}
							client.say(options.channels[0],args[1] + " not found there.");
						});
						break;
				case "!copypasta":
					if(args.length!=1)
						return;
					if(userData.commandCdTimer(currentUser,10000)){
						return;
					}
					var copypastaFile = io.readFile('/var/lib/openshift/583dc32f0c1e66954200003e/nodejs/twitch/Feeders_Society/copypasta.txt');
					var array = copypastaFile.split("~");
					client.say(options.channels[0], array[Math.floor(Math.random() * array.length)]);
					break;
				case "!rules":
					if(args.length!=1)
						return;
					if(userData.commandCdTimer(currentUser,10000)){
						return;
					}
					client.say(options.channels[0],"Rules for Feeders Society: (1) No racism. (2) No spamming. (3) No selling out. (4) English only. (5) No NSFW links. (6) Be kind and courteous to everyone.");
					break;
				case "!mobilechat":
					if(args.length!=1)
						return;
					if(userData.commandCdTimer(currentUser,5000)){
						return;
					}
					client.say(options.channels[0],	"Guide to access this chat on your phone http://pastebin.com/HEsQy0gX");
					break;
				case "!mods":
					if(args.length!=1)
						return;
					if(userData.commandCdTimer(currentUser,5000)){
						return;
					}
					client.say(options.channels[0],	"Mods: "+getStaffNames("admin") + getStaffNames("mod"));
					break;
				case "!roulette":
					if(args.length!=1)
						return;
					if(userData.commandCdTimer(currentUser,2000)){
						return;
					}
					if(Math.floor(Math.random()*3)==0){
						client.say(options.channels[0],"SAVED! KappaRoss");
					}else{
						client.timeout(options.channels[0], user.username, 60);
						client.say(options.channels[0],user.username+" got shot! 🔫 TriHard");
					}
					break;
				case "!discord":
					if(args.length!=1)
						return
					client.say(options.channels[0],"https://discord.gg/ArHB9gr");
					break;
				case "!faq":
					if(args.length!=1)
						return;
					if(userData.commandCdTimer(currentUser,2000)){
						return;
					}
					client.say(options.channels[0],"This is a League of Legends focused chat group. You were invited from a random League stream. Enjoy your stay :D Type !commands to get started or !leave if you are not interested.");
					break;
				case "!commands":
					if(args.length!=1)
						return;
					if(userData.commandCdTimer(currentUser,2000)){
						return;
					}
					if(currentUser.rank() == Rank.TRUSTED){
						client.say(options.channels[0],"http://pastebin.com/37AuCmLw");
					}else if(currentUser.rank() == Rank.MOD){
						client.say(options.channels[0],"http://pastebin.com/t6Ww0NRv");
					}else if(currentUser.rank() == Rank.ADMIN){
						client.say(options.channels[0],"http://pastebin.com/t6Ww0NRv");
					}else{
						client.say(options.channels[0],"http://pastebin.com/37AuCmLw");
					}
					break;
				case "!kidnudes":
					if(userData.commandCdTimer(currentUser,3000)){
						return;
					}
					client.say(options.channels[0],"https://s-media-cache-ak0.pinimg.com/originals/2a/4e/0b/2a4e0b1de36d60ba3e2a82336c917d33.jpg");
					break;
				case "!8ball":
					if(userData.commandCdTimer(currentUser,3000)){
						return;
					}
					if(args.length==1){
						client.say(options.channels[0],"!8ball [Type your yes/no question]?");
						return;
					}else if(args[args.length-1].indexOf("?") == -1){
						client.say(options.channels[0]," You forgot '?' at the end.");
						return;
					}
					var ball8File = io.readFile('/var/lib/openshift/583dc32f0c1e66954200003e/nodejs/twitch/Feeders_Society/8ball.txt');
					var ball8Array = ball8File.split("~");
					var random = Math.floor(Math.random()*ball8Array.length);
					client.say(options.channels[0],ball8Array[random]);	
					break;
				case "!active":
					if(args.length!=1)
						return;
					if(userData.commandCdTimer(currentUser,5000)){
						return;
					}
					var count=0;
					for(var i = 0;i<userData.userList.length;i++){
						if(userData.userList[i].active)
							count++;	
					}
					client.say(options.channels[0],"Currently "+count+" active users.");
					break;
				case "!movie":
					if(args.length!=1)
						return;
					if(userData.commandCdTimer(currentUser,5000)){
						return;
					}
					client.say(options.channels[0],"https://cytu.be/r/TwitchIlluminati");
					break;
				case "!active_users":
					if(args.length!=1)
						return;
					if(userData.commandCdTimer(currentUser,5000)){
						return;
					}
					var plebs="";
					for(var i = 0;i<userData.userList.length;i++){
						if(userData.userList[i].active)
							plebs += "["+userData.userList[i].getName()+"] ";	
					}
					plebs.trim();
					client.say(options.channels[0],plebs);
					break;		
				case "!trusted":
					if(args.length!=1)
						return;		
					if(userData.commandCdTimer(currentUser,10000)){
						return;
					}
					client.say(options.channels[0],	"Trusted members: "+getStaffNames("trusted"));
				case "!defuse":	
					if(args.length!=1)
						return;
					if(userData.commandCdTimer(currentUser,5000)){
						return;
					}
					if(Game.mine.active&&Game.mine.defuseWord==""){
						var defuseFile = io.readFile('/var/lib/openshift/583dc32f0c1e66954200003e/nodejs/twitch/Feeders_Society/defuse.txt');
						var defuseArray = defuseFile.split("~");
						var randomDefuseWord = defuseArray[Math.floor(Math.random()*defuseArray.length)];
						Game.mine.defuseWord = randomDefuseWord;
						var codedWord = "";
						for(var i=0;i<randomDefuseWord.length;i++){          //Codes the word, so plebs won't cheat
							codedWord+= randomDefuseWord.charAt(i)+"͏";
						}
						var randomTimer = Math.floor(Math.random()*10);
						client.say(options.channels[0],"Type in a word quickly when it displays on screen!");
						setTimeout(function(){Game.mine.defuseTarget=user.username; client.say(options.channels[0],codedWord);}, 1000*randomTimer);
					}else if(Game.mine.defuseTarget==""){
						client.say(options.channels[0],"You must first place !mine in order to !defuse.");
					}
					break;
				case "!modorban":
					if(args.length==1){
						client.say(options.channels[0],"!modorban [name]");	
						return;
					}		
					if(userData.commandCdTimer(currentUser,5000)){
						return;
					}	
					if(args.length!=2)
						return;				
					client.say(options.channels[0],args[1]+" you are now...");
					var array = ["PERMABANNED Kappa","A MODERATOR PogChamp","AN ADMIN SeemsGood","A LIZARD, RUN ᕕ WutFace ᕗ "];
					var try1 = Math.floor(Math.random() * 50)==0;
					var try2 = Math.floor(Math.random() * 20)==0;
					word=0;
					if(try1)
						word=3;
					else if(try2)
						word=2;
					else
						word = Math.floor(Math.random() * 2);			
					setTimeout(function(){client.say(options.channels[0],array[word]);}, 1000);
					break;
				case "!slap":	
					if(userData.commandCdTimer(currentUser,5000)){
						return;
					}
					if(args.length==2 || 2 < args.length){
						client.say(options.channels[0],user.username+" slaps "+args[1]+" ass* gachiGASM");
						slap=false;
						setTimeout(function(){ slap=true;}, 1000);
					}
					else{
						client.say(options.channels[0],"!slap [username]");
					}
					break;
				case "!hug":
					if(args.length!=2)
						return;
					if(currentUser.getName().toLowerCase()=="silver_surfin"&&args[1].toLowerCase()=="kid_chronic"){
						client.say(options.channels[0],currentUser.name+" backstabs "+args[1]+" 🔪 TriHard");
						return;
					}
					client.say(options.channels[0],currentUser.name+" hugs "+args[1]+" 🤗 <3");
					break;
				case "!leave":
					if(userData.commandCdTimer(currentUser,5000)){
						return;
					}
					if(args.length!=1)
						return;
					client.say(options.channels[0],"@"+ user.username +" Leave tutorial: https://gyazo.com/48ea85225b0726e0c1df0a7258b63a0a");
					//client.say(options.channels[0],"@"+ user.username +" Leave tutorial: https://gyazo.com/48ea85225b0726e0c1df0a7258b63a0a");
					break;							
					case "!card":
						if(args.length!=1)
							return;
						if(userData.commandCdTimer(currentUser,5000)){
							return;
						}
						var cards = ["2♠","3♠","4♠","5♠","6♠","7♠","8♠","9♠","10♠","J♠","Q♠","K♠","A♠","2♥","3♥","4♥","5♥","6♥","7♥","8♥","9♥","10♥","J♥","Q♥","K♥","A♥","2♦","3♦","4♦","5♦","6♦","7♦","8♦","9♦","10♦","J♦","Q♦","K♦","A♦","2♣","3♣","4♣","5♣","6♣","7♣","8♣","9♣","10♣","J♣","Q♣","K♣","A♣"];
					  	var randomCard= Math.floor(Math.random() * 56);
					  	client.say(options.channels[0], user.username + " your card is " + cards[randomCard]);
					  	break;
					  }  	
				if(currentUser.rank()!=Rank.PLEB){
					switch(args[0]){
					case "!spam":
						if(args.length==1)
							return;
						if(args[1].indexOf("/")>-1)
							return;
						if(userData.commandCdTimer(currentUser,60000)){
							return;
						} 
						var lastN = args[args.length-1];
						if(!isNaN(lastN)&&lastN<=10){
							var replace1 = message.replace(args[0],"");
							var word = replace1.replace(lastN,"");
						if(word.indexOf("|")>-1){
							word = word.split("|");
							var j=0;
							for(var i=0;i<lastN;i++){
								setTimeout(function(){ client.say(options.channels[0],word[j]);
								j++;
								if(j==word.length)
									j=0;
								}, 500*i);
							}
							return;
						}
						for(var i = 0;i<lastN;i++)
							setTimeout(function(){ client.say(options.channels[0],word);}, 500*i);
						}
						break;
					case "!user":
						if(args.length!=2)
							return;
						var targetUser = userData.getUser(args[1].toLowerCase());
						var targetUserDate = targetUser.date;
						if(targetUser=="")
							return;
						var currentDate = new Date();
						var month = currentDate.getMonth() - targetUserDate.getMonth();
						var day = currentDate.getDate() - targetUserDate.getDate();
						var hour = currentDate.getHours() - targetUserDate.getHours();
						var minute = currentDate.getMinutes() - targetUserDate.getMinutes();
						if(month>0){
							client.say(options.channels[0],targetUser.getName()+" was last seen " + month + " months ago. FeelsBadMan");
						}else if(day>0){
							client.say(options.channels[0],targetUser.getName()+" was last seen " + day + " days ago.");
						}else if(hour>0){
							client.say(options.channels[0],targetUser.getName()+" was last seen " + hour + " hours ago.");
						}else if(minute>0){
							client.say(options.channels[0],targetUser.getName()+" was last seen " + minute + " minutes ago.");
						}else{
							client.say(options.channels[0],targetUser.getName()+" should be here! FeelsGoodMan");
						}
						break;
					case "!gaytrain":
						if(args.length!=1)
							return;
						if(userData.commandCdTimer(currentUser,60000)){
							return;
						}
						setTimeout(function(){ client.say(options.channels[0],"<3 KappaPride KappaPride <3");}, 500);
						setTimeout(function(){ client.say(options.channels[0],"KappaPride KappaPride KappaPride KappaPride");}, 500*2);
						setTimeout(function(){ client.say(options.channels[0],"KappaPride KappaPride KappaPride KappaPride");}, 500*3);
						setTimeout(function(){ client.say(options.channels[0],"<3 KappaPride KappaPride <3");}, 500*4);
						setTimeout(function(){ client.say(options.channels[0],"<3 KappaPride KappaPride <3");}, 500*5);
						setTimeout(function(){ client.say(options.channels[0],"<3 KappaPride KappaPride <3");}, 500*6);
						setTimeout(function(){ client.say(options.channels[0],"<3 KappaPride KappaPride <3");}, 500*7);
						setTimeout(function(){ client.say(options.channels[0],"<3 KappaPride KappaPride <3");}, 500*8);
						setTimeout(function(){ client.say(options.channels[0],"KappaPride KappaPride KappaPride KappaPride");}, 500*9);
						setTimeout(function(){ client.say(options.channels[0],"KappaPride KappaPride KappaPride KappaPride");}, 500*10);
						break;
					case "!gachiGASM":
						if(args.length!=1)
							return;
						if(userData.commandCdTimer(currentUser,60000)){
							return;
						}
						setTimeout(function(){ client.say(options.channels[0],"gachiGASM");}, 500);
						setTimeout(function(){ client.say(options.channels[0],"gachiGASM gachiGASM");}, 500*2);
						setTimeout(function(){ client.say(options.channels[0],"gachiGASM gachiGASM gachiGASM");}, 500*3);
						setTimeout(function(){ client.say(options.channels[0],"gachiGASM gachiGASM gachiGASM gachiGASM");}, 500*4);
						setTimeout(function(){ client.say(options.channels[0],"gachiGASM gachiGASM gachiGASM");}, 500*5);
						setTimeout(function(){ client.say(options.channels[0],"gachiGASM gachiGASM");}, 500*6);
						setTimeout(function(){ client.say(options.channels[0],"gachiGASM");}, 500*7);
						break;
					case "!guess":
					if(args.length!=1)
						return;
					if(userData.commandCdTimer(currentUser,5000)){
						return;
					}
					if(Game.guess.number==0){
						client.say(options.channels[0],"NO TIME TO EXPLAIN PICK A NUMBER BETWEEN 1 AND 10 QUICK! PogChamp");
						Game.guess.number = Math.floor(Math.random() *10)+1;
						Game.guess.duration = setTimeout(function(){ client.say(options.channels[0],"Chat is a bunch of turtles! KevinTurtle");Game.guess.number=0}, 1000*5);
					}
					break;
					case "!mine":
					if(args.length!=1)
						return;
					if(userData.commandCdTimer(currentUser,5000)){
						return;
					}
					if(!Game.mine.active){
						Game.mine.active =true;
						client.say(options.channels[0],"A mine has been planted! ANELE");
					}else{
						client.say(options.channels[0],"Mine is already activated, now step on it! Kappa");
					}
					break;
					}
				}
				if(currentUser.rank()==Rank.ADMIN || currentUser.rank()==Rank.MOD){
					switch(args[0]){	
					case "!invite":
						if(args.length!=2)
							return;
							request.post(
							'http://chatdepot.twitch.tv/room_memberships?oauth_token=' + '9nuugphd8bho90f8kefpt0zunau95f',
							{ form: { 'irc_channel': "_smileyfacebot_1487793035652", 'username': args[1] } },
							function (error, response, body) {
							});
						client.say(options.channels[0], args[1] +' has been successfully invited :) ');
						break;
					case "!t":
						if(!args.length>=3&&args.length<=4||currentUser.getName()==args[1].toLowerCase())
							return;
						var staffNames = getStaffNames1();
						var staffRank = getStaffRanks();
						for(var i =0;i<staffNames.length;i++){
							if(staffNames[i]==args[1].toLowerCase()){
								if(staffRank[i]==Rank.MOD){;
									if(currentUser.rank==Rank.MOD){
										return;
									}
								}else if(staffRank[i]==Rank.ADMIN){
									return;
								}
							}
								client.timeout(options.channels[0], args[1], args[2]);
								if(args.length==4){
									client.say(options.channels[0], args[1] +' you have been timed out for ' + args[2] + ' seconds. Reason: '+args[3]);
								}else{
									client.say(options.channels[0], args[1] +' you have been timed out for ' + args[2] + ' seconds');
								}					
								return;
						}			
						break;
					case "!trust":
						if(args.length!=2)
							return;
						var staffNames = getStaffNames1();
						var staffRanks = getStaffRanks();
						for(var i =0;i<staffNames.length;i++){
							if(staffNames[i]==args[1].toLowerCase()){
								client.say(options.channels[0],"That user is already trusted FeelsGoodMan");
								return;
							}
						}
						fs.appendFileSync(path + "mods.txt",args[1].toLowerCase()+ ".trusted",(err) => {
 							if (err) throw err;});
						client.say(options.channels[0],args[1]+" is now trusted! FeelsGoodMan");		
						break;
				case "!untrust":
					if(args.length!=2)
						return;
					var staffNames = getStaffNames1();
					var staffRanks = getStaffRanks();
					for(var i =0;i<staffNames.length;i++){
						if(staffNames[i]==args[1].toLowerCase()){
								var staffFile = io.readFile('/var/lib/openshift/583dc32f0c1e66954200003e/nodejs/twitch/Feeders_Society/mods.txt');
								staffFile = staffFile.replace(staffNames[i]+".trusted","");
								staffFile = staffFile.replace(/ +/g, " ");
								io.writeFile('/var/lib/openshift/583dc32f0c1e66954200003e/nodejs/twitch/Feeders_Society/mods.txt', staffFile);
								client.say(options.channels[0],args[1]+" you have failed chat expectations. FeelsBadMan");							
						}
					}
					break;
					case "!unban":
						if(args.length!=2)
							return;
						client.unban(options.channels[0],args[1].toLowerCase());
						client.say(options.channels[0],args[1]+ ' is now unbanned. :D');
						break;
					case "!ban":
						if(args.length!=2 || args[1].indexOf("@")>-1)
							return;
						var staffNames = getStaffNames1();
						for(var i =0;i<staffNames.length;i++){
							if(staffNames[i]==args[1].toLowerCase()){
								return;
							}
						}
						client.ban(options.channels[0],args[1].toLowerCase());
						client.say(options.channels[0], args[1] + " became too toxic and was kicked from this group. :(	");
						break;
					case "!clear":
						if(args.length!=1)
							return;
						client.clear(options.channels[0]);
						client.say(options.channels[0],"DatSheffy GAS DatSheffy THE DatSheffy PLEBS DatSheffy");
						break;
					case "!r9k":
						if(args.length!=1)
							return;
						if(chatState.r9k){
							chatState.r9k=false;
							client.say(options.channels[0],"FREEDOM SwiftRage ");
						}
						else{
							chatState.r9k=true;
							client.say(options.channels[0],"╠═══╣All╠═══╣unique╠═══╣messages╠═══╣have╠═══╣been╠═══╣caged╠═══╣ TriHard ╠═══╣");
						}
						break;
					case "!silence":
						if(args.length!=2)
							return;
						if(userData.getUser(args[1])==""){
							client.say(options.channels[0],args[1]+" doesn't exist.");
						}else if(userData.getUser(args[1]).rank()==Rank.PLEB){
							var file = io.readFile('/var/lib/openshift/583dc32f0c1e66954200003e/nodejs/twitch/Feeders_Society/cage.txt');
							var newPleb ="";
						if(file=="")
							newPleb = args[1];
						else
							newPleb = ","+args[1];
						client.say(options.channels[0],args[1]+" hole has been tightly sealed gachiGASM");
						io.writeFile('/var/lib/openshift/583dc32f0c1e66954200003e/nodejs/twitch/Feeders_Society/cage.txt', file + newPleb);
						}
						break;
					case "!unsilence":
						if(args.length!=2)
							return;
						if(userData.getUser(args[1])==""){
							client.say(options.channels[0],args[1]+" doesn't exist.");
						}else if(userData.getUser(args[1]).rank()==Rank.PLEB){
							var file = readFile('/var/lib/openshift/583dc32f0c1e66954200003e/nodejs/twitch/Feeders_Society/cage.txt');
							var cageList = file.split(",");
							var newCageList = cageList.length>1 ? cageList[0]:"";	
							for(var i = 1;i<cageList.length;i++){
								if(cageList[i].toLowerCase()!=args[1].toLowerCase())
									newCageList = ","+newCageList[i];
							}
						}			
						client.say(options.channels[0],"The dildo was successfuly removed from "+args[1]+ " mouth!");
						io.writeFile('/var/lib/openshift/583dc32f0c1e66954200003e/nodejs/twitch/Feeders_Society/cage.txt', newCageList);
						break;
				}
			}
		
		if(currentUser.rank()==Rank.ADMIN){
			switch(args[0]){
				case "!start":
					if(args.length!=1)
						return;
					function puts(error, stdout, stderr) { sys.puts(stdout) }
					exec("aws ec2 start-instances --instance-ids i-0c0f8a9fda2f9f77b --region eu-west-1",puts);
					client.say(options.channels[0], "Server started!");
					break;
				case "!stop":
					if(args.length!=1)
						return;
					function puts(error, stdout, stderr) { sys.puts(stdout) }
					exec("aws ec2 stop-instances --instance-ids i-0c0f8a9fda2f9f77b --region eu-west-1",puts);
					client.say(options.channels[0], "Server stopped!");
					break;
				case "!mod":
					if(args.length!=2)
						return;
					var staffNames = getStaffNames1();
					var staffRanks = getStaffRanks();
					for(var i =0;i<staffNames.length;i++){
						if(staffNames[i]==args[1].toLowerCase()){
							client.say(options.channels[0],"Double mod? PogChamp");
							return;
						}
					}
					var staffFile = io.readFile('/var/lib/openshift/583dc32f0c1e66954200003e/nodejs/twitch/Feeders_Society/mods.txt');
					staffFile=staffFile.replace(/(\r\n|\n|\r)/gm,"");
					newStaffFile=staffFile+(args[1].toLowerCase()+ ".mod ");
					io.writeFile('/var/lib/openshift/583dc32f0c1e66954200003e/nodejs/twitch/Feeders_Society/mods.txt', newStaffFile);
					client.say(options.channels[0],"Welcome "+args[1]+" to the nazi army DatSheffy 7");		
					break;
				case "!unmod":
					if(args.length!=2)
						return;
					var staffNames = getStaffNames1();
					var staffRanks = getStaffRanks();
					for(var i =0;i<staffNames.length;i++){
						if(staffNames[i]==args[1].toLowerCase()){
							if(staffRanks[i]==Rank.MOD){
								var staffFile = io.readFile('/var/lib/openshift/583dc32f0c1e66954200003e/nodejs/twitch/Feeders_Society/mods.txt');
								staffFile = staffFile.replace(staffNames[i]+".mod","");
								staffFile = staffFile.replace(/ +/g, " ");
								io.writeFile('/var/lib/openshift/583dc32f0c1e66954200003e/nodejs/twitch/Feeders_Society/mods.txt', staffFile);
								client.say(options.channels[0],"Bye clown! DatSheffy");	
							}else if(staffRanks[i]==Rank.ADMIN){
								client.say(options.channels[0],"Nice try 4Head");
							}
						}
					}
					break;          
				case "!addcopypasta":
					if(args==1)
						return;
					var copypastaFile = io.readFile('/var/lib/openshift/583dc32f0c1e66954200003e/nodejs/twitch/Feeders_Society/copypasta.txt');
					var newMessage="";
					for(var i=1;i<args.length;i++){
						if(i==args.length-1)
							newMessage+=args[i];
						else
							newMessage+=args[i]+" ";
					}
					io.writeFile('/var/lib/openshift/583dc32f0c1e66954200003e/nodejs/twitch/Feeders_Society/copypasta.txt', copypastaFile + "~" + newMessage); 
					client.say(options.channels[0],"Copypasta added!");
					break;
				case "!addb":
					var banWordFile = io.readFile('/var/lib/openshift/583dc32f0c1e66954200003e/nodejs/twitch/Feeders_Society/bannedwords.txt');
					var newMessage = message.replace(args[0],"").trim();
					if(banWordFile!=""){
						newMessage = "~"+ newMessage;
					}
					io.writeFile('/var/lib/openshift/583dc32f0c1e66954200003e/nodejs/twitch/Feeders_Society/bannedwords.txt', banWordFile + newMessage);
					client.say(options.channels[0],newMessage+" has been added to the banword list!");
					break;
				case "!removeb":
					if(args.length!=2)
						return;
					var banWordFile = io.readFile('/var/lib/openshift/583dc32f0c1e66954200003e/nodejs/twitch/Feeders_Society/bannedwords.txt');
					if(file==""){
						client.say(options.channels[0],"The file is empty");	
						return;
					}
					var newMessage=message.replace(args[0],"").trim();
					var bannedWordsList = banWordFile.split("~");
					var word="";
					var findWord = false;
					for(var j=0;j<bannedWordsList.length;j++){
						if(bannedWordsList[j].toLowerCase()!=newMessage.toLowerCase()){
							if(word=="")
								word=bannedWordsList[j];	
							else
								word+="~" + bannedWordsList[j];		
						}
						else{
							findWord = true;	
						}
					}
					if(findWord){
						io.writeFile('/var/lib/openshift/583dc32f0c1e66954200003e/nodejs/twitch/Feeders_Society/bannedwords.txt', word);	
						client.say(options.channels[0],newMessage+" successfuly removed from the list!");	
					}
					else
						client.say(options.channels[0],"Didn't find the given banword, type !b to see more info");
					break;
				case "!b":
					if(args.length!=1)
						return;
					var banWordFile = io.readFile('/var/lib/openshift/583dc32f0c1e66954200003e/nodejs/twitch/Feeders_Society/bannedwords.txt');
					var str = banWordFile.replace(/~/g, ", ");
					var re = new RegExp("~", "g");
					client.say(options.channels[0],"Banned words: " + str.replace(re, ", "));	
					break;
				case "!newdefuseword":
					var defuseFile = io.readFile('/var/lib/openshift/583dc32f0c1e66954200003e/nodejs/twitch/Feeders_Society/defuse.txt');
					io.writeFile('/var/lib/openshift/583dc32f0c1e66954200003e/nodejs/twitch/Feeders_Society/defuse.txt', defuseFile + "~"+args[1]);
					client.say(options.channels[0],"Defuse word has been added ANELE");
					break;
			}
					
		}
	});


client.on("whisper", function (user,userstate,message, self) {
	var args = message.split(" ");
	userData.checkUser(user.substring(1));
	var currentUser = userData.getUser(user.substring(1));
	if(args.length==1&&args[0]=="!commands"){
	if(currentUser.rank() == Rank.TRUSTED){
		client.whisper(user,"http://pastebin.com/wsZ48eGH");
	}else if(currentUser.rank() == Rank.MOD){
		client.whisper(user," http://pastebin.com/t6Ww0NRv");
	}else if(currentUser.rank() == Rank.ADMIN){
		client.whisper(user,"http://pastebin.com/eN65Kh0e");
	}else{
		client.whisper(user,"http://pastebin.com/fkdLB8x8");
	}
	}
	if(args.length==3&&args[0]=="!minvite"){
		if(currentUser.rank()!=Rank.ADMIN)
			return;
		chatState.massInvite.active=false;
		var k=0;
		client.whisper(user,"Mass invite "+args[1]+" channel started successfully!");
		preparation();
		function preparation(){
			client.api({
			url: "http://tmi.twitch.tv/group/user/"+args[1].toLowerCase()+"/chatters"
			}, function(err, res, body) {		
				var viewSize=Object.size(body.chatters.viewers);
				var j=0;
				if(viewSize==0){
					client.whisper(user,"No viewers found.");
					return;
				}
				invite();
				function invite(){
					if(chatState.massInvite.cancel){
						chatState.massInvite.cancel=false;
						client.whisper(user,"Mass invite got canceled by an admin.");
						return;
					}
					for(var i=0;i<chatters.length;i++){
						if(j==viewSize){
							k++;
							if(k<args[2]){
								client.whisper(user,"Round "+k+" has been finished. Commensing round "+(k+1));
								preparation();
								return;
							}else{
								chatState.massInvite.active=true;
								client.whisper(user,"Mass invite has been finished!");
								return;
							}
						}
						if(chatters[i].toLowerCase()==body.chatters.viewers[j].toLowerCase()){
							console.log(body.chatters.viewers[j].toLowerCase()+ " skipped");
							j++;
							invite();
							return;
						}
					}
					chatters.push(body.chatters.viewers[j].toLowerCase());
					request.post('http://chatdepot.twitch.tv/room_memberships?oauth_token=' + '9nuugphd8bho90f8kefpt0zunau95f',
					{ form: { 'irc_channel': "_smileyfacebot_1487793035652", 'username': body.chatters.viewers[j].toLowerCase()} },
					function (error, response, body) {
					});
					console.log(body.chatters.viewers[j].toLowerCase()+ " has been added and invited");
					j++;
					setTimeout(function(){ invite();}, 1000);
					return;
				}
				
			});
		}
	}else if(args.length==1&&args[0]=="!abortinvite"){
		if(currentUser.rank()!=Rank.ADMIN){
			return;
		}
		if(!chatState.massInvite.cancel)
			chatState.massInvite.cancel=true;
	}else if(args.length>1&&args[0]=="!g"){
		if(currentUser.rank()!=Rank.ADMIN||args[1].indexOf("/")>-1){
			return;
		}
		if(args.length>1&&args[0]=="!g"){
				var res = message.replace("!g","");
				client.say(options.channels[0],res);
		}
	}	
});


function timeout(Pleb,username){
	client.timeout(options.channels[0], username, Pleb.penalty);
	client.say(options.channels[0],username + " you need to chill a bit mate 4Head , your price is " + Pleb.penalty + " tucks KappaPride");
	if(Pleb.penalty==60)
		setTimeout(function(){Pleb.penalty = 60;}, 1000*43200);				
	Pleb.penalty *= 2;			
	return;
}  

function botTrigger(message){
	if(message.toLowerCase().indexOf("triangletucker")> -1&&!botTimeout){
		client.say(options.channels[0],"Are you talking about me? Kappa");
		botTimeout=true;
		setTimeout(function(){ botTimeout=false;}, 1000*60*10);
		return;
	}
	
	if(message.toLowerCase().indexOf("trianglebot")>-1&&!triangleBotTimeout){
		client.say(options.channels[0],"EleGiggle PLEBS EleGiggle STILL EleGiggle TALK EleGiggle ABOUT EleGiggle TRIANGLEBOT EleGiggle IN EleGiggle 2K16 EleGiggle");
		triangleBotTimeout=true;
		setTimeout(function(){triangleBotTimeout=false;}, 1000*60*10);
		return;
	}
}

function naziTrain(arg){
		for(var j=0; j<arg.length;){
			var n = arg[j].indexOf('.');
			if(arg[j].substring(n+1)=="admin"){
				client.say(options.channels[0],arg[j].substring(0,n)+ " DatSheffy /");	
			}
			j++;
		}
		for(var i=0; i<arg.length;i++){
			var n = arg[i].indexOf('.');
			if(arg[i].substring(n+1)=="mod"){
				client.say(options.channels[0],arg[i].substring(0,n)+ " DatSheffy 7");
			}
			j++;
		}
}
