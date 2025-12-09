const forgotPasswordTemplate = ({ name, otp }) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Password Reset OTP</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f6f6f6;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 500px;
        margin: 40px auto;
        background-color: #ffffff;
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 20px;
        text-align: center;
      }
      h2 {
        color: #333;
      }
      p {
        color: #555;
        font-size: 15px;
        line-height: 1.5;
      }
      .otp-box {
        display: inline-block;
        font-size: 24px;
        font-weight: bold;
        color: black;
      }
      .footer {
        margin-top: 30px;
        font-size: 12px;
        color: #606060ff;
      }
    </style>
  </head>
  <body>
    <div class="container">
        <h2>Password Reset Request</h2>
        <p>Hello <strong>${name}</strong>,</p>
        <p>You requested to reset your password. Please use the OTP code below to proceed:</p>
        
        <div class="otp-box">${otp}</div>

        <p>This OTP is valid for <strong>10 minutes</strong>. Enter this code on the <strong>Haveit</strong> website to reset your password.</p>
        <p>If you didn't request this, please ignore this email. Your account is safe.</p>

        <hr style="border:none; border-top:1px solid #eee; margin:20px 0;" />

        <p class="footer">Thanks,<br>
        <strong>Haveit Team</strong>
        </p>
    </div>
  </body>
  </html>
  `;
};

export default forgotPasswordTemplate;
