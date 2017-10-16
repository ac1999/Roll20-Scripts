
//Example Command: !uhd bob 1

on('chat:message', function (msg) {
    if(msg.type === "api" && !msg.rolltemplate) {
        var cmds = ["uhd","uhdh"];
        var params = msg.content.substring(1).split(" ");
		var paramsFlag = false;
		if(isNaN(params[2]) != true || isNaN(params[3]) != true || isNaN(params[4]) != true)
		{
				var command = params[0].toLowerCase();
				var fName = params[1].toLowerCase();
				var nName = params[2].toLowerCase();
				if(isNaN(nName)){
					var lName = params[3] ? params[3].toLowerCase() : false;
					if(isNaN(lName)){
						if(isNaN(params[4]) != true){
							var amount = params[4] ? params[4].toLowerCase() : false;
						}
						else{
							paramsFlag = true;
						}
					}
					else{
						var amount = params[3] ? params[3].toLowerCase() : false;
					}
				}
				else{
					var amount = params[2] ? params[2].toLowerCase() : false;
				}
				if(cmds.indexOf(command) > -1 && paramsFlag == false){
					handleCommands(msg,command,amount);
				}
		}
		else{
			paramsFlag = true;
		}
		if(paramsFlag == true)
		{
			sendChat(msg.who, "/w gm Error: No amount entered.");
		}
    }
});


var globalFlag = false;

var handleCommands = function (msg,command,amount){
    if(command === "uhd"){
        uhd(msg,amount);
    }
	else if(command === "uhdh"){
		uhdh(msg,amount);
	}

};

var uhd = function (msg,amount){
    
    var character = getChar(msg);
	if(character != undefined){
		var hitDieFinal = findObjs({type: 'attribute', characterid: character.id, name: "hitdietype"}, {caseInsensitive: true})[0];
		var modCon = findObjs({type: 'attribute', characterid: character.id, name: "constitution_mod"}, {caseInsensitive: true})[0];
		hitDieFinal = hitDieFinal.get("current");
		modCon = modCon.get("current");
		var finalCon = parseInt(modCon)*amount;
		sethitdie(msg,amount);
		if(globalFlag == false){
			sendChat(msg.who,"&{template:simple} {{rname="+amount.toString()+"x Hit Dice}} {{mod="+finalCon+"}} {{r1=[["+amount+"d"+hitDieFinal+"+"+finalCon +"]]}} {{normal=1}} {{charname="+character.get("name")+"}}");
		}
		else{
			sendChat(msg.who,"/w gm Error: You do not have enough Hit die to spend.");
		}
	}
	else{
		sendChat(msg.who, "/w gm Error: Character not defined.");
	}
}

var uhdh = function (msg,amount){
    sethitdie(msg,amount);
    if(globalFlag ==  true){
        sendChat(msg.who,"/w gm Error: You do not have enough Hit die to spend.");
    }
}

var getChar = function (msg){
    var getname = msg.content.substring(1).split(" ");
    var charname = "";
	var charfname = getname[1];
	var charnname = getname[2];
	var charlname = getname[3];
	if(isNaN(charnname)){
	    if(isNaN(charlname)){
	        charname = charfname + " " + charnname + " " + charlname;
	    }
	    else{
	        charname = charfname + " " + charnname;
	    }
	}
	else{
	    charname = charfname;
	}
	var character = findObjs({name: charname, type: "character"}, {caseInsensitive: true})[0];
	return character;
}

var sethitdie = function (msg,amount){
    var character = getChar(msg);
	if(character != undefined){
		var hitdiec = getAttrByName(character.id, "hit_dice");
		var hitdie = findObjs({type: 'attribute', characterid: character.id, name: "hit_dice"}, {caseInsensitive: true})[0];
		if(hitdiec-amount >= 0){
			hitdie.set({current: hitdiec-amount});
			globalFlag = false;
		}
		else{
			globalFlag = true;
		}
	}
	else{
		sendChat(msg.who, "/w gm Error: Character not defined.");
	}
} 
