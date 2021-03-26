const Rover = require('../rover.js');
const Message = require('../message.js');
const Command = require('../command.js');


describe("Rover class", function() {

  it("constructor sets position and default values for mode and generatorWatts", function() {
    let rover = new Rover(18);
    expect(rover.mode).toEqual("Normal");
    expect(rover.generatorWatts).toEqual(110);
  })

  it("response returned by receiveMessage contains name of message", function() {
    let command = [new Command("STATUS_CHECK")];
    let message = new Message("Test Message", command);
    let rover = new Rover(18);
    expect(rover.receiveMessage(message).message).toEqual("Test Message");

  })

  it("response returned by receiveMessage includes two results if two commands are sent in the message", function() {
    let commands = [new Command("Mode_Change", "Low_Power"), new Command("Status_Check")];
    let message = new Message("Test", commands);
    let rover = new Rover(18);
    expect(rover.receiveMessage(message).results.length).toEqual(2);
  })

  it("responds correctly to status check command", function() {
    let command = [new Command("STATUS_CHECK")];
    let message = new Message("Test", command);
    let rover = new Rover(20);
    expect(rover.receiveMessage(message).results[0].roverStatus.mode).toEqual("Normal");
    expect(rover.receiveMessage(message).results[0].roverStatus.generatorWatts).toEqual(110);
    expect(rover.receiveMessage(message).results[0].roverStatus.position).toEqual(20);
  })

  it("responds correctly to mode change command", function() {
    let command = [new Command("MODE_CHANGE", "LOW_POWER")];
    let message = new Message("Test", command);
    let rover = new Rover(25);
    rover.receiveMessage(message);
    expect(rover.mode).toEqual("LOW_POWER");
    expect(rover.receiveMessage(message).results[0]).toEqual({completed: true});
  })

  it("responds with false completed value when attempting to move in LOW_POWER mode", function() {
    let command = [new Command("MODE_CHANGE", "LOW_POWER")];
    let message = new Message ("Test", command);
    let rover = new Rover(30);
    rover.receiveMessage(message);
    let nextCommand = [new Command('MOVE', 50)];
    let nextMessage = new Message ("Testing", nextCommand)
    expect(rover.receiveMessage(nextMessage).results[0]).toEqual({completed: false});
  })

  it("responds with position for move command", function(){
    let rover = new Rover(0);
    let command = [new Command("MOVE", 75)];
    let message = new Message("Test", command);
    rover.receiveMessage(message);
    expect(rover.position).toEqual(75);
  })

});
