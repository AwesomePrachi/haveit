const verifyEmailTemplate = ({name, url}) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <title>Email Verification</title>
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
    }
    .btn {
      display: inline-block;
      margin-top: 20px;
      padding: 12px 20px;
      background-color: #4CAF50;
      color: #fff !important;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #999;
    }
    </style>
    </head>
    <body>
    <div class="container">
        <h2>Email Verification</h2>
        <p>Hello ${name}</p>
        <p>Thank you for signing up! Please click the button below to verify your email address:</p>
        
        <a href=${url} class="btn">Verify Email</a>

        <hr style="border:none; border-top:1px solid #eee; margin:20px 0;" />

        <p class="footer">Best regards,<br>
        <strong>Haveit Team</strong>
        </p>
    </div>
    </body>
    </html>
    `
}

export default verifyEmailTemplate