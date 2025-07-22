


document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault();


    const errorMessage = document.getElementById("errorMessage");
    errorMessage.textContent = "";


    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, password: password })
    })
        .then(response => {
            if (!response.ok) {
                if (response.status === 400) {
                    throw new Error("Requête invalide");
                }
                if (response.status === 401 || response.status === 404) {
                    throw new Error("Email ou mot de passe invalide");
                }
                if (response.status === 403) {
                    throw new Error("Accès refusé");
                }

                throw new Error("Erreur inconnue : " + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log("Réponse du serveur :", data);

            const token = data.token;
            localStorage.setItem("token", token);

            window.location.href = "index.html";
        })
        .catch(error => {
            errorMessage.textContent = "Erreur : " + error.message;
            errorMessage.style.display = "block";
        });
});
