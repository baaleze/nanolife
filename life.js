#! /usr/bin/env node
var fs = require('fs');
var n = require('neataptic');

// build dataset
var LIMIT = 1000;

var dataset = [];
var text = fs.readFileSync('lexicon.txt','utf8');
// unique characters
var characters = text.split('').filter(function(item, i, ar){ return ar.indexOf(item) === i; });
var inputSize = characters.length;
/** One-hot encode them */
var onehot = {};

for(var i = 0; i < characters.length; i++){
  var zeros = Array.apply(null, Array(characters.length)).map(Number.prototype.valueOf, 0);
  zeros[i] = 1;

  var character = characters[i];
  onehot[character] = zeros;
}

var previous = text[0];
for(var i = 1 ; i < LIMIT; i++){ //for(var i = 1 ; i < text.length; i++){
  var next = text[i];

  dataset.push({ input: onehot[previous], output: onehot[next] });
  previous = next;
}

// build network
var network = new n.architect.LSTM(inputSize,200,inputSize);

// train
network.train(dataset, {
    log: 1,
    rate: 0.1,
    error: 0.1,
    clear: true
});


    var next = 'u';
    var count = 0;
    var sentence = '';
    while(next !== '.' && count < 200) {
        output = network.activate(onehot[next]);
        var max = Math.max.apply(null, output);
        var index = output.indexOf(max);

        var zeros = Array.apply(null, Array(characters.length)).map(Number.prototype.valueOf, 0);
        zeros[index] = 1;

        next = Object.keys(onehot).find(key => onehot[key].toString() === zeros.toString());
        sentence = sentence + next;
        count++;
    }
    console.log(sentence);


