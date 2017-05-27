var irc = require("tmi.js");
var request = require('request');
var sys = require('sys')
var exec = require('child_process').exec;

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
        username: "TriangleTucker",
        password: "oauth:yi7mixgn9tyk4ywpkzykrq1gavq672"
    },
    channels: ["_triangletucker_1453389902311"]
};
var options1 ={
    options: {
        debug: true
    },
    connection: {
		cluster: "aws",
        reconnect: false,	
		preferredServer: '199.9.253.119', 
		preferredPort: '6667'
    },
    identity: {
        username: "trianglewhisper",
        password: "oauth:4o0m410o2j5sbuegayv75kfsbjseih"
    },
    channels: ["_triangletucker_1453389902311"]
};
var client = new irc.client(options);
// Connect the client to the server..
client.connect();
var whisperClient = new irc.client(options1);
whisperClient.connect();
process.stdin.resume (); 
process.stdin.setEncoding ('utf8'); 
process.stdin.on ('data',function(str){eval(str)});
var fs = require('fs');
var r9k = false;
var plebCD=true;
var mine = -1;
var guess = 0;
var winTimeout;
var disArm=false;;
var disPleb="";
var trigger="";
var botTimeout=false;
var modCD=true;
var triangleBotTimeout=false;
var slap=true;
var chatters=[];
var minviteAccess=true;
var cinvite=false;
var modTXT = readFile('/home/ubuntu/twitch/mods.txt');
var modList = modTXT.split(" ");
var savePoints = false;
function pleberino(user) {
    	this.user = user;
   	this.count = 0;
	this.longCount = 0;
	this.penalty = 60;
	this.timeout = "";
	this.active = false;
	this.cd=false;
	this.talk=0;
	this.points=0;
}
var activePlebArray=[];
var plebArray=[];
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};	

