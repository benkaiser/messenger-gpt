import { Component, render } from "preact";
import './index.css'

console.info('chrome-ext template-preact-ts content script')

export {}

class MessengerGPTApp extends Component {
  render() {
    return (
      <div ref={ref => ref?.scrollIntoView()} className='messengerContainer' >
        <button className='messengerButton' onClick={() => {
          console.log('generating...');
          console.log(getConversationHistory());
        }}>Generate responses</button>
      </div>
    );
  }
}

function renderEntryPoint() {
  const chatSection = document.querySelectorAll('[role="main"]')[0].querySelectorAll('div[tabindex="-1"]')[0]!.firstChild!.firstChild!.firstChild!.firstChild!.firstChild!.firstChild!.firstChild!;
  if (chatSection) {
    const bottomDiv = document.createElement('div');
    chatSection.appendChild(bottomDiv);
    render(<MessengerGPTApp />, bottomDiv);
  }
}

function getConversationHistory() {
  const conversationBlock = document.querySelectorAll('[role="main"]')[0];
  const chatHistory = [...conversationBlock.querySelectorAll('[role="row"]')].map(row => {
    // todo extract actual messages
    return row.textContent;
  });
  return chatHistory;
}

function listenForChanges() {
  const targetNode = document.querySelectorAll('[role="main"]')[0].parentElement?.parentElement;
  var config = { childList: true };
  var debounceTimeout: number;

  var callback = function(mutationsList: any) {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      renderEntryPoint();
    }, 1000);
    console.log('Mutation happened!');
  };

  var observer = new MutationObserver(callback);

  observer.observe(targetNode!, config);
}

// try to find main content
const mainContent = document.querySelectorAll('[role="main"]')[0];
if (mainContent) {
  renderEntryPoint();
  listenForChanges();
} else {
  // poll every 5 seconds
  const interval = setInterval(() => {
    const mainContent = document.querySelectorAll('[role="main"]')[0];
    if (mainContent) {
      clearInterval(interval);
      renderEntryPoint();
      listenForChanges();
    }
  }, 1000);
}