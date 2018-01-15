class OptionsController {
    constructor() {
        this.updateAccountElements();
        this.whenDocumentIsReady(this.setupSignInButton.bind(this));
        this.whenDocumentIsReady(this.setupSignOutButton.bind(this));
    }

    updateAccountElements() {
        this.updateSignInStatus();
        this.updateAccountButtonStates();
    }

    whenDocumentIsReady(functionToCall) {
        $(document).ready(functionToCall);
    }

    updateSignInStatus() {
        chrome.runtime.sendMessage({'subject': 'userIsSignedIn'}, function(response) {
            if (response.userIsSignedIn) {
                const text = 'You\'re signed in!';
                document.getElementById('sign-in-status').innerHTML = text;
            } else {
                const text = 'You\'re not signed in.';
                document.getElementById('sign-in-status').innerHTML = text;
            }
        });
    }

    setupSignInButton() {
        $('#sign-in-button').click(function() {
            chrome.runtime.sendMessage({'subject': 'signIn'}, this.updateAccountElements.bind(this));
            this.disableSignInButton().bind(this);
        }.bind(this));
    }

    setupSignOutButton() {
        $('#sign-out-button').click(function() {
            chrome.runtime.sendMessage({'subject': 'signOut'}, this.updateAccountElements.bind(this));
            this.disableSignOutButton().bind(this);
        }.bind(this));
    }

    updateAccountButtonStates() {
        chrome.runtime.sendMessage({'subject': 'userIsSignedIn'}, function(response) {
            if (response.userIsSignedIn) {
                this.disableSignInButton();
                this.enableSignOutButton();
            } else {
                this.disableSignOutButton();
                this.enableSignInButton();
            }
        }.bind(this));
    }

    enableSignInButton() {
        this.enableElement('#sign-in-button');
    }

    enableSignOutButton() {
        this.enableElement('#sign-out-button');
    }

    disableSignInButton() {
        this.disableElement('#sign-in-button');
    }

    disableSignOutButton() {
        this.disableElement('#sign-out-button');
    }

    enableElement(selector) {
        $(selector).prop("disabled", false);
    }

    disableElement(selector) {
        $(selector).prop("disabled", true);
    }
}

new OptionsController();
