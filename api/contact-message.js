import { email } from 'hatchable';

export const access = 'public';
export const methods = ['POST'];

export default async function (req, res) {
  const message = typeof req.body?.message === 'string' ? req.body.message.trim() : '';
  if (!message) return res.status(400).json({ error: 'Please enter a message.' });
  if (message.length > 2000) return res.status(400).json({ error: 'Message must be 2000 characters or fewer.' });

  try {
    await email.send({
      to: 'karthim978789@gmail.com',
      subject: 'New message from Socially demo website',
      text: 'A visitor sent this message from your website:\n\n' + message,
      html: '<p>A visitor sent this message from your website:</p><blockquote style="white-space:pre-wrap">' +
        message.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;') +
        '</blockquote>',
    });
    return res.json({ success: true, message: 'Message sent successfully.' });
  } catch (error) {
    console.error('Contact email failed:', error);
    return res.status(500).json({ error: 'Could not send the message right now. Please try again later.' });
  }
}