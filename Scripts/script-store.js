document.addEventListener("DOMContentLoaded", function () {
    var fileListDiv = document.getElementById("script-store-fileList");

    // Liste des fichiers Python dans le dossier '../Python/Store'
    var pythonFiles = [
        "cyber_snake.py",
        // Ajoutez d'autres noms de fichiers au besoin
    ];

    // Afficher les titres des fichiers
    pythonFiles.forEach(function (filename) {
        var title = document.createElement("h2");
        title.textContent = filename;
        title.addEventListener("click", function () {
            // Charger le contenu du fichier Python
            loadPythonFile(filename);
        });
        fileListDiv.appendChild(title);
    });
});

function loadPythonFile(filename) {
    // Lire le contenu du fichier Python
    fetch("../Python/Store/" + filename)
        .then((response) => response.text())
        .then((content) => {
            // Créer une nouvelle page pour afficher le contenu du fichier Python
            var newPage = window.open("");
            newPage.document.write("<h1>" + filename + "</h1>");
            newPage.document.write("<pre>" + content + "</pre>");
        })
        .catch((error) => console.error("Erreur:", error));
}
