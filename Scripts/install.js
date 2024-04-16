var calculator = new Numworks();

var status = document.getElementById("status");
var connect = document.getElementById("connect");
var content = document.getElementById("content");
var install = document.getElementById("installMu");

navigator.usb.addEventListener("disconnect", function (e) {
  calculator.onUnexpectedDisconnect(e, function () {
    status.innerHTML = "Disconnected.";
    content.innerHTML = "Please connect your Numworks.";
    connect.disabled = false;
    calculator.autoConnect(autoConnectHandler);
  });
});

calculator.autoConnect(autoConnectHandler);

function autoConnectHandler(e) {
  calculator.stopAutoConnect();
  connected();
}

connect.onclick = function (e) {
  calculator.detect(
    function () {
      calculator.stopAutoConnect();
      connected();
    },
    function (error) {
      status.innerHTML = "Error: " + error;
    },
  );
};

install.onclick = function (e) {
  console.log("Test Install");
  flashEpsilonOnboardingA();
};

async function connected() {
  connect.disabled = true;
  status.innerHTML = "Connected.";

  var connectDiv = document.getElementById("connect");
  connectDiv.style.display = "none";

  var html_content = "Info : " + calculator.getModel(false) + "<br/>";

  content.innerHTML = html_content;
}

async function flashEpsilonOnboardingA() {
  // Chemin d'accès au fichier .bin
  const cheminFichier = "../Bins/Chrys130/epsilon.onboarding.A.bin";

  try {
    const response = await fetch("../Bins/Chrys122/epsilon.onboarding.A.bin");
    if (!response.ok) {
      throw new Error("Failed to load binary file");
    }

    const buffer = await response.arrayBuffer();
    //displayFileContents(buffer);

    // Appelez la fonction flashExternal avec votre buffer
    await calculator.flashExternal(buffer);

    console.log(
      "Flashing epsilon.onboarding.A.bin to external memory successful!",
    );
  } catch (error) {
    console.error(
      "Error while flashing epsilon.onboarding.A.bin to external memory:",
      error,
    );
  }
}

async function getPy() {
  let data = await calculator.backupStorage();

  var scriptsContainer = document.getElementById("scriptsContainer");

  for (var i = 0; i < data.records.length; i++) {
    var record = data.records[i];

    // Créer une div pour afficher le script
    var scriptDiv = document.createElement("div");
    scriptDiv.classList.add("script");

    // Créer un titre avec le nom du script
    var scriptTitle = document.createElement("h2");
    scriptTitle.textContent = record.name;
    scriptDiv.appendChild(scriptTitle);

    // Créer un paragraphe pour afficher le contenu du script
    var scriptContent = document.createElement("p");
    scriptContent.textContent = record.code;
    scriptDiv.appendChild(scriptContent);

    // Ajouter la div du script à la page
    scriptsContainer.appendChild(scriptDiv);
  }
}
