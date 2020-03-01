class Options {

    constructor() {
        this.$RPCURL = document.querySelector('#RPCURL');
        this.$primaryDownloadDir = document.querySelector('#primaryDownloadDir');
        this.$secondaryDownloadDir = document.querySelector('#secondaryDownloadDir');
        this.$saveButton = document.querySelector('button');
    }

    _fillForm(options) {
        const isRPCURLDefined = options.RPCURL !== 'undefined',
            isPrimaryDownloadDirDefined = options.primaryDownloadDir !== 'undefined',
            isSecondaryDownloadDirDefined = options.secondaryDownloadDir !== 'undefined';

        if (isRPCURLDefined) this.$RPCURL.value = options.RPCURL;
        if (isPrimaryDownloadDirDefined) this.$primaryDownloadDir.value = options.primaryDownloadDir;
        if (isSecondaryDownloadDirDefined) this.$secondaryDownloadDir.value = options.secondaryDownloadDir;
    }

    _loadOptions() {
        chrome.storage.sync.get(
            ['options'], (data) =>  {
                if (data.options) this._fillForm(data.options)
            }
        );
    }

    _saveOptions() {
        const options = {
            RPCURL: this.$RPCURL.value,
            primaryDownloadDir: this.$primaryDownloadDir.value,
            secondaryDownloadDir: this.$secondaryDownloadDir.value
        }

        chrome.storage.sync.set({ options: options });
    }

    _setEvents() {
        document.addEventListener(
            'DOMContentLoaded', () => this._loadOptions()
        );

        this.$saveButton.addEventListener(
            'click', () => this._saveOptions()
        )
    }

    setup() {
        this._setEvents();
    }

}

const options = new Options();
options.setup();