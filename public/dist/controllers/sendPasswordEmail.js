"use strict";
const { PythonShell } = require('python-shell');
const options = {
    args: ['TypeScriptUser']
};
PythonShell.run('../model/sendPasswordEmail.py', options, (error, results) => {
    if (error)
        throw error;
    if (results) {
        console.log('Python output:', results.join('\n'));
    }
    else {
        console.log('Python script executed successfully with no output.');
    }
});
