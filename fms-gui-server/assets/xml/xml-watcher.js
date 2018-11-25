/**
 * This file handles the fms xml files and gives all listeners feedback, if there is a new XML file
 * and returns its content
 */

const chokidar = require('chokidar');

const watcher = chokidar.watch("./assets/xml");

watcher.on('add', (file) => {
    console.log(file + " was created");
});

watcher.on('change', (file) => {
   console.log(file + " was modified");
});

watcher.on('unlink', (file) => {
    console.log(file + " was deleted");
});