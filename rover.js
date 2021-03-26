class Rover {
   constructor(position, mode, generatorWatts = 110) {
     this.position = position,
     this.mode = "Normal",
     this.generatorWatts = generatorWatts;
   }

   receiveMessage(message) {
     let output = {
       message: message.name,
       results: message.commands.map(function(command) {
         if (command.commandType == "STATUS_CHECK") {
           return {
             completed: true,
             roverStatus: {
               mode: this.mode,
               generatorWatts: this.generatorWatts,
               position: this.position
             }
           }
         } else if (command.commandType == "MODE_CHANGE") {
           this.mode = command.value;
           return {
             completed: true,
           }
         } else if (command.commandType == "MOVE") {
           if (this.mode == "LOW_POWER") {
             return {
               completed: false
             }
           } else {
             this.position = command.value;
             return {
               completed: true
             }
           }
         }
       }, this)
     }
     return output;
   }
}

module.exports = Rover;