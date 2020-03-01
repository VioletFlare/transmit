Signing
===

1. Zip only the files needed by the extension like this:

transmit.zip
|- icon.svg
|- transmit.js
|- manifest.json

2. Sign the extension¹ by either:
    a. Uploading it to addons.mozilla and then downloading the .xpi file
    b. Creating the .xpi file manually, then signing it with "web-ext" tool (downloadable from npm)

¹ - If the extension is not signed, the browser will consider it as corrupted.

Installation
===

Firefox:  
    Drag and drop the .xpi into a browser tab  

Chrome:  
    1. Clone repo  
    2. Go to chrome://extensions/  
    3. Click "Load Unpacked" and select the cloned folder
