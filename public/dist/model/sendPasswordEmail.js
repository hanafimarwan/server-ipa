"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.send_Email = void 0;
const child_process_1 = require("child_process");
function send_Email(sender_email, sender_password, recipient_email, subject, body) {
    return new Promise((resolve, reject) => {
        const command = `python src/model/sendPasswordEmail.py "${sender_email}" "${sender_password}" "${recipient_email}" "${subject}" "${body}"`;
        (0, child_process_1.exec)(command, (error, stdout, stderr) => {
            if (error) {
                reject(`Error: ${error.message}`);
                return;
            }
            if (stderr) {
                reject(`Stderr: ${stderr}`);
                return;
            }
            try {
                const output = JSON.parse(stdout);
                resolve(output.result);
            }
            catch (parseError) {
                reject(`Parsing Error: ${parseError}`);
            }
        });
    });
}
exports.send_Email = send_Email;
