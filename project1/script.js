// STORAGE
let users = JSON.parse(localStorage.getItem("users")) || [];
let resources = JSON.parse(localStorage.getItem("resources")) || [];
let currentUser = null;

// REGISTER
function register() {
    let user = {
        username: document.getElementById("username").value,
        subject: document.getElementById("subject").value,
        password: document.getElementById("password").value
    };

    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
    alert("Registered Successfully!");
}

// LOGIN
function login() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    let user = users.find(u => u.username === username && u.password === password);

    if (user) {
        currentUser = user;

        document.getElementById("authPage").style.display = "none";
        document.getElementById("appPage").style.display = "block";

        if (username === "admin") {
            document.getElementById("adminPanel").style.display = "block";
        }

        displayResources();
    } else {
        alert("Invalid login!");
    }
}

// UPLOAD RESOURCE
function uploadResource() {
    let file = document.getElementById("fileInput").files[0];
    let link = document.getElementById("linkInput").value;

    let reader = new FileReader();

    if (file) {
        reader.onload = function () {
            saveResource(reader.result, "file");
        };
        reader.readAsDataURL(file);
    } else if (link) {
        saveResource(link, "link");
    } else {
        alert("Upload file or provide link");
    }
}

function saveResource(data, type) {
    let resource = {
        title: document.getElementById("title").value,
        subject: document.getElementById("resSubject").value,
        description: document.getElementById("description").value,
        data: data,
        type: type,
        owner: currentUser.username
    };

    resources.push(resource);
    localStorage.setItem("resources", JSON.stringify(resources));

    displayResources();
}

// DISPLAY
function displayResources(filtered = resources) {
    let container = document.getElementById("resourceContainer");
    container.innerHTML = "";

    filtered.forEach((res, index) => {
        let div = document.createElement("div");
        div.className = "resource";

        div.innerHTML = `
            <h4>${res.title}</h4>
            <p><b>Subject:</b> ${res.subject}</p>
            <p>${res.description}</p>

            ${res.type === "file" 
                ? `<a href="${res.data}" download>Download</a>`
                : `<a href="${res.data}" target="_blank">Open Link</a>`
            }

            <br><br>

            ${currentUser.username === res.owner 
                ? `<button onclick="deleteResource(${index})">Delete</button>` 
                : ""
            }
        `;

        container.appendChild(div);
    });
}

// DELETE
function deleteResource(index) {
    resources.splice(index, 1);
    localStorage.setItem("resources", JSON.stringify(resources));
    displayResources();
}

// SEARCH
function searchResources() {
    let query = document.getElementById("searchBox").value.toLowerCase();

    let filtered = resources.filter(res =>
        res.title.toLowerCase().includes(query) ||
        res.subject.toLowerCase().includes(query) ||
        res.description.toLowerCase().includes(query)
    );

    displayResources(filtered);
}

// ADMIN
function clearAll() {
    resources = [];
    localStorage.removeItem("resources");
    displayResources();
}