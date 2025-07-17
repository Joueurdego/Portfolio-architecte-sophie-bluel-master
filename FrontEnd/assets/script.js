const gallery = document.querySelector('.gallery');
const portfolio = document.getElementById('portfolio');


async function getWorks() {
  const response = await fetch('http://localhost:5678/api/works');
  const data = await response.json();
  return data;
}


async function displayWorks() {
  const works = await getWorks();
  gallery.innerHTML = '';
  works.forEach(work => {
    const figure = document.createElement('figure');
    figure.dataset.categoryId = work.category.id;
    figure.dataset.workId = work.id;
    const image = document.createElement('img');
    image.alt = work.title;
    const figcaption = document.createElement('figcaption');
    image.src = work.imageUrl;
    figcaption.textContent = work.title;
    figure.append(image, figcaption);
    gallery.appendChild(figure);
  });
}
displayWorks();


const formulaire = document.createElement("form");
formulaire.id = 'filtres';
portfolio.insertBefore(formulaire, gallery);
const filtres = document.getElementById('filtres')


function createRadioButton(id, textContent) {
  const button = document.createElement("button");
  button.id = id;
  button.type = "button";
  button.textContent = textContent;
  formulaire.appendChild(button);
}


createRadioButton("tous", "Tous");
document.getElementById("tous").classList.add("selected");


formulaire.addEventListener('click', async (event) => {
  if (event.target.matches('button')) {   //faire une fonction
    const boutons = formulaire.querySelectorAll('button');
    boutons.forEach(btn => btn.classList.remove('selected'));
    event.target.classList.add('selected');
    const selectedId = event.target.id;

    const figures = gallery.querySelectorAll('figure');

    figures.forEach(figure => {
      if (selectedId === 'tous') {
        figure.style.display = '';
      } else {
        const categoryId = figure.dataset.categoryId;
        if (categoryId === selectedId) {
          figure.style.display = '';
        } else {
          figure.style.display = 'none';
        }
      }
    });
  }

});


async function displayFilter() {
  const works = await getWorks();

  const categories = [];
  for (let i = 0; i < works.length; i++) {
    const work = works[i];
    if (categories.find((category) => category.id === work.category.id)) {
      continue;
    } else {
      categories.push(work.category);
    }
  }

  categories.forEach(filtre => {
    createRadioButton(filtre.id, filtre.name);
  });
}
displayFilter();

const modeedition = document.getElementById('modeedition')

const token = localStorage.getItem("token");
if (token) {
  console.log("Utilisateur connecté");
  document.querySelectorAll(".login").forEach(el => el.style.display = "none");
  document.querySelectorAll(".logout").forEach(el => el.style.display = "block");
  filtres.style.display = "none";
  modeedition.style.display = "flex"
  
} else {
  console.log("Utilisateur non connecté");
  document.querySelectorAll(".login").forEach(el => el.style.display = "block");
  document.querySelectorAll(".logout").forEach(el => el.style.display = "none");
  filtres.style.display = "flex";
  modeedition.style.display = "none"
  
}


document.querySelectorAll(".logout").forEach(button => {
  button.addEventListener("click", () => {
    console.log("Logout cliqué");
    localStorage.removeItem("token");

    location.reload();


  });
});


//modale

const openModal1 = document.querySelector(".openModal1")

if (token) {
  openModal1.style.display = 'inline-block';
}

const modal1 = document.getElementById('modal1')
const closeModal1 = document.querySelector(".js-modal-close1")


openModal1.addEventListener('click', () => { modal1.style.display = "flex" })
closeModal1.addEventListener('click', () => { modal1.style.display = "none" })


modal1.addEventListener('click', (event) => {
  if (event.target === modal1) {
    modal1.style.display = "none";
  }
});



const openModal2 = document.querySelector(".openModal2")
const modal2 = document.getElementById('modal2')
const closeModal2 = document.querySelector(".js-modal-close2")
const modalback = document.querySelector(".js-modal-back")

