import React, { useState } from 'react';
import { Widget, addResponseMessage } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: This is not recommended for production
});

function Chatbot() {
  const [loading, setLoading] = useState(false);

  const handleNewUserMessage = async (newMessage) => {
    setLoading(true);
    try {
      const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: newMessage }],
        model: "gpt-3.5-turbo",
      });
      
      addResponseMessage(completion.choices[0].message.content);
    } catch (error) {
      console.error('Error:', error);
      addResponseMessage('Sorry, I encountered an error. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="App">
      <Widget
        handleNewUserMessage={handleNewUserMessage}
        title="AI Assistant"
        subtitle="How can I help you?"
      />
    </div>
  );
}

export default Chatbot;