// Script Store test -- will be integrated into install page
var calculator = new Numworks();

var connect_button = document.getElementById('store-connect');

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

    var scriptsContainer = document.getElementById("script-container");

    for (var i = 0; i < data.records.length; i++) {
        if (data.records[i].type === "py") {        
        
            var record = data.records[i];
            console.log(record);

            // Créer une div pour afficher le script
            var scriptDiv = document.createElement("div");
            scriptDiv.classList.add("script");
        
            // Créer une div pour aligner le nom du script et le bouton pour le télécharger
            var scriptHeader = document.createElement("div");
            scriptHeader.classList.add("store-script-header");


            // Créer un titre avec le nom du script
            var scriptTitle = document.createElement("h2");
            scriptTitle.textContent = record.name;
            scriptHeader.appendChild(scriptTitle);

            // Créer un bouton pour télécharger le fichier
            var scriptButton = document.createElement("div");
            scriptButton.classList.add("store-script-download-button");
            scriptButton.textContent = "download"
            scriptHeader.appendChild(scriptButton);
        
            scriptDiv.appendChild(scriptHeader);

            // Créer un paragraphe pour afficher le contenu du script
            var scriptContentPre = document.createElement("pre");
            scriptContentPre.classList.add("store-pre");
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

};