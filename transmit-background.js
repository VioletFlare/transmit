class Transmit {

    constructor() {
        this.transmissionSessionId = '';
        this.magnetURL = '';
        this.iconURL = chrome.extension.getURL('icon/icon-32.png');
    }

    _checkMagnetURLIsValid(URL) {
        const matchMagnetURL = /magnet:\?xt=urn:btih:[a-zA-Z0-9]*/g,
            isValid = URL.match(matchMagnetURL);

        return isValid;
    }

    _displayNotification(message) {
        chrome.notifications.create('transmit-notification', {
            type: 'basic',
            iconUrl: this.iconURL,
            title: 'Transmit',
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
    }

    async _sendRequest() {
        const request = this._createRequest(),
            response = await fetch(this.RPCURL, request),
            data = await this._handleResponse(response),
            isNotHeaderExpired = response.status !== 409;

        if (isNotHeaderExpired) this._handleResponseData(data);
    }

    _initRequest() {
        try {
            setTimeout(
                async () => this._sendRequest(), 0
            );
        } catch (error) {
            this._handleError(error)
        }
    }

    _parseURL(URL) {
        const isURLValid = this._checkMagnetURLIsValid(URL);

        if (isURLValid) {
            this.magnetURL = URL;
            this._initRequest();
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

