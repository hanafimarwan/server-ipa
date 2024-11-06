import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import sys
import json
import os

def send_email(sender_email, sender_password, recipient_email, subject, body):
    # Set up the SMTP server
    smtp_server = 'smtp.gmail.com'
    smtp_port = 587

    # Create the email message
    message = MIMEMultipart()
    message['From'] = sender_email
    message['To'] = recipient_email
    message['Subject'] = subject
    message.attach(MIMEText(body, 'html'))  # Set content type to 'html'

    try:
        # Connect to the SMTP server and start TLS for security
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()

        # Login to the email account
        server.login(sender_email, sender_password)

        # Send the email
        server.sendmail(sender_email, recipient_email, message.as_string())
        
        # Return success response
        return json.dumps({"result": "Email sent successfully."})

    except Exception as e:
        # Return error response as JSON
        return json.dumps({"error": str(e)})

    finally:
        # Quit the server
        server.quit()

if __name__ == "__main__":
    # Read arguments from TypeScript
    sender_email = str(sys.argv[1])
    sender_password = str(sys.argv[2])
    recipient_email = str(sys.argv[3])
    subject = str(sys.argv[4])
    html_file_path = str(sys.argv[5])

    # Check if the HTML file exists
    if not os.path.isfile(html_file_path):
        print(json.dumps({"error": "HTML file not found."}))
        sys.exit(1)

    # Read the content of the HTML file
    with open(html_file_path, 'r') as file:
        body = file.read()  # Read the HTML content

    # Call the send_email function and print the result
    result = send_email(sender_email, sender_password, recipient_email, subject, body)
    print(result)  # This will now print valid JSON
