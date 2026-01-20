(function () {
    const checkAuth = async () => {
        const user = await DigitalCard.Core.Auth.getUser();
        if (!user) {
            window.location.href = 'login.html';
        }
    };
    checkAuth();
})();
