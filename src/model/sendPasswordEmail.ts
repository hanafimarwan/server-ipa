import { exec } from 'child_process';

export function send_Email(sender_email: string, sender_password: string, recipient_email: string, subject: string, body: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const command = `python src/model/sendPasswordEmail.py "${sender_email}" "${sender_password}" "${recipient_email}" "${subject}" "${body}"`;
        
        exec(command, (error, stdout, stderr) => {
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
            } catch (parseError) {
                reject(`Parsing Error: ${parseError}`);
            }
        });
    });
}
