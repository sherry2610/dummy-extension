import React, { useEffect, useState } from 'react';
import logo from './logo.svg';

import './App.css';
import { ChromeMessage, Sender } from './types';

const App = () => {
  const [url, setUrl] = useState<string>('');
  const [responseFromContent, setResponseFromContent] = useState<string>('');

  /**
   * Get current URL
   */
  useEffect(() => {
    const queryInfo = { active: true, lastFocusedWindow: true };

    chrome.tabs &&
      chrome.tabs.query(queryInfo, tabs => {
        const url = tabs[0].url ? tabs[0].url : 'nothing found';
        setUrl(url);
      });
  }, []);

  /**
   * Send message to the content script
   */
  const sendTestMessage = () => {
    const message: ChromeMessage = {
      from: Sender.React,
      message: 'Hello from React',
    };

    const queryInfo: chrome.tabs.QueryInfo = {
      active: true,
      currentWindow: true,
    };

    /**
     * We can't use "chrome.runtime.sendMessage" for sending messages from React.
     * For sending messages from React we need to specify which tab to send it to.
     */
    chrome.tabs &&
      chrome.tabs.query(queryInfo, tabs => {
        const currentTabId = tabs[0].id ? tabs[0].id : 0;
        console.log('currentTabId!', currentTabId);
        /**
         * Sends a single message to the content script(s) in the specified tab,
         * with an optional callback to run when a response is sent back.
         *
         * The runtime.onMessage event is fired in each content script running
         * in the specified tab for the current extension.
         */
        chrome.tabs.sendMessage(currentTabId, message, response => {
          setResponseFromContent(response);
        });
      });
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>URL:</p>
        <p>{url}</p>
        <button onClick={sendTestMessage}>SEND MESSAG</button>
        <p>Response from content:</p>
        <p>{responseFromContent}</p>
      </header>
    </div>
  );
};

export default App;
