import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from app.config import settings


def send_email(to_email: str, subject: str, text_body: str, html_body: str):
    msg = MIMEMultipart("alternative")
    msg["From"] = settings.EMAIL_FROM
    msg["To"] = to_email
    msg["Subject"] = subject

    msg.attach(MIMEText(text_body, "plain"))
    msg.attach(MIMEText(html_body, "html"))

    try:
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=20) as server:
            server.ehlo()
            server.starttls()
            server.ehlo()

            server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)

            server.send_message(msg)
            print("EMAIL SENT")

    except Exception as e:
        print("SMTP ERROR:", repr(e))
        raise


# -------------------------
# Email Verification
# -------------------------

def send_verification_email(to_email: str, verify_url: str):
    subject = "Verify your PoddaBoti account"

    text_body = f"""
Hi,

Thanks for registering for PoddaBoti Bookstore.

Verify your email by clicking the link below:

{verify_url}

If you did not create this account, you can ignore this email.
"""

    html_body = f"""
<html>
  <body style="font-family: Arial, sans-serif; background:#f4f4f4; padding:20px;">
    <div style="max-width:500px;margin:auto;background:white;padding:30px;border-radius:8px;">
      
      <h2 style="color:#333;">Verify your email</h2>

      <p>Thanks for registering for <strong>PoddaBoti Bookstore</strong>.</p>

      <p>Please click the button below to verify your email address.</p>

      <p style="text-align:center;">
        <a href="{verify_url}"
           style="background:#4CAF50;color:white;padding:12px 20px;
                  text-decoration:none;border-radius:6px;font-weight:bold;">
          Verify Email
        </a>
      </p>

      <p>If the button doesn't work, copy and paste this link into your browser:</p>

      <p style="word-break:break-all;">{verify_url}</p>

      <hr>

      <p style="font-size:12px;color:#777;">
        If you did not create this account, you can safely ignore this email.
      </p>

    </div>
  </body>
</html>
"""

    send_email(to_email, subject, text_body, html_body)


# -------------------------
# Password Reset
# -------------------------

def send_password_reset_email(to_email: str, reset_url: str):
    subject = "Reset your PoddaBoti password"

    text_body = f"""
Hi,

We received a request to reset your PoddaBoti password.

Click the link below to set a new password:

{reset_url}

If you did not request this, you can ignore this email.
"""

    html_body = f"""
<html>
  <body style="font-family: Arial, sans-serif; background:#f4f4f4; padding:20px;">
    <div style="max-width:500px;margin:auto;background:white;padding:30px;border-radius:8px;">
      
      <h2 style="color:#333;">Reset your password</h2>

      <p>We received a request to reset your password for your 
      <strong>PoddaBoti Bookstore</strong> account.</p>

      <p style="text-align:center;">
        <a href="{reset_url}"
           style="background:#ff6b6b;color:white;padding:12px 20px;
                  text-decoration:none;border-radius:6px;font-weight:bold;">
          Reset Password
        </a>
      </p>

      <p>If the button doesn't work, copy and paste this link into your browser:</p>

      <p style="word-break:break-all;">{reset_url}</p>

      <hr>

      <p style="font-size:12px;color:#777;">
        If you did not request a password reset, you can ignore this email.
      </p>

    </div>
  </body>
</html>
"""

    send_email(to_email, subject, text_body, html_body)