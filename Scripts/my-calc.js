// Script my-calc test -- will be integrated into install page
var calculator = new Numworks();

var connect_button = document.getElementById("my-calc-connect");

navigator.usb.addEventListener("disconnect", function (e) {
    calculator.onUnexpectedDisconnect(e, function () {
        connect_button.disabled = false;
        calculator.autoConnect(autoConnectHandler);
    });
});

calculator.autoConnect(autoConnectHandler);

function autoConnectHandler(e) {
    calculator.stopAutoConnect();
}

async function connected() {
    connect_button.disabled = true;
}

connect_button.onclick = function (e) {
    calculator.detect(
        function () {
            calculator.stopAutoConnect();
            connected();
            getPyTitles();
        },
        function (error) {},
    );
};

async function getPyTitles() {
    let data = await calculator.backupStorage();

    var scriptsContainer = document.getElementById("my-calc-script-container");

    for (var i = 0; i < data.records.length; i++) {
        if (data.records[i].type === "py") {
            var record = data.records[i];
            console.log(record);

            // Créer une div pour afficher le script
            var scriptDiv = document.createElement("div");
            scriptDiv.classList.add("my-calc-script");

            // Créer une div pour aligner le nom du script et le bouton pour le télécharger
            var scriptHeader = document.createElement("div");
            scriptHeader.classList.add("my-calc-header");

            // Créer un titre avec le nom du script
            var scriptTitle = document.createElement("h2");
            scriptTitle.textContent = record.name;
            scriptHeader.appendChild(scriptTitle);

            // Créer un bouton pour télécharger le fichier
            var scriptButton = document.createElement("div");
            scriptButton.classList.add("my-calc-download-button");
            scriptButton.textContent = "download";
            scriptHeader.appendChild(scriptButton);

            scriptDiv.appendChild(scriptHeader);

            // Créer un paragraphe pour afficher le contenu du script
            var scriptContentPre = document.createElement("pre");
            scriptContentPre.classList.add("my-calc-pre");
            var scriptContentCode = document.createElement("code");
            scriptContentCode.classList.add("language-python");
            scriptContentCode.textContent = record.code;
            scriptContentPre.appendChild(scriptContentCode);
            scriptDiv.appendChild(scriptContentPre);

            // Ajouter la div du script à la page
            scriptsContainer.appendChild(scriptDiv);
        } else {
        }
    }

    Prism.highlightAll();
    // Ajoutez un gestionnaire d'événements à chaque scriptButton
    var scriptButtons = document.querySelectorAll(".my-calc-download-button");
    scriptButtons.forEach(function (scriptButton) {
        scriptButton.onclick = function () {
            // Obtenez le titre et le contenu du script
            var scriptTitle = this.parentNode.querySelector("h2").textContent;
            var scriptContent =
                this.parentNode.nextElementSibling.querySelector(
                    "code",
                ).textContent;

            // Créer un Blob contenant le contenu du script
            var blob = new Blob([scriptContent], { type: "text/plain" });

            // Créer un URL temporaire pour le Blob
            var url = URL.createObjectURL(blob);

            // Créer un lien de téléchargement
            var downloadLink = document.createElement("a");
            downloadLink.href = url;
            downloadLink.download = scriptTitle + ".py"; // Nom du fichier avec l'extension .py
            downloadLink.style.display = "none";

            // Ajouter le lien au DOM et cliquez dessus pour déclencher le téléchargement
            document.body.appendChild(downloadLink);
            downloadLink.click();

            // Nettoyer
            URL.revokeObjectURL(url);
            document.body.removeChild(downloadLink);
        };
    });
}
