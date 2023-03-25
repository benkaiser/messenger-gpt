import { Component, render } from "preact";
import './index.css';
import { OPENAI_SETTING_KEY } from "../constants";
import { encode } from 'gpt-token-utils';

async function openaiRequest(text: string): Promise<string[] | undefined> {
  const ApiKey = await new Promise<string>((resolve) => {
    chrome.storage.sync.get(OPENAI_SETTING_KEY, function (obj) {
      resolve(obj[OPENAI_SETTING_KEY]);
    });
  });
  if (!ApiKey) {
    alert('Please provide a valid OpenAI API key in the extension options.');
    return undefined;
  }
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + ApiKey
    },
    body: JSON.stringify({
      'model': 'gpt-3.5-turbo',
      n: 3,
      messages: [
        {
          role: 'system',
          content: 'Answer as concisely as possible.'
        },
        {
          role: 'user',
          content: text
        }
      ]
    })
  };
  return fetch('https://api.openai.com/v1/chat/completions', requestOptions)
  .then(response => response.json())
  .then(data => {
    return data.choices.map((choice: any) => {
      const trimmed = choice.message.content.trim()
      const noQuotes = trimmed.startsWith('"') && trimmed.endsWith('"') ? trimmed.slice(1, -1) : trimmed;
      return noQuotes;
    });
  }).catch(err => {
    if (ApiKey) {
      alert('Unable to fetch response from OpenAI. Please check your API key and try again.');
    }
  });
}

console.info('chrome-ext template-preact-ts content script')

export {}

interface IMessengerGPTAppState {
  options?: string[];
  loading: boolean;
}

class MessengerGPTApp extends Component<{}, IMessengerGPTAppState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      loading: false
    };
  }

  render() {
    return (
      <div ref={ref => ref?.scrollIntoView()} className='messengerContainer' >
        { this.state.loading ? <div><svg id="openaiSpinner" xmlns="http://www.w3.org/2000/svg" fill="#000000" width="30px" height="30px" viewBox="0 0 24 24" role="img"><title>OpenAI icon</title><path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"/></svg></div> : <>
          { this.state.options && this.state.options.map((option, index) =>
            <button className='messengerButton' onClick={this._inputOption.bind(this, option)}>{option}</button>
          ) }

          <button className='messengerButton' onClick={this._getResponses}>
            { this.state.options ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#000" class="bi bi-arrow-clockwise" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
              <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
            </svg> : 'Generate responses' }
          </button>
        </>}
      </div>
    );
  }

  private _getResponses = async () => {
    this.setState({
      loading: true
    });
    const conversation = shrinkConversation(getConversationHistory(), 3000);
    const response = await openaiRequest(`Here is a conversation:
${conversation.join('\n')}

What is something You could write next in the conversation? Respond only with the message, do not include "You sent:".`);
    if (!response) {
      this.setState({
        loading: false
      });
      return;
    }
    this.setState({
      options: response,
      loading: false
    });
  }

  private _inputOption = (option: string) => {
    const textInput: HTMLDivElement = document.querySelectorAll('[contenteditable="true"]')[0] as HTMLDivElement;
    if (textInput) {
      textInput.focus();
      document.execCommand('insertText', false, option);
    } else {
      alert('Could not find text input. FaceBook likely changed something, please file a bug against the extension.');
    }
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

function getConversationHistory(): string[] {
  const conversationBlock = document.querySelectorAll('[role="main"]')[0];
  const chatHistory = [...conversationBlock.querySelectorAll('[role="row"]')]
  .filter(elem => elem.classList.length > 0)
  .map(row => {
    const name = row.firstChild!.firstChild!.firstChild!.textContent;
    const message = row.firstChild!.firstChild!.childNodes[1].textContent || row.firstChild!.firstChild!.childNodes[2].textContent;
    if (!message) {
      return undefined;
    }
    return `${name}: ${message}`;
  }).filter(message => !!message) as string[];
  return chatHistory;
}

function countTokens(text: string): number {
  return encode(text).length;
}

function shrinkConversation(conversation: string[], maxTokens: number) {
  const shrunkConversation = [];
  let tokenCount = 0;
  for (let i = conversation.length - 1; i >= 0; i--) {
    const message = conversation[i];
    const messageTokens = countTokens(message);
    if (tokenCount + messageTokens < maxTokens) {
      shrunkConversation.unshift(message);
      tokenCount += messageTokens + 1; // 1 token for newline
    } else {
      console.log('Hit token limit');
      break;
    }
  }
  console.log('used tokens: ' + tokenCount);
  return shrunkConversation;
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