var calculator = new Numworks();
var bootloader = new Numworks.Recovery();

var connect = document.getElementById("connect");
var install = document.getElementById("installMu");
var recovery = document.getElementById("recovery");

var percentage = 0;

toggleButtonsVisibility(false);

navigator.usb.addEventListener("disconnect", function (e) {
  calculator.onUnexpectedDisconnect(e, function () {
    connect.disabled = false;
    calculator.autoConnect(autoConnectHandler);
    toggleButtonsVisibility(false);
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
    function (error) {},
  );
};

install.onclick = function (e) {
  console.log("Installing Mu on slot A");
  flashEpsilonOnboardingA();
};

recovery.onclick = function (e) {
  bootloader.detect(
    function () {
      bootloader.stopAutoConnect();
      connected();
      console.log("Installing Mu Bootloader");
      flashBootloader();
    },
    function (error) {},
  );
};

async function connected() {
  connect.disabled = true;
  toggleButtonsVisibility(true);
  //var connectDiv = document.getElementById("connect");
  connect.style.display = "none";
}

function toggleButtonsVisibility(isConnected) {
  if (isConnected) {
    install.style.display = "block";
    recovery.style.display = "none";
    connect.style.display = "none";
  } else {
    install.style.display = "none";
    recovery.style.display = "block";
    connect.style.display = "block";
    progressBar.style.display = "none";
  }
}

async function flashBootloader() {
  try {
    const response = await fetch("../Bins/Bootloader/bootloader.bin");
    if (!response.ok) {
      throw new Error("Failed to fetch bootloader.bin");
    }
    const buffer = await response.arrayBuffer();
    progressBar.style.display = "block";
    bootloader.device.logProgress = logProgress;
    await bootloader.flashRecovery(buffer);
    console.log(
      "Bootloader flashed. Please reboot the calculator to complete the installation.",
    );
    progressBar.style.display = "none";
  } catch (error) {
    console.error("Error while flashing bootloader:", error);
  }
  return true;
}

async function flashEpsilonOnboardingA() {
  try {
    const response = await fetch("../Bins/Chrys142/epsilon.onboarding.A.bin");
    if (!response.ok) {
      throw new Error("Failed to load binary file");
    }

    const buffer = await response.arrayBuffer();
    progressBar.style.display = "block";
    calculator.device.logProgress = logProgress;
    await calculator.flashExternal(buffer);
    console.log(
      "Flashing epsilon.onboarding.A.bin to external memory successful!",
    );
    progressBar.style.display = "none";
  } catch (error) {
    console.error(
      "Error while flashing epsilon.onboarding.A.bin to external memory:",
      error,
    );
  }
  return true;
}

function logProgress(e, t) {
  console.log(e, t);
  percentage = (e / t) * 100;
  console.log(percentage);
  progressBar.value = percentage;
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
