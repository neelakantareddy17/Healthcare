import { useState } from 'react';
import PatientLayout from '../../layouts/PatientLayout';
import './PatientChat.css';

const replies = {
  symptom: 'Please describe when the symptoms started, how severe they are, and whether they are getting worse. For an emergency, contact the hospital directly.',
  navigation: 'Reception is on the ground floor. Diagnostics are on the first floor, and pharmacy is beside the main exit. Ask the front desk if you need an escort.',
  hospital: 'MediQ Hospital is open Monday to Saturday from 8:00 AM to 8:00 PM. Carry your booking QR code and a valid phone number for verification.',
};

function PatientChat() {
  const [messages, setMessages] = useState([
    { from: 'assistant', text: 'Hi. I can help you describe symptoms or find your way around the hospital.' },
  ]);
  const [draft, setDraft] = useState('');

  const send = (text = draft) => {
    const value = text.trim();
    if (!value) return;
    const lower = value.toLowerCase();
    const reply = lower.includes('symptom') || lower.includes('pain') ? replies.symptom
      : lower.includes('where') || lower.includes('navigation') || lower.includes('find') ? replies.navigation
        : replies.hospital;
    setMessages((current) => [...current, { from: 'patient', text: value }, { from: 'assistant', text: reply }]);
    setDraft('');
  };

  return (
    <PatientLayout>
      <div className="chat-page">
        <p className="chat-eyebrow">Patient support</p>
        <h2 className="page-title">Hospital Chat</h2>
        <p className="chat-subtitle">Describe your symptoms or ask about the hospital.</p>
        <div className="chat-prompts">
          <button type="button" onClick={() => send('I want to describe my symptoms')}>Describe symptoms</button>
          <button type="button" onClick={() => send('Where can I find my department?')}>Find my department</button>
          <button type="button" onClick={() => send('Tell me about the hospital')}>Hospital information</button>
        </div>
        <div className="chat-thread" aria-live="polite">
          {messages.map((message, index) => <p key={`${message.from}-${index}`} className={`chat-bubble chat-bubble--${message.from}`}>{message.text}</p>)}
        </div>
        <form className="chat-compose" onSubmit={(event) => { event.preventDefault(); send(); }}>
          <textarea value={draft} onChange={(event) => setDraft(event.target.value)} rows={3} placeholder="Write your symptoms or question..." aria-label="Message" />
          <button type="submit">Send</button>
        </form>
      </div>
    </PatientLayout>
  );
}

export default PatientChat;
