import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from fastapi import BackgroundTasks
from dotenv import load_dotenv
import os

load_dotenv()


class EmailService:
    def __init__(self):
        self.smtp_server = "smtp.gmail.com"
        self.smtp_port = 587
        self.sender_email = os.getenv("GMAIL_USER")
        self.sender_password = os.getenv("GMAIL_PASSWORD")

    def send_appointment_email(
        self,
        to_email: str,
        patient_name: str,
        doctor_name: str,
        appointment_time: str,
        dept: str
    ):
        msg = MIMEMultipart('alternative')
        msg['Subject'] = "✅ Your Appointment is Confirmed!"
        msg['From'] = self.sender_email
        msg['To'] = to_email

        html = f"""
        <h1>✅ Appointment Confirmed!</h1>
        <p>Dear <strong>{patient_name}</strong>,</p>
        <p>Dr. <strong>{doctor_name}</strong> has accepted your request.</p>
        <h3>Appointment Details:</h3>
        <ul>
            <li><strong>Time:</strong> {appointment_time}</li>
            <li><strong>Department:</strong> {dept}</li>
        </ul>
        <p>See you soon!</p>
        """

        msg.attach(MIMEText(html, 'html'))

        try:
            server = smtplib.SMTP(self.smtp_server, self.smtp_port)
            server.starttls()
            server.login(self.sender_email, self.sender_password)
            server.sendmail(self.sender_email, to_email, msg.as_string())
            server.quit()
            return True
        except Exception as e:
            print(f"Email error: {e}")
            return False


email_service = EmailService()
