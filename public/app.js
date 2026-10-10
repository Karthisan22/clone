document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  const input = document.getElementById('contact-message');
  const button = document.getElementById('demo-login');
  const status = document.getElementById('message');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const message = input.value.trim();
    if (!message) {
      status.textContent = 'Please enter a message.';
      return;
    }

    button.disabled = true;
    button.textContent = 'Sending...';
    status.textContent = '';

    try {
      const response = await fetch('/api/contact-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not send message.');
      status.textContent = 'Message sent successfully!';
      input.value = '';
    } catch (error) {
      status.textContent = error.message || 'Could not send message. Please try again.';
    } finally {
      button.disabled = false;
      button.textContent = 'Send message';
    }
  });
});