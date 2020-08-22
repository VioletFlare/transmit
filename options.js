class Options {

    constructor() {
        this.$IP = document.querySelector('#ip');
        this.$port = document.querySelector('#port');
        this.$primaryDownloadDir = document.querySelector('#primaryDownloadDir');
        this.$secondaryDownloadDir = document.querySelector('#secondaryDownloadDir');
        this.$saveButton = document.querySelector('button');
        this.$protocol = document.querySelector('#protocol');
    }

    _setProtocol(selectedProtocol) {
        const $selectedOption = this.$protocol.querySelector(`[value=${selectedProtocol}]`);
        $selectedOption.setAttribute('selected', true);
    }

    _fillForm(options) {
        const isProtocolDefined = options.protocol !== 'undefined',
            isIPDefined = options.IP !== 'undefined',
            isPortDefined = options.port !== 'undefined',
            isPrimaryDownloadDirDefined = options.primaryDownloadDir !== 'undefined',
            isSecondaryDownloadDirDefined = options.secondaryDownloadDir !== 'undefined';

        if (isProtocolDefined) this._setProtocol(options.protocol);
        if (isIPDefined) this.$IP.value = options.IP;
        if (isPortDefined) this.$port.value = options.port;
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

    _getSelectedProtocol() {
        const $protocol = document.querySelector('#protocol'),
            selectedProtocol = $protocol.selectedOptions[0].value;
            
        return selectedProtocol;
    }

    _saveOptions() {
        const selectedProtocol = this._getSelectedProtocol(),
        RPCURL = `${selectedProtocol}://${this.$IP.value}:${this.$port.value}/transmission/rpc`,
        options = {
            protocol: selectedProtocol,
            IP: this.$IP.value,
            port: this.$port.value,
            RPCURL: RPCURL,
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