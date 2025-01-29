// src/extension.ts
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    const provider = new DeepseekChatViewProvider(context.extensionUri);

    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider('deepseekChat.chatView', provider)
    );
}

class DeepseekChatViewProvider implements vscode.WebviewViewProvider {
    constructor(private readonly _extensionUri: vscode.Uri) {}

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };

        webviewView.webview.html = this._getHtmlForWebview();
    }

    private _getHtmlForWebview() {
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Deepseek Chat</title>
                <style>
                    body, html {
                        margin: 0;
                        padding: 0;
                        height: 100vh;
                        overflow: hidden;
                        background: var(--vscode-editor-background);
                    }
                    .spinner-container {
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        background: var(--vscode-editor-background);
                        z-index: 1000;
                    }
                    .spinner {
                        width: 50px;
                        height: 50px;
                        border: 5px solid var(--vscode-button-background);
                        border-bottom-color: transparent;
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                    }
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                    iframe {
                        width: 100%;
                        height: 100vh;
                        border: none;
                        opacity: 0;
                        transition: opacity 0.3s ease;
                    }
                    iframe.loaded {
                        opacity: 1;
                    }
                </style>
            </head>
            <body>
                <div class="spinner-container" id="loading">
                    <div class="spinner"></div>
                </div>
<iframe 
    src="https://chat.deepseek.com" 
    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation allow-storage-access-by-user-activation"
    onload="handleIframeLoad()"
></iframe>
                <script>
                    function handleIframeLoad() {
                        document.querySelector('iframe').classList.add('loaded');
                        document.getElementById('loading').style.display = 'none';
                    }

                    window.addEventListener('message', function(event) {
                        // Handle any messages from the iframe if needed
                        console.log('Message from iframe:', event.data);
                    });
                </script>
            </body>
            </html>
        `;
    }
}