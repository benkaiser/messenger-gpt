# Messenger GPT

> Generate replies for Facebook Messenger conversations using ChatGPT

![screenshot showing usage](https://github.com/benkaiser/messenger-gpt/raw/master/assets/screenshot/usage.png)

You can install from the chrome web store here (TODO: add link).

## Running from source

```shell
$ cd messenger-gpt
$ npm run dev
```

### Chrome Extension Developer Mode

1. set your Chrome browser 'Developer mode' up
2. click 'Load unpacked', and select `messenger-gpt/build` folder

## Packing

After the development of your extension run the command

```shell
$ npm build
```

Now, the content of `build` folder will be the extension ready to be submitted to the Chrome Web Store. Just take a look at the [official guide](https://developer.chrome.com/webstore/publish) to more infos about publishing.

---

Generated by [create-chrome-ext](https://github.com/guocaoyi/create-chrome-ext)
