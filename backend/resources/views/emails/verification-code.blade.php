<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Votre code de vérification</title>
</head>
<body style="margin:0;padding:0;background-color:#f3f5f7;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f5f7;padding:32px 16px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background-color:#ffffff;border-radius:12px;overflow:hidden;">
                    <tr>
                        <td style="background-color:#0f5132;padding:24px 32px;color:#ffffff;">
                            <p style="margin:0;font-size:20px;font-weight:bold;letter-spacing:1px;">SAMA UFR</p>
                            <p style="margin:4px 0 0;font-size:13px;opacity:0.85;">Université Gaston Berger</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:32px;">
                            <p style="margin:0 0 16px;font-size:16px;">Bonjour {{ $name ?: 'utilisateur' }},</p>
                            <p style="margin:0 0 24px;font-size:16px;line-height:1.6;">
                                Voici votre code de vérification pour activer votre compte :
                            </p>
                            <p style="margin:0 0 24px;text-align:center;font-size:34px;font-weight:bold;letter-spacing:8px;color:#0f5132;">
                                {{ $code }}
                            </p>
                            <p style="margin:0 0 8px;font-size:14px;line-height:1.6;color:#4b5563;">
                                Ce code expire dans 15 minutes.
                            </p>
                            <p style="margin:0;font-size:14px;line-height:1.6;color:#4b5563;">
                                Si vous n'êtes pas à l'origine de cette inscription, ignorez simplement cet e-mail.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
