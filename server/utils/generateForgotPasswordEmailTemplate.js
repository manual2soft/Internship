export const generateEmailTemplate = (resetPasswordUrl) => {
  return ` 
      
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#000; padding:20px; font-family: Arial, sans-serif;">
        <tr>
            <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color:#000; border:1px solid #ddd; border-radius:8px; padding:20px;">
                
                <tr>
                <td align="center">
                    <h2 style="color:#ffffff; margin:0;">Reset Your Password</h2>
                </td>
                </tr>

                <tr>
                <td style="color:#cccccc; font-size:16px; padding-top:15px;">
                    Dear User,
                </td>
                </tr>

                <tr>
                <td style="color:#cccccc; font-size:16px; padding-top:10px;">
                    You requested to reset your password. Please click the button below to proceed:
                </td>
                </tr> 

                <tr>
                <td align="center" style="padding:20px 0;">
                    <a href="${resetPasswordUrl}" 
                    style="display:inline-block; font-size:16px; font-weight:bold; color:#000000; text-decoration:none; padding:12px 20px; border:1px solid #ffffff; border-radius:5px; background-color:#ffffff;">
                    Reset Password
                    </a>
                </td>
                </tr>

                <tr>
                <td style="color:#cccccc; font-size:16px;">
                    If you did not request this, please ignore this email. The link will expire in 10 minutes.
                </td>
                </tr>

                <tr>
                <td style="color:#cccccc; font-size:16px; padding-top:10px;">
                    If the button above doesn’t work, copy and paste the following URL into your browser:
                </td>
                </tr>

                <tr>
                <td style="color:#ffffff; font-size:16px; word-break:break-all; padding-top:10px;">
                    ${resetPasswordUrl}
                </td>
                </tr>

                <tr>
                <td align="center" style="padding-top:20px; font-size:14px; color:#666666;">
                    Thank you,<br>
                    Ecommerce Team
                </td>
                </tr>

                <tr>
                <td align="center" style="font-size:12px; color:#444444; padding-top:10px;">
                    This is an automated message. Please do not reply to this email.
                </td>
                </tr>

            </table>
            </td>
        </tr>
        </table>
  
  `;
};