openModal2.addEventListener('click', () => {
  modal2.style.display = "flex";
  modal1.style.display = "none";
})


closeModal2.addEventListener('click', () => {
  modal2.style.display = "none"
  reiniitialisation()
})

modal2.addEventListener('click', (event) => {
  if (event.target === modal2) {
    modal2.style.display = "none";
    reiniitialisation();
  }
});


modalback.addEventListener('click', () => {
  modal2.style.display = "none";
  modal1.style.display = "flex";
  reiniitialisation();
})



const galleryImg = document.querySelector(".galleryImg")



function createFigureModal(work) {
  const figure = document.createElement('figure');
  figure.dataset.workId = work.id;

  const image = document.createElement('img');
  image.alt = work.title;
  image.src = work.imageUrl;

  const supprimer = document.createElement('button');
  const icon = document.createElement('i');
  icon.className = 'fa-solid fa-trash-can';
  supprimer.appendChild(icon);

  figure.appendChild(supprimer);
  figure.appendChild(image);

  return { figure, supprimer };
}

async function displayPicturs() {
  galleryImg.innerHTML = '';
  const works = await getWorks();
  works.forEach(work => {
    const { figure, supprimer } = createFigureModal(work);
    addDeleteListener(supprimer, figure);
    galleryImg.appendChild(figure);
  });
}

displayPicturs();

function addDeleteListener(button, figure) {
  button.addEventListener('click', (e) => {
    e.stopPropagation();
    handleDeleteWork(figure);
  });
}

async function handleDeleteWork(figure) {
  const confirmed = confirm("Voulez-vous vraiment supprimer ce projet ?");
  if (!confirmed) return;

  const workId = figure.dataset.workId;

  try {
    const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    if (response.ok) {
      figure.remove();
      await displayWorks();
      await displayPicturs();
    }
  } catch (error) {
    console.error("Erreur réseau :", error);
  }
}



//modal 2

const choix = document.getElementById('choix');

async function displayOptions() {
  const works = await getWorks();

  const categories = [];
  for (let i = 0; i < works.length; i++) {
    const work = works[i];
    if (!categories.find(category => category.id === work.category.id)) {
      categories.push(work.category);
    }
  }
  const choix = document.getElementById('choix');
  categories.forEach(categorie => {
    const option = document.createElement('option');
    option.value = categorie.id;
    option.textContent = categorie.name;
    choix.appendChild(option);
  });
}

displayOptions();


const dropzone = document.getElementById('dropzone');
const preview = document.getElementById('preview');

dropzone.addEventListener('dragover', (e) => e.preventDefault());

dropzone.addEventListener('drop', (e) => {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  preview.src = URL.createObjectURL(file);
  infoDrop.style.display = "none";
});


const addPhotoBtn = document.getElementById('addPhotoBtn')
const fileInput = document.getElementById('fileInput');

addPhotoBtn.addEventListener('click', () => {
  fileInput.click();
});

fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  if (file) {
    preview.src = URL.createObjectURL(file);
    infoDrop.style.display = "none";
  }
});



document.querySelector('.formAjout').addEventListener('submit', async e => {
  e.preventDefault();

  const file = document.getElementById('fileInput').files[0];
  const title = document.getElementById('texte').value;
  const category = document.getElementById('choix').value;
  const token = localStorage.getItem('token');

  if (!file || !title || !category) return alert('Remplis tout stp');

  const data = new FormData();
  data.append('image', file);
  data.append('title', title);
  data.append('category', category);

  const res = await fetch('http://localhost:5678/api/works', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: data
  });

  if (res.ok) {
    const newWork = await res.json();
    await displayWorks();
    await displayPicturs();

    alert('Projet ajouté');
    e.target.reset();
    preview.removeAttribute('src');
    document.getElementById('infoDrop').style.display = 'flex';
  } else {
    alert('Erreur');
  }
});


function reiniitialisation() {
  preview.src = '';
  fileInput.value = '';
  infoDrop.style.display = 'flex';
}