client.on("chat", function (channel, user, message, self) {
	if(self)
		return;
	//recordLog(user.username,message);
	checkUser(user.username);
	var mesArray = message.split(" ");
	var rank = getRank(modList,user.username);
	
	if(silencePolice(user.username))
		return;
		
	if(rank==""||rank=="clown"){
		if(bannedWords(message, user.username,rank))
			return;
		}
		
	
	if(guessingGame(mesArray,user.username))
		return;
	
	mineGame(user.username,message);
	
	botTrigger(message);
	
	SpamPolice(user.username,rank);
	
	if(!savePoints){
		savePoints=true;
		setTimeout(function(){savePointsFile();savePoints=false;}, 900000);
}
		
		   var plebObject;
		for(var j=0;j<plebArray.length;j++){
			if(plebArray[j].user.toUpperCase() == user.username.toUpperCase()){
				if(plebArray[j].cd)
					return;
				if(plebArray[j].talk==4){
					plebArray[j].talk=0;
					addPoints(1,user.username);	
				}
				else
					plebArray[j].talk=plebArray[j].talk+1;
				
				plebObject = plebArray[j];
			}
		}
	
		if(mesArray.length==1 && mesArray[0]=="!fire"){
					var plebs=[];
					for(var j=0;j<plebArray.length;j++){
						var Pleb = plebArray[j];
						var rank = getRank(modList,Pleb.user);
						if(rank=="clown"&&Pleb.active)
							plebs.push(Pleb.user);
					}
					if(plebs.length==0){
					client.say(options.channels[0],"No active clowns detected LUL");	
					return;
					}
				var targetPleb=plebs[Math.floor(Math.random()*plebs.length)];
				client.timeout(options.channels[0],targetPleb,5);
				client.say(options.channels[0],targetPleb + " met his final end SMSkull");
				plebObject.cd=true;
				setTimeout(function(){plebObject.cd=false;}, 5000);
				return;
		}
			if(rank=="clown"){
				if(mesArray.length==1 && mesArray[0]=="!commands"){
					client.say(options.channels[0],"Clown commands--> [!fire]");
					plebObject.cd=true;
					setTimeout(function(){plebObject.cd=false;}, 30000);
			}
			return;
			}
			switch(mesArray[0]){
				case "!clowns":
					if(mesArray.length!=1)
						return;
					client.say(options.channels[0],"Salute to our honorable entertainers ( ͡° ͜◯ ͡°) 7 "+getStaffMembers(modList,"clown")+" \\ (°͡ O͜ °͡ )");
					break;
				case "!banish":
					if(mesArray.length!=1)
						return;
						client.ban(options.channels[0],"scamazishere");
						client.say(options.channels[0],"SCAMAZ has been banished FeelsGoodMan");
						plebObject.cd=true;
						setTimeout(function(){plebObject.cd=false;}, 5000);
					break;
				case "!online":
					if(mesArray.length!=1)
						return;
					client.api({
						url: "http://tmi.twitch.tv/group/user/_triangletucker_1453389902311/chatters"
						}, function(err, res, body) {
							client.say(options.channels[0],"Online plebs: " + body.chatter_count);
						});
						plebObject.cd=true;
						setTimeout(function(){plebObject.cd=false;}, 5000);
					break;
				case "!check":
					if(mesArray.length!=3)
						return;
					client.api({
						url: "http://tmi.twitch.tv/group/user/"+mesArray[2].toLowerCase()+"/chatters"
						}, function(err, res, body) {
							
							var viewSize=Object.size(body.chatters.viewers);
							for(var i =0;i<viewSize;i++){
								if(mesArray[1].toLowerCase()==body.chatters.viewers[i].toLowerCase()){
									client.say(options.channels[0],"GOT HIM! PogChamp");
									return;
								}
							}
							client.say(options.channels[0],mesArray[1] + " isn't here");
						});
						plebObject.cd=true;
						setTimeout(function(){plebObject.cd=false;}, 5000);
						break;
				case "!copypasta":
					if(mesArray.length!=1)
						return;
					var copypastaFile = readFile('/home/ubuntu/twitch/copypasta.txt');
					var array = copypastaFile.split("~");
					client.say(options.channels[0], array[Math.floor(Math.random() * array.length)]);
					plebObject.cd=true;
					setTimeout(function(){plebObject.cd=false;}, 5000);
					break;
				case "!eyestaff":
					if(mesArray.length!=1)
						return;
					client.say(options.channels[0],	"Admins: "+getStaffMembers(modList,"admin")+"deIlluminati Mods: "+ getStaffMembers(modList,"mod")+
					"deIlluminati Trusted: "+getStaffMembers(modList,"trusted"));
					plebObject.cd=true;
					setTimeout(function(){plebObject.cd=false;}, 5000);
					break;
				case "!cvpnudes":
					client.say(options.channels[0],"http://i.imgur.com/4VuDB.gif");
					break;
				case "!silvernudes":
					if(mesArray.length!=1)
						return;
					client.say(options.channels[0],"http://i.imgur.com/9d4azpO.png that's my Daddy gachiGASM");
					plebObject.cd=true;
					setTimeout(function(){plebObject.cd=false;}, 5000);
					break;
				case "!roulette":
					if(mesArray.length!=1)
						return;
					if(Math.floor(Math.random()*3)==0){
						client.say(options.channels[0],"SAVED! KappaRoss");
						addPoints(3,user.username);
					}else{
						client.timeout(options.channels[0], user.username, 60);
						client.say(options.channels[0],user.username+" got shot! 🔫 TriHard");
						addPoints(-1,user.username);
					}
					plebObject.cd=true;
					setTimeout(function(){plebObject.cd=false;}, 5000);
					break;
				case "!suckfilver":
					if(mesArray.length!=1)
						return;
					client.say(options.channels[0], '▓▓▓▓▓▓▓▓▓▓▄ ░░▄▀▓▓▓▓▓▓'+user.username.toUpperCase()+'▓▓▓▓▓▓▀ ▄▀▓▓▓▓▓▓▄▓▓▓▓▓▓▓▄▓▓▓▓▓ ▓▓▓▓▓▓▄▄▀▄▄▌▓▐▄▄▀▄▄▓▓▓ ▓▓▓▓▄▀░░░░░▌▓▐░░░░░▀▄▓ ▓▓▄▀░░░▄▄▄▄▌▓▐▄▄▄▄░░░▀ ▄▀░░▐▄▀▀▒▒▒▀▄▀▒▒▒▀▀▄▌░ █░░░█▌▒▒▒▒▒▒▒▒▒▒▒▒▒▐█░ █░░█▀▌▒▒▒SILVER▒▒▒▐▀█ ▌▄▀▒▄▀▄▒▒▒▒▒▒▒▒▒▒▒▄▀▄▒ ▐▒▒▐░░░▀▌▒▒▒▌▒▒▒▐▀░░░▌ █▒▒▀▄░░░▌▒▒▒▒▒▄██▄░░▄▀ ░▀▄▒▒▀▄░▌▒▒▒▄▀▄▒▀██▀▒▒ ░░░▀▄▒▒▀▒▒▒▐▒▒▒▒▄▒██▄▀ ░░░░░▀▄▄▄▄▄▐▒▄█▒▒▄▀▀░░');
					plebObject.cd=true;
					setTimeout(function(){plebObject.cd=false;}, 5000);
					break;
				case "!faq":
					if(mesArray.length!=1)
						return;

					client.say(options.channels[0],"This is just a twitch group chat. You were invited randomly to have fun chatting with others. Enjoy your stay :) Type !commands to get started!");
					plebObject.cd=true;
					setTimeout(function(){plebObject.cd=false;}, 5000);
					break;
				case "!commands":
					if(mesArray.length!=1)
						return;
					//var commonFile = readFile('/home/ubuntu/twitch/commands.txt');
					//var commonArray = commonFile.split(" ");
					//commonFile = iterateWord(commonArray,"[!","]");
					//var modFile="";
					if(rank=="trusted")
						client.say(options.channels[0],"http://pastebin.com/iLfc11iN");
					if(rank=="admin")
						client.say(options.channels[0],"http://pastebin.com/3S0JVzL7");
					if(rank=="mod")
						client.say(options.channels[0],"http://pastebin.com/ae4Gy4RY");
					if(rank=="")
						client.say(options.channels[0],"http://pastebin.com/2i5k8Y0F");
					/*if(rank=="mod"||rank=="admin"){
						var modFile = readFile('/home/ubuntu/twitch/modCommands.txt');
						var modArray = modFile.split(" ");
						modFile = iterateWord(modArray,"[!","]");
						client.say(options.channels[0],"Mod commands-->"+modFile + " ");
						}*/
						plebObject.cd=true;
						setTimeout(function(){plebObject.cd=false;}, 5000);
					break;
				case "!points":
					if(mesArray.length!=1)
						return;
					var points=0;
					for(var j=0;j<plebArray.length;j++){
						if(plebArray[j].user.toUpperCase() == user.username.toUpperCase()){
							var Pleb = plebArray[j];
							points = Pleb.points;	
						}	
					}	
							client.say(options.channels[0], user.username + " has "+ points + " points!");	   		
					break;
				case "!8ball":
					if(mesArray.length==1){
						client.say(options.channels[0],"!8ball [Type your yes/no question]?");
						return;
					}
					if(mesArray[mesArray.length-1].indexOf("?") == -1)
						return;
					var ball8File = readFile('/home/ubuntu/twitch/8ball.txt');
					var ball8Array = ball8File.split("~");
					var random = Math.floor(Math.random()*ball8Array.length);
					client.say(options.channels[0],ball8Array[random]);	
					plebObject.cd=true;
					setTimeout(function(){plebObject.cd=false;}, 5000);
					break;
				case "!active":
					if(mesArray.length!=1)
						return;
					var count="";
					for(var i = 0;i<plebArray.length;i++){
						if(plebArray[i].active)
							count++;	
					}
					client.say(options.channels[0],"Currently "+count+" active users.");
					plebObject.cd=true;
					setTimeout(function(){plebObject.cd=false;}, 5000);
					break;
				case "!active_users":
					if(mesArray.length!=1)
						return;
					var plebs="";
					for(var i = 0;i<plebArray.length;i++){
						if(plebArray[i].active)
							plebs += "["+plebArray[i].user+"] ";	
					}
					plebs.trim();
					client.say(options.channels[0],plebs);
					plebObject.cd=true;
					setTimeout(function(){plebObject.cd=false;}, 5000);
					break;
				case "!guess":
					if(mesArray.length!=1)
						return;
					var points=0;
					for(var j=0;j<plebArray.length;j++){
						if(plebArray[j].user.toUpperCase() == user.username.toUpperCase()){
							var Pleb = plebArray[j];
							points = Pleb.points;	
						}	
					}
					if(points>=5)
						addPoints(-5,user.username);
					else{
						client.say(options.channels[0],"You need 5 points to play this game!");
						return;					
					}
					if(guess==0){
						client.say(options.channels[0],"NO TIME TO EXPLAIN PICK A NUMBER BETWEEN 1 AND 10 QUICK! PogChamp");
						guess = Math.floor(Math.random() *10)+1;
						winTimeout = setTimeout(function(){ client.say(options.channels[0],"Chat is a bunch of turtles! KevinTurtle");guess=0}, 1000*5);
					}
					plebObject.cd=true;
					setTimeout(function(){plebObject.cd=false;}, 5000);
					break;
				case "!defuse":	
					if(mesArray.length!=1)
						return;
					if(mine>-1){
						mine=-2;
						var defuseFile = readFile('/home/ubuntu/twitch/defuse.txt');
						var defuseArray = defuseFile.split("~");
						disPleb=user.username;
						trigger = defuseArray[Math.floor(Math.random()*defuseArray.length)];
						var triggerWord="";
						for(var i=0;i<trigger.length;i++)
							triggerWord+= trigger.charAt(i)+"͏";
						var random = Math.floor(Math.random()*10);
						//client.say(options.channels[0],"Type in a word quickly when it displays on screen! If you type before, you get headshotted ༼ຈل͜ຈ༽ﾉ·︻̷̿┻̿═━一 ");
						client.say(options.channels[0],"Type in a word quickly when it displays on screen!");
						setTimeout(function(){disArm=true; client.say(options.channels[0],triggerWord);}, 1000*random);
					}else
					client.say(options.channels[0],"You must first place !mine in order to !defuse.");
					plebObject.cd=true;
					setTimeout(function(){plebObject.cd=false;}, 5000);
					break;
				case "!modorban":
					if(mesArray.length==1){
						client.say(options.channels[0],"!modorban [name]");	
						return;
					}			
					if(mesArray.length!=2)
						return;				
					client.say(options.channels[0],mesArray[1]+" you are now...");
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
					plebObject.cd=true;
					setTimeout(function(){plebObject.cd=false;}, 5000);
					break;
				case "!slap":	
					limitWordNumber(mesArray.length.length,1);
					if(mesArray.length==1 || 2 < mesArray.length)
						client.say(options.channels[0],"!slap [username]");
					else{
						client.say(options.channels[0],user.username+" slaps "+mesArray[1]+" ass* gachiGASM");
						slap=false;
						setTimeout(function(){ slap=true;}, 1000);
					}
					plebObject.cd=true;
					setTimeout(function(){plebObject.cd=false;}, 5000);
					break;
				case "!leave":
					if(mesArray.length!=1)
						return;
					client.say(options.channels[0],"@"+ user.username +" Leave tutorial: https://gyazo.com/48ea85225b0726e0c1df0a7258b63a0a");
					//client.say(options.channels[0],"@"+ user.username +" Leave tutorial: https://gyazo.com/48ea85225b0726e0c1df0a7258b63a0a");
					plebObject.cd=true;
					setTimeout(function(){plebObject.cd=false;}, 5000);
					break;						
			}
			if(rank=="mod"||rank=="admin"||rank=="trusted"){
			switch(mesArray[0]){
				case "!summon":
					if(mesArray.length!=1)
						return;
					client.unban(options.channels[0],"scamazishere");
					client.say(options.channels[0],"SCAMAZ HAS BEEN SUMMONED WutFace");
					plebObject.cd=true;
					setTimeout(function(){plebObject.cd=false;}, 5000);
					break;
				case "!mine":
					if(mesArray.length!=1)
						return;
					if(mine==-1){
						mine = Math.ceil(Math.random() *50);
						client.say(options.channels[0],"A mine has been planted! ANELE");
					}
					else{
						client.timeout(options.channels[0], user.username,60);
						client.say(options.channels[0], "@"+user.username+" ANELE twitchRaid KAPOW");
						mine = -1;
					}
					plebObject.cd=true;
					setTimeout(function(){plebObject.cd=false;}, 5000);
					break;
				case "!fagtrain":
					if(mesArray.length!=1)
						return;
					client.say(options.channels[0],"FAGG0TS COMING THROUGH! DansGame");	
					setTimeout(function(){ client.say(options.channels[0],"King FrankerZ King FrankerZ King FrankerZ King FrankerZ King FrankerZ");}, 500);
					setTimeout(function(){ client.say(options.channels[0],"Woj Woj Woj Woj Woj");}, 2*500);
					setTimeout(function(){ client.say(options.channels[0],"Kappa rino Kappa rino Kappa rino Kappa rino Kappa rino ");}, 3*500);
					setTimeout(function(){ client.say(options.channels[0],"WutFace Gubbyfish WutFace Gubbyfish WutFace Gubbyfish WutFace Gubbyfish WutFace Gubbyfish WutFace");}, 4*500);
					setTimeout(function(){ client.say(options.channels[0],"DansGame Creepydear DansGame Creepydear DansGame Creepydear DansGame Creepydear DansGame Creepydear");}, 5*500);	
					plebObject.cd=true;
					setTimeout(function(){plebObject.cd=false;}, 5000);
					break;
				case "!gaytrain":
					if(mesArray.length!=1)
						return;
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
					plebObject.cd=true;
					setTimeout(function(){plebObject.cd=false;}, 5000);
					break;
				case "!raffle":
					if(mesArray.length!=1)
						return;
					client.say(options.channels[0],"TYPE !raffle TO ENTER THE GIVEAWAY! PogChamp");
					plebObject.cd=true;
					setTimeout(function(){plebObject.cd=false;}, 5000);
					break;
				case "!gachiGASM":
					limitWordNumber(mesArray.length,1);
					setTimeout(function(){ client.say(options.channels[0],"gachiGASM");}, 500);
					setTimeout(function(){ client.say(options.channels[0],"gachiGASM gachiGASM");}, 500*2);
					setTimeout(function(){ client.say(options.channels[0],"gachiGASM gachiGASM gachiGASM");}, 500*3);
					setTimeout(function(){ client.say(options.channels[0],"gachiGASM gachiGASM gachiGASM gachiGASM");}, 500*4);
					setTimeout(function(){ client.say(options.channels[0],"gachiGASM gachiGASM gachiGASM");}, 500*5);
					setTimeout(function(){ client.say(options.channels[0],"gachiGASM gachiGASM");}, 500*6);
					setTimeout(function(){ client.say(options.channels[0],"gachiGASM");}, 500*7);
					plebObject.cd=true;
					setTimeout(function(){plebObject.cd=false;}, 5000);
					break;
				case "!spam":
					if(mesArray.length==1)
						return;
					var lastN = mesArray[mesArray.length-1];
					if(!isNaN(lastN)&&lastN<=10){
						var replace1 = message.replace(mesArray[0],"");
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
					plebObject.cd=true;
					setTimeout(function(){plebObject.cd=false;}, 5000);
					break;
				}
			}
		if(rank=="mod"||rank=="admin"){
			switch(mesArray[0]){
				case "!start":
					if(mesArray.length!=1)
						return;
				function puts(error, stdout, stderr) { sys.puts(stdout) }
				exec ("aws ec2 start-instances --instance-ids i-0c267d80 --region eu-west-1",puts);
				client.say(options.channels[0], "Server started!");
					break;
				case "!stop":
					if(mesArray.length!=1)
						return;
				function puts(error, stdout, stderr) { sys.puts(stdout) }
				exec ("aws ec2 stop-instances --instance-ids i-0c267d80 --region eu-west-1",puts);
				client.say(options.channels[0], "Server stopped!");
					break;
				case "!invite":
					if(mesArray.length!=2)
						return;
						request.post(
						'http://chatdepot.twitch.tv/room_memberships?oauth_token=' + 'yi7mixgn9tyk4ywpkzykrq1gavq672',
						{ form: { 'irc_channel': "_triangletucker_1453389902311", 'username': mesArray[1] } },
						function (error, response, body) {
						});
					client.say(options.channels[0], mesArray[1] +' has been successfully invited ' + 'deIlluminati 7');
					break;
				case "!t":
					if(mesArray.length!=3)
						return;
					userTargetRank = getRank(modList,mesArray[1].toLowerCase());	
					if(userTargetRank!=rank&&userTargetRank!="admin"&&!isNaN(mesArray[2])){
						client.timeout(options.channels[0], mesArray[1], mesArray[2]);
						client.say(options.channels[0], mesArray[1] +' has been tucked ' + mesArray[2] + ' times KappaPride')
					}
					break;
				case "!unban":
					if(mesArray.length!=2)
						return;
					client.unban(options.channels[0],mesArray[1].toLowerCase());
					client.say(options.channels[0],mesArray[1]+ ' recovered from autism! PogChamp');
					break;
				case "!trust":
					if(mesArray.length!=2)
						return;
					userTargetRank = getRank(modList,mesArray[1].toLowerCase());
					if(userTargetRank=="mod"||userTargetRank=="admin"||userTargetRank=="clown")
						return;
					if(userTargetRank==""){
						modTXT+=" " + mesArray[1].toLowerCase()+ ".trusted";
						fs.writeFile('/home/ubuntu/twitch/mods.txt', modTXT, function(err) {if (err !== null) { console.log ('Error reading file:'); console.log (err);}}); 
						client.say(options.channels[0],mesArray[1]+" is now a trusted user FeelsGoodMan");	
						modList = modTXT.split(" ");
					}else
						client.say(options.channels[0],"That user is already trusted");	
					break;
				case "!untrust":
					if(mesArray.length!=2)
						return;
					userTargetRank = getRank(modList,mesArray[1].toLowerCase());
					if(userTargetRank=="trusted"){
						modTXT = removeRank(modList,mesArray[1].toLowerCase());
						fs.writeFile('/home/ubuntu/twitch/mods.txt', modTXT, function(err) {if (err !== null) { console.log ('Error reading file:'); console.log (err);}});
						client.say(options.channels[0],"How could you FeelsBadMan");
						modList = modTXT.split(" ");
					}else
						client.say(options.channels[0],"He is already a pleb LUL");		
					break;
				case "!clown":
					if(mesArray.length!=2)
						return;
					userTargetRank = getRank(modList,mesArray[1].toLowerCase());
					if(userTargetRank=="mod"||userTargetRank=="admin")
						return;
					if(userTargetRank==""){
						modTXT+=" " + mesArray[1].toLowerCase()+ ".clown";
						fs.writeFile('/home/ubuntu/twitch/mods.txt', modTXT, function(err) {if (err !== null) { console.log ('Error reading file:'); console.log (err);}}); 
						client.say(options.channels[0],mesArray[1]+" welcome to the circus! ( ͡° ͜◯ ͡°)");	
						modList = modTXT.split(" ");
					}else
						client.say(options.channels[0],"That user is already a clown ( ͡° ͜◯ ͡°) /");	
					break;
				case "!unclown":
					if(mesArray.length!=2)
						return;
					userTargetRank = getRank(modList,mesArray[1].toLowerCase());
					if(userTargetRank=="mod"||userTargetRank=="admin"||userTargetRank=="trusted")
						return;
					if(userTargetRank=="clown"){
						modTXT = removeRank(modList,mesArray[1].toLowerCase());
						fs.writeFile('/home/ubuntu/twitch/mods.txt', modTXT, function(err) {if (err !== null) { console.log ('Error reading file:'); console.log (err);}});
						client.say(options.channels[0],"User transformed into a pleb, something to be proud of LUL");
						modList = modTXT.split(" ");
					}else
						client.say(options.channels[0],"He is already a pleb LUL");		
					break;
				case "!ban":
					if(mesArray.length!=2)
						return;
					userTargetRank = getRank(modList,mesArray[1].toLowerCase());
					if((rank=="admin" && userTargetRank!="admin") || userTargetRank==""){
						client.ban(options.channels[0],mesArray[1].toLowerCase());
						client.say(options.channels[0], mesArray[1] + " got autism and was sent to exclusive meme camp! RIP DatSheffy 7");
					}
					break;
				case "!clear":
					if(mesArray.length!=1)
						return;
					client.clear(options.channels[0]);
					client.say(options.channels[0],"DatSheffy GAS DatSheffy THE DatSheffy PLEBS DatSheffy");
					break;
				case "!r9k":
					limitWordNumber(mesArray,1);
					if(r9k){
						r9k=false;
						client.say(options.channels[0],"FREEDOM SwiftRage ");
					}
					else{
						r9k=true;
						client.say(options.channels[0],"╠═══╣All╠═══╣unique╠═══╣messages╠═══╣have╠═══╣been╠═══╣caged╠═══╣ TriHard ╠═══╣");
					}
					break;
				case "!silence":
					if(mesArray.length!=2)
						return;
					userTargetRank = getRank(modList,mesArray[1].toLowerCase());
					if((rank=="admin" && userTargetRank!="admin") || userTargetRank!="admin"){
						var file = readFile('/home/ubuntu/twitch/cage.txt');
						var newPleb ="";
					if(file=="")
						newPleb = mesArray[1];
					else
						newPleb = ","+mesArray[1];
					client.say(options.channels[0],mesArray[1]+" hole has been tightly sealed gachiGASM");
					fs.writeFile('/home/ubuntu/twitch/cage.txt', file + newPleb, function(err) {if (err !== null) { console.log ('Error reading file:'); console.log (err);}}); 
					}
					break;
				case "!unsilence":
					if(mesArray.length!=2)
						return;
					userTargetRank = getRank(modList,mesArray[1].toLowerCase());
					if((rank=="admin" && userTargetRank!="admin") || userTargetRank==""|| userTargetRank=="clown"){
						var file = readFile('/home/ubuntu/twitch/cage.txt');
						var cageList = file.split(",");
						var newCageList = cageList.length>1 ? cageList[0]:"";	
					for(var i = 1;i<cageList.length;i++){
						if(cageList[i].toUpperCase()!=mesArray[1].toUpperCase())
							newCageList = ","+newCageList[i];
					}			
					client.say(options.channels[0],"The dildo was successfuly removed from "+mesArray[1]+ " mouth!");
					fs.writeFile('/home/ubuntu/twitch/cage.txt', newCageList, function(err) {if (err !== null) { console.log ('Error reading file:'); console.log (err);}});   
					}
					break;
				}
		}
		if(rank=="admin"){
			switch(mesArray[0]){
				case "!nuke":
					if(mesArray.length!=1)
						return;
					client.say(options.channels[0],"TAKE COVER SwiftRage");	
						setTimeout(function(){ for(var i = 0;i<plebArray.length;i++){client.timeout(options.channels[0],plebArray[i].user,5);}}, 15000);
					
					break;
				case "!mod":
					if(mesArray.length!=2)
						return;
					userTargetRank = getRank(modList,mesArray[1].toLowerCase());
					if(userTargetRank==""){
						modTXT+=" " + mesArray[1].toLowerCase()+ ".mod";
						fs.writeFile('/home/ubuntu/twitch/mods.txt', modTXT, function(err) {if (err !== null) { console.log ('Error reading file:'); console.log (err);}}); 
						client.say(options.channels[0],"Welcome "+mesArray[1]+" to the nazi army DatSheffy 7");	
						modList = modTXT.split(" ");
					}else
						client.say(options.channels[0],"He is among us DatSheffy");	
					break;
				case "!unmod":
					if(mesArray.length!=2)
						return;
					userTargetRank = getRank(modList,mesArray[1].toLowerCase());
					if(userTargetRank!=""){
					modTXT = removeRank(modList,mesArray[1].toLowerCase());
					fs.writeFile('/home/ubuntu/twitch/mods.txt', modTXT, function(err) {if (err !== null) { console.log ('Error reading file:'); console.log (err);}});
					client.say(options.channels[0],"Bye clown DatSheffy 7");
					modList = modTXT.split(" ");
					}else
						client.say(options.channels[0],"He is already a pleb LUL");		
					break;
				case "!addcopypasta":
					if(mesArray==1)
						return;
					var copypastaFile = readFile('/home/ubuntu/twitch/copypasta.txt');
					var newMessage="";
					for(var i=1;i<mesArray.length;i++){
						if(i==mesArray.length-1)
						newMessage+=mesArray[i];
						else
						newMessage+=mesArray[i]+" ";
					}
					fs.writeFile('/home/ubuntu/twitch/copypasta.txt', copypastaFile + "~" + newMessage, function(err) {if (err !== null) { console.log ('Error reading file:'); console.log (err);}}); 
					client.say(options.channels[0],"Copypasta added!");
					break;
				case "!addb":
					var banWordFile = readFile('/home/ubuntu/twitch/bannedwords.txt');
					var newMessage=message.replace(mesArray[0],"").trim();
					fs.writeFile('/home/ubuntu/twitch/bannedwords.txt', banWordFile + "~"+ newMessage, function(err) {if (err !== null) { console.log ('Error reading file:'); console.log (err);}});
					client.say(options.channels[0],newMessage+" has been added to the banword list!");
					break;
				case "!removeb":
					if(mesArray.length!=2)
						return;
					var banWordFile = readFile('/home/ubuntu/twitch/bannedwords.txt');
					if(file==""){
						client.say(options.channels[0],"The file is empty");	
						return;
					}
					var newMessage=message.replace(mesArray[0],"").trim();
					var bannedWordsList = banWordFile.split("~");
					var word="";
					var findWord = false;
					for(var j=0;j<bannedWordsList.length;j++){
						if(bannedWordsList[j].toUpperCase()!=newMessage.toUpperCase()){
							if(word=="")
								word=bannedWordsList[j];	
							else
								word+="~" + bannedWordsList[j];		
						}
						else
						findWord = true;	
					}
					if(findWord){
						fs.writeFile('/home/ubuntu/twitch/bannedwords.txt', word, function(err) {if (err !== null) { console.log ('Error reading file:'); console.log (err);}});	
						client.say(options.channels[0],newMessage+" successfuly removed from the list!");	
					}
					else
					client.say(options.channels[0],"Didn't find the given banword, type !banwordlist to see more info");
					break;
				case "!b":
					if(mesArray.length!=1)
						return;
					var banWordFile = readFile('/home/ubuntu/twitch/bannedwords.txt');
					var str = banWordFile.replace(/~/g, ", ");
					var re = new RegExp("~", "g");
					client.say(options.channels[0],"Banned words: " + str.replace(re, ", "));	
					break;
				case "!newdefuse":
					var defuseFile = readFile('/home/ubuntu/twitch/defuse.txt');
					fs.writeFile('/home/ubuntu/twitch/defuse.txt', defuseFile + "~"+mesArray[1], function(err) {if (err !== null) { console.log ('Error reading file:'); console.log (err);}}); 
					client.say(options.channels[0],"Defuse word has been added ANELE");
					break;
			}
					
		}

});

whisperClient.on("whisper", function (user,userstate,message, self) {
	user = user.substring(1);
	var mesArray = message.split(" ");
	var rank = getRank(modList,user);
	if(rank=="admin"){
		if(mesArray.length==2&&mesArray[0]=="!ban"){
			client.ban(options.channels[0],mesArray[1].toLowerCase());
			whisperClient.whisper(user,"User banned.");
		}else if(mesArray.length==2&&mesArray[0]=="!unban"){
			client.unban(options.channels[0],mesArray[1].toLowerCase());
			whisperClient.whisper(user,"User unbanned."); 
		}else if(mesArray.length==3&&mesArray[0]=="!minvite"){
			minviteAccess=false;
			var k=0;
			whisperClient.whisper(user,"Mass invite "+mesArray[1]+" channel started successfully!");
			preparation();
			function preparation(){
			client.api({
				url: "http://tmi.twitch.tv/group/user/"+mesArray[1].toLowerCase()+"/chatters"
				}, function(err, res, body) {
					
					var viewSize=Object.size(body.chatters.viewers);
					var j=0;
					if(viewSize==0){
						whisperClient.whisper(user,"No viewers found.");
						return;
					}
					invite();
					function invite(){
						if(cinvite){
							cinvite=false;
							whisperClient.whisper(user,"Mass invite got canceled by an admin.");
							return;
						}
						for(var i=0;i<chatters.length;i++){
							if(j==viewSize){
								k++;
								if(k<mesArray[2]){
									whisperClient.whisper(user,"Round "+k+" has been finished. Commensing round "+(k+1));
									preparation();
									return;
								}else{
									minviteAccess=true;
									whisperClient.whisper(user,"Mass invite has been finished!");
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
						request.post('http://chatdepot.twitch.tv/room_memberships?oauth_token=' + 'yi7mixgn9tyk4ywpkzykrq1gavq672',
						{ form: { 'irc_channel': "_triangletucker_1453389902311", 'username': body.chatters.viewers[j].toLowerCase()} },
						function (error, response, body) {
						});
						console.log(body.chatters.viewers[j].toLowerCase()+ " has been added and invited");
						j++;
						setTimeout(function(){ invite();}, 1000);
						return;
					}
				
				});
			}
		}else if(mesArray.length==1&&mesArray[0]=="!cancelinvite"){
			if(!cinvite)
			cinvite=true;
		}
	}
	if(rank=="mod"||rank=="admin"){
	switch(mesArray[0]){
		case "!t":
		if(mesArray.length!=3)
			return;
		userTargetRank = getRank(modList,mesArray[1].toLowerCase());
			if(userTargetRank!=rank&&userTargetRank!="admin"&&!isNaN(mesArray[2])){
				client.timeout(options.channels[0], mesArray[1], mesArray[2]);
			}
		break;
		case "!invite":
			if(mesArray.length!=2)
				return;
				request.post(
				'http://chatdepot.twitch.tv/room_memberships?oauth_token=' + 'yi7mixgn9tyk4ywpkzykrq1gavq672',
				{ form: { 'irc_channel': "_triangletucker_1453389902311", 'username': mesArray[1] } },
				function (error, response, body) {
					if(error){
						whisperClient.whisper(user, mesArray[1] +"This user doesn't exist");
						return;
					}
					
				});
				whisperClient.whisper(user, mesArray[1] +' has been successfully invited ' + 'deIlluminati 7');
				break;
		case "!g":
			if(mesArray.length>1&&mesArray[0]=="!g"){
				var res = message.replace("!g","");
				client.say(options.channels[0],res);
			}
		break;
	}
}
});

function recordLog(username,message){
var logFile = readFile('/home/ubuntu/twitch/log.txt');
var str = username+": ";
fs.writeFile('/home/ubuntu/twitch/log.txt',"<p>"+logFile + str.bold() + message + " </p>", function(err) {if (err !== null) { console.log ('Error reading file:'); console.log (err);}}); 
}

function silencePolice(username){
	var file = readFile('/home/ubuntu/twitch/cage.txt');
	var cageList = file.split(",");
	for(var i = 0;i<cageList.length;i++){
		if(cageList[i].toUpperCase()==username.toUpperCase()){
			client.timeout(options.channels[0], cageList[i], 2);
			return true;
		}
	}
	return false;
}

function limitWordNumber(length,limit){
	if(length==limit)
		return true;
	return false;
}

function SpamPolice(username,rank){
	for(var j=0;j<plebArray.length;j++){
		if(plebArray[j].user.toUpperCase() == username.toUpperCase()){
			var Pleb = plebArray[j];
			if(Pleb.active){
				clearTimeout(Pleb.timeout);
				Pleb.timeout = setTimeout(function(){ Pleb.active=false; }, 1000*60*30);
			}else{
				Pleb.active = true;
				Pleb.timeout = setTimeout(function(){ Pleb.active=false; }, 1000*60*30);
			}
			
			Pleb.count++;
			Pleb.longCount++;
			
			console.log(Pleb.count);
			console.log(Pleb.longCount);
			
			if(Pleb.count==1 || Pleb.longCount==1){
				setTimeout(function(){ Pleb.count = 0;}, 1000*4);
				setTimeout(function(){Pleb.longCount = 0;}, 1000*9);
			}					
			if(rank=="admin"||rank=="mod"){
				if(Pleb.count==10 || Pleb.longCount==13){
					timeout(Pleb,username);
					return;
				}
			}
			if (rank=="trusted"){
				if(Pleb.count==8 || Pleb.longCount==11){
				timeout(Pleb,username);
				return;
				}
			}
			if (rank==""){
				if(Pleb.count==5 || Pleb.longCount==8){
				timeout(Pleb,username);
				return;
				}
			}
			if (rank=="clown"){
				if(Pleb.count==4 || Pleb.longCount==6){
				timeout(Pleb,username);
				return;
				}
			}
			return;
		
	}
	}
	plebArray.push(new pleberino(username));
	var position = plebArray.length-1;
		if(!userPointsExist(username.toLowerCase())){
			var pointsFile = readFile('/home/ubuntu/twitch/points.txt');
			pointsFile = pointsFile + username.toLowerCase() + " : " + "0"+"\n";
			fs.writeFile('/home/ubuntu/twitch/points.txt', pointsFile); 
		}else{
			plebArray[position].points=parseInt(getPoints(username));
}
		
	SpamPolice(username);	
	
}

function savePointsFile(){
	var pointsFile = readFile('/home/ubuntu/twitch/points.txt');
	var userArray = pointsFile.split("\n");
	var newPointsFile="";
	for(var i = 0; i < userArray.length; i++){
		var index = userArray[i].indexOf(":");
		for(var j = 0; j < plebArray.length; j++){
			if(userArray[i].substring(0,index-1).toLowerCase()==plebArray[j].user.toLowerCase())
				newPointsFile += plebArray[j].user.toLowerCase() + " : " + plebArray[j].points + "\n";
}
}
	if(newPointsFile=="")
		return;
		fs.writeFile('/home/ubuntu/twitch/points.txt', newPointsFile);
}

function timeout(Pleb,username){
	client.timeout(options.channels[0], username, Pleb.penalty);
	client.say(options.channels[0],username + " you need to chill a bit mate 4Head , your price is " + Pleb.penalty + " tucks KappaPride");
	if(Pleb.penalty==60)
		setTimeout(function(){Pleb.penalty = 60;}, 1000*43200);				
	Pleb.penalty *= 2;			
	return;
}

function mineGame(username,message){
		if(mine==-2&&disArm){
		mine=-1;
		if(trigger==message){
			if(disPleb==username){
			client.say(options.channels[0],username+" successfully defused a bomb! KappaCool");
			}else{
			client.timeout(options.channels[0],disPleb,30);
			client.say(options.channels[0],username +" was faster and "+ disPleb+" got KAPOW to SCAMAZ chamber WutFace");	
			}
		}else if(message.indexOf("͏")>-1){
			client.timeout(options.channels[0],username,60);
			client.say(options.channels[0],username +" nice copy and paste skills LUL");	
		}else{
			client.timeout(options.channels[0],username,30);
			client.say(options.channels[0],username+" types wrong and immediately gets KAPOW to Lirik Free Chat DansGame");
		}
		disArm=false;
		return;
	}else if(mine==-2&&!disArm){
		//client.timeout(options.channels[0],username,10);
		return;
	}
	
	if(mine==0){
		client.timeout(options.channels[0],username,60);
		client.say(options.channels[0],"@"+username+ " ANELE twitchRaid KAPOW ");
		mine = -1;
		return;
	}else if(mine>0){
		mine--;
	}
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

function guessingGame(mesArray,username){	
	if(guess!=0){
	if(mesArray.length==1 && mesArray[0]==guess){
		guess=0;
		clearTimeout(winTimeout);
		addPoints(15,username);
		client.say(options.channels[0], username+" guessed correctly and received 15 points! ⎝ PogChamp ⎠ ");
		return true;
	}
	if(!isNaN(mesArray[0]))
		return true;
	}
	return false;
}

function iterateWord(array, prefix, suffix){
	var word = '';
	for(var i=0;i<array.length;i++){
		if(array.length-1==i)
		 word+= prefix + array[i]+ suffix;
		else
		 word+= prefix + array[i]+ suffix+" ";		
	}
		return word;
}

function bannedWords(message, user,rank){
	var file = readFile('/home/ubuntu/twitch/bannedwords.txt');
	for(var j=0;j<message.length;j++){
		if((message[j].charCodeAt(0)<31 || message[j].charCodeAt(0)>127) && (r9k||rank=="clown")){
			client.timeout(options.channels[0], user, 30);
			return true;
		}
	}
	var banWordList = file.split("~");
	for(var i=0;i<banWordList.length;i++){
		if(message.toUpperCase().indexOf(banWordList[i].toUpperCase()) > -1){
			client.timeout(options.channels[0], user, 30);
			return true;
		}
	}
return false;
}

function getPoints(user){
	var pointsFile = readFile('/home/ubuntu/twitch/points.txt');
	var userArray = pointsFile.split("\n");
	var newPointsFile="";					
	for(var i = 0; i < userArray.length; i++){
	var index = userArray[i].indexOf(":");
		if(userArray[i].substring(0,index-1).toLowerCase()==user.toLowerCase()){
			return userArray[i].replace(user + " : ","");   
		}
	}
}	

function addPoints(value,user){
	for(var j=0;j<plebArray.length;j++){
		if(plebArray[j].user.toUpperCase() == user.toUpperCase()){
			var Pleb = plebArray[j];
			if((Pleb.Points+value)<0){
			Pleb.points = 0
			}
			else{
			Pleb.points = Pleb.points + value;
			}
			break;
		}
	}
/*
	var newPointsFile="";
	var newValue=0;
	for(var i = 0; i < userArray.length; i++){
		var index = userArray[i].indexOf(":");
		if(userArray[i].substring(0,index-1).toLowerCase()==user.toLowerCase()){
			var points = parseInt(userArray[i].replace(user + " : ",""));
			newValue = points + value;
			if(newValue<0)
				newPointsFile += user + " : " + 0 + "\n";
			else
				newPointsFile += user + " : " + newValue + "\n";
		}else
			newPointsFile += userArray[i]+"\n";		   
	}	
		fs.writeFile('/home/ubuntu/twitch/points.txt', newPointsFile);
*/	
}

function userPointsExist(user){
	var pointsFile = readFile('/home/ubuntu/twitch/points.txt');
	var userArray = pointsFile.split("\n");
	for(var i = 0; i < userArray.length; i++){
		var index = userArray[i].indexOf(":");
		if(userArray[i].substring(0,index-1).toLowerCase()==user.toLowerCase())
			return true;
	}
	return false;
}

function checkUser(user){
	var file = readFile('/home/ubuntu/twitch/users.txt');
	var fileArray = file.split(",");
	var newPleb ="";
	for(var i =0;i<fileArray.length;i++){
		if(fileArray[i].toLowerCase()==user.toLowerCase())
			return;
	}
	if(file=="")
		newPleb = user;
	else
		newPleb = ","+user
	client.say(options.channels[0], "Welcome "+ user + " to deIlluminati Boys chat. Type !faq to reveal your destiny! deIlluminati");
	fs.writeFileSync('/home/ubuntu/twitch/users.txt', file + newPleb);   
}

function naziTrain(arg){
	var j=0;
		for(; j<arg.length;){
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

function getStaffMembers(arg,rank){
	var staffRank="";
	for(var i=0; i<arg.length;i++){
		var n = arg[i].split('.');
		if(n[1].toLowerCase()==rank){
			staffRank += "["+n[0]+"] ";	
			}
		}
	return staffRank;
}

function getRank(arg,user){
var j = 0;
	for(; j<arg.length;j++){
		var plebArray= arg[j].split(".");
			if(plebArray[0].toLowerCase()==user.toLowerCase())
				return plebArray[1];	
		}
return "";		
}

function removeRank(arg,user){
var j = 0;
var newModList="";
	for(; j<arg.length;j++){
		var n = arg[j].indexOf('.');
			if(arg[j].substring(0,n)!=user){
			newModList+=arg[j]+" ";
			}
		}
return newModList.substring(0,newModList.length-1);		
}

function readFile(path){
return fs.readFileSync(path, 'utf8', function(err, data) {
if (err !== null) { 
console.log ('Error reading file:'); 
console.log (err); 
} 
});
}
