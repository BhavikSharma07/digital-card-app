document.addEventListener('DOMContentLoaded', () => {
    // Init global UI (navbar, etc)
    if (DigitalCard.UI.UIManager) {
        DigitalCard.UI.UIManager.init();
    }

    // If on create page
    if (document.getElementById('visiting-card')) {
        if (DigitalCard.UI.CardRenderer) {
            DigitalCard.UI.CardRenderer.init();
        }
        if (DigitalCard.Utils.Export) {
            DigitalCard.Utils.Export.init();
        }
    }

    // If on login/register page
    if (document.getElementById('login-form') || document.getElementById('register-form')) {
        if (DigitalCard.UI.AuthUI) {
            DigitalCard.UI.AuthUI.init();
        }
    }
});
