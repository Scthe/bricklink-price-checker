## Installation instructions

Both firefox and chrome have 2 modes for installing the extension: **developer** and **user**. **Developer mode** allows You to access console and HTML inspector, but does not persist when You close the browser window. **User mode** is for when the extension is installed from the official add-on store - [addons.mozilla.org](https://addons.mozilla.org/en-US/firefox/) or [Chrome Web Store](https://chrome.google.com/webstore/category/extensions). This requires the extension to be signed. Fortunately, both stores have an 'unlisted' option that You can use for Your own private purposes.


#### 1. Build the app from sources

1. `yarn install` or local equivalent
2. `yarn start` to start webpack in development mode. This will compile the code into `extension/dist`. It also has watch mode.
3. Look around inside `extension` folder - there is manifest file there if You need to modify it (should not be needed though)


#### 2. Developing on firefox

1. Go to `about:debugging#addons`
2. `Load Temporary Add-on` - point it into `extension/manifest.json`
3. Click `Enable add-on debugging` on top of the page and then `Debug` for specific extension in order to bring up the console (may need to click 'Ok' in special dialog)


#### 3. Publishing on [addons.mozilla.org](https://addons.mozilla.org/en-US/firefox/)

Execute this step once everything is complete and production ready.

1. Build production version of the extension: `yarn build`
2. There should be `bricklink-price-checker.zip` that is ready to be published. [Additional instructions](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Package_your_extension_).
3. Register on [https://addons.mozilla.org](https://addons.mozilla.org)
4. [Submit the extension](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/Distribution/Submitting_an_add-on). Pay close attention to ['On your own'](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/Distribution/Submitting_an_add-on#Self-distribution) and ['On this site'](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/Distribution/Submitting_an_add-on#Self-distribution) options.
