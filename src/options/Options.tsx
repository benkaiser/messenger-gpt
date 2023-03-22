import { useEffect, useState } from 'preact/hooks';
import { OPENAI_SETTING_KEY } from '../constants';
import './Options.css'

export const Options = () => {
  const [openaiApiKey, setOpenaiApiKey] = useState<string>('');
  useEffect(() => {
    chrome.storage.sync.get(OPENAI_SETTING_KEY, function (obj) {
      setOpenaiApiKey(obj[OPENAI_SETTING_KEY]);
    });
  }, []);

  const onChange = (event: Event) => {
    setOpenaiApiKey((event.target as HTMLInputElement).value);
  };

  const save = () => {
    chrome.storage.sync.set({ [OPENAI_SETTING_KEY]: openaiApiKey });
  };

  return (
    <main>
      <h2>Options</h2>
      <p>To use this extension, a valid OpenAI API key must be provided. You can <a href='https://platform.openai.com/account/api-keys' target='_blank'>generate one here</a>.</p>
      <div className='optionsItems'>
        <label for="openai-api-key">OpenAI API Key</label>
        <input type="text" id="openai-api-key" name="openai-api-key" value={openaiApiKey} onChange={onChange} />
        <button onClick={save}>Save</button>
      </div>
    </main>
  )
}

export default Options