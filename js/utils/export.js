(function () {
    DigitalCard.Utils.Export = {
        init: function () {
            this.bindExportButtons();
        },
        bindExportButtons: function () {
            const pngBtn = document.getElementById('download-png');
            const pdfBtn = document.getElementById('download-pdf');

            if (pngBtn) {
                pngBtn.addEventListener('click', () => this.downloadPNG());
            }
            if (pdfBtn) {
                pdfBtn.addEventListener('click', async () => {
                    if (await DigitalCard.Utils.Subscription.isPro()) {
                        this.downloadPDF();
                    } else {
                        DigitalCard.Utils.Subscription.showPremiumPrompt();
                    }
                });
            }
        },
        downloadPNG: function () {
            const card = document.getElementById('visiting-card');
            if (!card) return;

            const originalTransform = card.style.transform;
            card.style.transform = 'none';

            html2canvas(card, {
                useCORS: true,
                backgroundColor: null,
                scale: 2
            }).then(canvas => {
                const link = document.createElement('a');
                link.download = 'digital-card.png';
                link.href = canvas.toDataURL('image/png');
                link.click();

                card.style.transform = originalTransform;
            });
        },
        downloadPDF: function () {
            const card = document.getElementById('visiting-card');
            if (!card) return;

            const originalTransform = card.style.transform;
            card.style.transform = 'none';

            html2canvas(card, {
                useCORS: true,
                backgroundColor: null,
                scale: 2
            }).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const { jsPDF } = window.jspdf;
                const pdf = new jsPDF({
                    orientation: 'landscape',
                    unit: 'px',
                    format: [canvas.width, canvas.height]
                });

                pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
                pdf.save('digital-card.pdf');

                card.style.transform = originalTransform;
            });
        }
    };
})();
