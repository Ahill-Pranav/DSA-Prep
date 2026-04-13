import resend
import os
from models import User
from datetime import datetime

resend.api_key = os.getenv("RESEND_API_KEY", "your-resend-api-key")

def send_reminder_email(user: User, remaining: int, target: float):
    html_content = f"""
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #10b981;">Don't Break the Streak, {user.full_name}! 🔥</h2>
        <p>You're doing great with your DSA practice. Here's a quick status check:</p>
        <div style="background: #f9fafb; padding: 15px; border-radius: 8px;">
            <p style="margin: 0; font-size: 18px;">Remaining this week: <strong>{remaining} problems</strong></p>
            <p style="margin: 5px 0 0; color: #6b7280;">Suggested daily target: {target} problems/day</p>
        </div>
        <p style="margin-top: 20px;">Consistency is the key to mastering Algorithms. Hop back in and solve just one problem!</p>
        <a href="https://dsa-tracker-pro.vercel.app/dashboard" style="display: inline-block; background: #10b981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 10px;">Go to Dashboard</a>
        <hr style="margin-top: 30px; border: 0; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #9ca3af;">4x Daily Reminder · DSA Tracker Pro</p>
    </div>
    """
    
    try:
        resend.Emails.send({{
            "from": "DSA Tracker Pro <onboarding@resend.dev>",
            "to": [user.email],
            "subject": f"🔥 {remaining} problems left to hit your goal!",
            "html": html_content
        }})
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False
