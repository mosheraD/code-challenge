const fs = require('fs');
// Parse cli arguments.
var args = process.argv.slice(2);
// Parse command.
var command = args[0];
var storeFile = 'data.json';
var defaultStore = {'table':[]};

var storeObject = readStore(storeFile); 

switch (command) {
    case 'add':
      add(args[1], args[2]);
      break;
    case 'list':
      list();
      break;
    case 'get':
      get(args[1]);
      break;
    case 'remove':
      remove(args[1]);
      break;
    case 'clear':
      clear();
      break;
    case 'help':
      outputHelpText();
      break;
    default:
      console.log('Invalid argument: add, list, get, clear, reset, help');
      outputHelpText();
  }
  // Outputs help text.
function outputHelpText() {
    console.log('OPTIONS:');
    console.log('store add mykey myvalue');
    console.log('store list');
    console.log('store get mykey');
    console.log('store remove mykey');
    console.log('store clear');
  
  }

  // Reads key/value store from file.
function readStore(storeFile) {
    var data = fs.readFileSync(storeFile, 'utf8', function(error) {
      if (error) {
        console.log('Unable to read store file: ' + error);
        console.log('Cleaning and resetting store file.')
      }
    });
    return JSON.parse(data);
  }

  // Persists in-memory store to file.
function writeStore() {
    var json = JSON.stringify(storeObject);
    fs.writeFileSync(storeFile, json, 'utf8', function(error) {
      if (error) {
        console.log('Unable to add key/value pair: ' + error);
      } else {
        console.log('Successfully wrote store file.');
      }
    });
  }
  // Reset store to empty state.
function resetStore() {
    var json = JSON.stringify(defaultStore);
    fs.writeFileSync(storeFile, json, 'utf8', function(error) {
      if (error) {
        console.log('Cannot write to store file: ' + error);
      } else {
        console.log('Successfully reset store file.');
      }
    });
  }
  // Add new key/value entry.
  function add(key, value) {
    storeObject.table.push({'key': key, 'value': value});
    writeStore();
  }
  // List all key/value entries.
function list() {
    storeObject.table.forEach(function(item) {
      console.log(item['key'] + ' ' + item['value']);
    });
  }
  // Get all key/value entries matching key.
  function get(key) {
    console.log('Searching for: ' + key);
    storeObject.table.forEach(function(item) {
      if (item['key'] === key) {
        console.log(item['value']);
      } 
    });
  }
  // Remove all key/value entries matching key.
  function remove(key) {
    var count = 0;
    storeObject.table.forEach(function(item, index, object) {
      if (item['key'] === key) {
        object.splice(index, 1);
        count++;
      } 
    });
    writeStore();
    console.log('Removed ' + count + ' instances.');
  }
  // Restore empty key/value store.
  function clear() {
    resetStore();
  }