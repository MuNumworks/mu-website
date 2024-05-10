document.addEventListener("DOMContentLoaded", function () {
    var fileListDiv = document.getElementById("script-store-fileList");

    // Liste des fichiers Python dans le dossier '../Python/Store'
    var pythonFiles = [
        "cyber_snake.py",
        "mu_pygame.py",
        // Ajoutez d'autres noms de fichiers au besoin
    ];

    // Afficher les titres des fichiers
    pythonFiles.forEach(function (filename) {
        var divElement = document.createElement("div"); // Création de la div
        divElement.classList.add("script-store-python-file"); // Ajout de la classe "script-store-python-file" à la div
        var titleElement = document.createElement("h2"); // Création de l'élément h2
        titleElement.textContent = filename; // Affectation du nom du fichier à l'élément h2
        titleElement.addEventListener("click", function () {
            // Charger le contenu du fichier Python
            loadPythonFile(filename);
        });
        divElement.appendChild(titleElement); // Ajout de l'élément h2 à la div

        var linkElement = document.createElement("a"); // Création de l'élément a (lien)
        linkElement.href = `on-script.html?file=${filename}`; // Définition de l'attribut href, ici "#" est utilisé comme placeholder
        linkElement.classList.add("script-store-python-file-link");
        linkElement.appendChild(divElement); // Ajout de la div à l'élément a

        fileListDiv.appendChild(linkElement); // Ajout du lien à l'élément parent
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
            newPage.document.write(
                "<pre>" + "<code>" + content + "</code>" + "</pre>",
            );
        })
        .catch((error) => console.error("Erreur:", error));
}
