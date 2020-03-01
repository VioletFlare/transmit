class Transmit {

    constructor() {
        this.transmissionSessionId = '';
        this.magnetURL = '';
        this.iconURL = chrome.extension.getURL("icon/icon-32.png");
    }

    _checkMagnetURLIsValid(URL) {
        const matchMagnetURL = /magnet:\?xt=urn:btih:[a-zA-Z0-9]*/g,
            isValid = URL.match(matchMagnetURL);

        return isValid;
    }

    _displayTorrentAddedNotification(message) {
        chrome.notifications.create('magnet-added-success', {
            type: "basic",
            iconUrl: this.iconURL,
            title: "Transmitter",
            message: message,
          });
    }

    _resendRequest(response) {
        setTimeout(() => {
            this.transmissionSessionId = response.headers.get('X-Transmission-Session-Id');

            this._sendRequest();
        }, 100)
    }

    _handleResponse(response) {
        const isStatusOK = response.status === 200,
            isHeaderExpired = response.status === 409;

        if (isStatusOK) {
            return response.json();
        } else if (isHeaderExpired) {
            this._resendRequest(response);
        }
    }

    _handleResponseData(data) {
        if (data) {
            const torrentInfo = data.arguments["torrent-added"],
                message = `Transmitting 📡: ${torrentInfo.name}`;

            this._displayTorrentAddedNotification(message);
        }
    }

    _sendRequest() {
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

        fetch(this.RPCURL, request).then(
            response => this._handleResponse(response)
        ).then(
            data => this._handleResponseData(data)
        );
    }

    _parseURL(URL) {
        const isURLValid = this._checkMagnetURLIsValid(URL);

        if (isURLValid) {
            this.magnetURL = URL;
            this._loadOptions();
            this._sendRequest();
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

    _setOptions(data) {
        if (data.options) {
            this.RPCURL = data.options.RPCURL;
            this.downloadDir = data.options.primaryDownloadDir;
        }
    }

    _loadOptions() {
        chrome.storage.sync.get(
            ['options'], (data) => this._setOptions(data)
        );
    }

    _setEvents() {
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
        this._createContextMenuItems();
        this._setEvents();
    }

}

const transmit = new Transmit();
transmit.setup();