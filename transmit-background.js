class Transmit {

    constructor() {
        this.transmissionSessionId = '';
        this.magnetURL = '';
        this.iconURL = chrome.extension.getURL('icon/icon-32.png');
        this.iconDataURL = "data:image/png;base64,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";
    }

    _checkMagnetURLIsValid(URL) {
        const matchMagnetURL = /magnet:\?xt=urn:btih:[a-zA-Z0-9]*/g,
            isValid = URL.match(matchMagnetURL);

        return isValid;
    }

    _displayNotification(message) {
        chrome.notifications.create({
            type: 'basic',
            title: 'Transmit',
            iconUrl: this.iconDataURL,
            message: message,
          });
    }

    _resendRequest(response) {
        setTimeout(() => {
            this.transmissionSessionId = response.headers.get('X-Transmission-Session-Id');

            this._sendRequest();
        }, 100)
    }

    async _handleResponse(response) {
        const isStatusOK = response.status === 200,
            isHeaderExpired = response.status === 409;

        if (isStatusOK) {
            return await response.json();
        } else if (isHeaderExpired) {
            this._resendRequest(response);
        }
    }

    _handleResponseData(data) {
        let torrentInfo;

        if (data) {
            torrentInfo = data.arguments['torrent-added'];
        }

        if (torrentInfo) {
            const message = `Transmitting 📡: ${torrentInfo.name}`;
            this._displayNotification(message);
        }
    }

    _createRequest() {
        const payload = {
            method: 'torrent-add',
            arguments: {
                paused: false,
                'download-dir': this.downloadDir,
                filename: this.magnetURL
            }
        },
        request = {
            method: 'post',
            headers: {
                'Content-Type': 'json',
                'X-Transmission-Session-Id': this.transmissionSessionId
            },
            body: JSON.stringify(payload)          
        }

        return request;
    }

    _handleError(error) {
        const errorMessage = `Failed 🚫: ${error.message}`;
        this._displayNotification(errorMessage);

        console.log(error);
    }

    async _sendRequest() {
        try {
            await this._checkRPCUrl();

            const request = this._createRequest(),
            response = await fetch(this.RPCURL, request),
            data = await this._handleResponse(response),
            isNotHeaderExpired = response.status !== 409;

            if (isNotHeaderExpired) this._handleResponseData(data);
        } catch (error) {
            this._handleError(error)
        }
    }

    _waitFor10ms() {
        return new Promise((resolve) => { 
            setTimeout(() => {
                resolve(true);
            }, 10); 
        }); 
    }

    async _checkRPCUrl() {
        const isRPCURLUndefined = this.RPCURL === undefined;

        if (isRPCURLUndefined) this._loadOptions();

        const waitedForAWhile = await this._waitFor10ms();
        
        return waitedForAWhile;
    }

    _parseURL(URL) {
        const isURLValid = this._checkMagnetURLIsValid(URL);

        if (isURLValid) {
            this.magnetURL = URL;
            this._sendRequest.call(this);
        }
    }

    _onContextMenuItemClicked(info) {
        switch (info.menuItemId) {
            case 'text-selected':
                this._parseURL(info.selectionText);
                break;
            case 'link-selected':
                this._parseURL(info.linkUrl);
                break;
          }
    }

    _loadOptions() {
        chrome.storage.sync.get(
            ['options'], (data) => { 
                if (data.options) this._setOptions(data.options)
            }
        );
    }

    _setOptions(options) {
        if (options.RPCURL) this.RPCURL = options.RPCURL;
        if (options.primaryDownloadDir) this.downloadDir = options.primaryDownloadDir;
    }

    _setEvents() {
        chrome.storage.onChanged.addListener(
            change => {
                if (change.options) this._setOptions(change.options.newValue)
            }
        );

        chrome.contextMenus.onClicked.addListener(
            info => this._onContextMenuItemClicked(info)
        )
    }

    _createContextMenuItems() {
        chrome.contextMenus.create({
            id: 'text-selected',
            type: 'normal',
            title: 'Upload selected...',
            contexts: ['selection']
        });

        chrome.contextMenus.create({
            id: 'link-selected',
            type: 'normal',
            title: 'Upload link...',
            contexts: ['link']
        });
    }

    setup() {
        this._loadOptions();
        this._createContextMenuItems();
        this._setEvents();
    }

}

const transmit = new Transmit();
transmit.setup();

