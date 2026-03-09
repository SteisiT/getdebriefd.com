exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { toEmail, toName, subject, body, ccEmail, ccName } = JSON.parse(event.body);

    console.log('Sending email to:', toEmail, 'Subject:', subject);

    const payload = {
      sender: { name: 'GetDebriefD', email: 'team@getdebriefd.com' },
      to: [{ email: toEmail, name: toName || '' }],
      subject,
      textContent: body
    };

    if (ccEmail) {
      payload.cc = [{ email: ccEmail, name: ccName || '' }];
    }

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY
      },
      body: JSON.stringify(payload)
    });

    const responseText = await response.text();
    console.log('Brevo response status:', response.status);
    console.log('Brevo response body:', responseText);

    if (!response.ok) {
      return { statusCode: 500, body: JSON.stringify({ error: responseText }) };
    }

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (e) {
    console.error('Function error:', e.message);
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
