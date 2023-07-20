// projects
let projectCards = [...document.querySelectorAll(".project-card")];
// console.log(projectCards);

var imgs = document.querySelectorAll(".img-certif");

let video = document.querySelector(".video");
let videoContainer = document.querySelector(".videocontainer");

// project details container

let projectName = document.querySelector(".project-details .name");
// console.log("projectName :", projectName);
let projectImage = document.querySelector(".project-details .image");
// console.log("projectImage :", projectImage);
let projectDetail = document.querySelector(".project-details .details");
// console.log("projectDetail :", projectDetail);

// Buttons

let liveBtn = document.querySelector("#live-btn");
let githubBtn = document.querySelector("#github-btn");
let btnTranslate = document.querySelector("#translate");

let progressTrack = [...document.querySelectorAll(".progress-track")];
// console.log("progressTrack: ", progressTrack);

// J'ai remplacé les map() par forEach(). La différence entre map() et foreach() : map() renvoi un nouveau tableau, pas foreach().
// Si on à pas l'intention de se servir de map() pour retourner un nouveau tableau, autant utiliser forEach().
projectCards.forEach((project, i) => {
  project.addEventListener("click", () => {
    projectCards.forEach((card) => card.classList.remove("active"));
    project.classList.add("active");
    let data = JSON.parse(project.getAttribute("data-info"));
    // console.log("data : ", data);
    setUpProjectInfo(data);
  });
});

const setUpProjectInfo = (data) => {
  // btnTranslate.addEventListener("click", (event) => {
  //   let textBtn = btnTranslate.textContent;
  //   event.preventDefault();
  //   if (textBtn === "En français") {
  //     projectDetail.innerHTML = data.aboutf;
  //     btnTranslate.textContent = "in english";
  //   } else {
  //     projectDetail.innerHTML = data.about;
  //     btnTranslate.textContent = "En français";
  //   }
  // });

  // cette solution avec un toggle est légèrement plus complexe, mais elle offre plus de flexibilité. Elle permet aux utilisateurs de basculer entre les versions anglaise et française autant de fois qu'ils le souhaitent sans recharger la page ou effectuer une autre action.:
  let isEnglish = false;
  btnTranslate.addEventListener("click", (event) => {
    event.preventDefault();
    if (!isEnglish) {
      projectDetail.innerHTML = data.aboutf;
      btnTranslate.innerText = "In English"; // changer le texte du bouton
    } else {
      projectDetail.innerHTML = data.about;
      btnTranslate.innerText = "En français"; // revenir au texte original
    }
    isEnglish = !isEnglish; // basculer l'état
  });
  // utilisé "!data.video" qui prend en compte "null" et "", plutôt que 'data.video = "" '.
  if (!data.video) {
    projectImage.style.display = "block";
    videoContainer.style.display = "none";
    projectImage.src = data.image;
    //console.log(projectImage.src);
  } else {
    projectImage.style.display = "none";
    video.src = data.video;
    videoContainer.style.display = "block";
  }

  projectName.innerHTML = data.name;
  projectDetail.innerHTML = data.about;

  liveBtn.href = data.live;

  if (!data.github) {
    githubBtn.style.display = "none";
  } else {
    githubBtn.style.display = "block";
    githubBtn.href = data.github;
  }
  progressTrack.forEach((item) => {
    let progress = item.querySelector(".progress");
    // console.log("data : ", data);
    let language = item.getAttribute("data-name");
    let languageProgress = data.languages[language];

    if (languageProgress) {
      //console.log(data.languages[language]);
      progress.style.width = languageProgress;
      //console.log(item.parentElement);
      item.parentElement.style.display = "block";
    } else {
      item.parentElement.style.display = "none";
    }
    // progress.style.width = data.languages[item.getAttribute("data-name")];
  });

  // autre version :
  // progressTrack.forEach((lang) => {
  //   console.log("data : ", data);
  //   console.log("data.languages : ", data.languages);

  //   console.log("lang", lang);
  //   let lg = lang.getAttribute("data-name");
  //   let progress = lang.firstElementChild;
  //   console.log("data.languages.lg : ", data.languages[lg]);

  //   // console.log(data.languages[lg]);

  //   progress.style.width = data.languages[lg];
  // });
};

// filters

const filters = [...document.querySelectorAll(".filter-btn")];
//console.log(filters);
// filters.map((btn, i) => {
//   btn.addEventListener("click", () => {
//     filters.map((item) => item.classList.remove("active"));
//     btn.classList.add("active");
//     let tag = btn.getAttribute("data-filter-value");
//     //console.log("tag : ", tag);
//     // console.log(tag);
//     projectCards.map((project, i) => {
//       // console.log(project);
//       //console.log('project.getAttribute("data-tags") : ', project.getAttribute("data-tags"));
//       if (tag == "all") {
//         project.style.display = null; // display = null veut dire on enlève la propriété 'display' pour laisser s'afficher.
//       } else if (!project.getAttribute("data-tags").includes(tag)) {
//         project.style.display = "none"; // On ajoute la propriété 'display: "none" ' pour cacher.
//       } else {
//         project.style.display = null; // On enleve la propriété 'display' à ceux qui pouraient déjà l'avoir aquise par un filtre précédent.
//         //On aurait pû mettre 'display: "block"' mais autant la retirer puisqu'on ne l'avait pas au départ.
//       }
//     });
//   });
// });

// ******************************
// Cette méthode va ajouter la classe "active" à la première carte après avoir fait le filtre.
// Lorsqu'on clique sur un bouton de filtre, le code parcourt chaque carte de projet (project) dans l'ordre dans lequel elles apparaissent dans le tableau projectCards. La variable firstShown est initialement définie à true.
filters.map((btn, i) => {
  btn.addEventListener("click", () => {
    // Enlever la classe 'active' de toutes les cartes
    projectCards.map((project) => project.classList.remove("active"));

    filters.map((item) => item.classList.remove("active"));
    btn.classList.add("active");

    let tag = btn.getAttribute("data-filter-value");
    let firstShown = true;

    projectCards.map((project, i) => {
      if (tag == "all") {
        project.style.display = null;

        // Ajouter la classe 'active' à la première carte affichée:
        // Pour la première carte, comme firstShown est true, le code entre dans le bloc if, ajoute la classe 'active' à la carte de projet actuelle et appelle setUpProjectInfo() pour cette carte. Ensuite, il définit firstShown à false. Donc pour les autres cartes firstShown sera à false et la classe active ne sera pas appliquée.
        if (firstShown) {
          project.classList.add("active");
          setUpProjectInfo(projects[i]);
          firstShown = false;
        }

        // Même chose pour les cartes sélectionnées !! :
      } else if (!project.getAttribute("data-tags").includes(tag)) {
        project.style.display = "none";
      } else {
        project.style.display = null;

        // Ajouter la classe 'active' à la première carte affichée de la sélection:
        if (firstShown) {
          project.classList.add("active");
          setUpProjectInfo(projects[i]);
          firstShown = false;
        }
      }
    });
  });
});

projectCards[0].classList.add("active");
setUpProjectInfo(projects[0]);
// ********************************************

// navbar background

const navbar = document.querySelector("nav");

// le background de la navbar passe de transparent à noir

window.addEventListener("scroll", () => {
  // console.log(scrollY); // permet d'affiche la valeur de scroll - vidéo: 1h 08
  if (scrollY > 195 && window.innerWidth > 735) {
    navbar.classList.add("bg");
  } else {
    navbar.classList.remove("bg");
  }
});

// Affichage plein écran des image certification

imgs.forEach(function (img) {
  img.addEventListener("click", function () {
    img.classList.toggle("fullscreen");
  });
});

// toggle menu mobile

const toggleBtn = document.querySelector(".toggle-btn");
const linksContainer = document.querySelector(".links-container");

toggleBtn.addEventListener("click", () => {
  toggleBtn.classList.toggle("active");
  linksContainer.classList.toggle("active");
});

// Envoyer email

const sendEmailBtn = document.querySelector("#submit-btn");
sendEmailBtn.addEventListener("click", (event) => {
  event.preventDefault();

  let message = getMessage();
  //console.log("message :", message);
  //console.log("message.hisEmail :", message.hisEmail);
  fetch("/message", {
    method: "post",
    headers: new Headers({ "Content-Type": "application/json" }),
    body: JSON.stringify({
      hisname: message.hisName,
      email: message.hisEmail,
      subject: message.subject,
      message: message.message,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      alert(data.alert);
      window.location.reload();
      // window.location.href = "http://localhost:3000/";
    });
});

function validateEmail(hisEmail) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(hisEmail);
}

const getMessage = () => {
  // validation
  let hisName = document.querySelector("#name").value;
  let hisEmail = document.querySelector("#email").value;
  //console.log(hisName);
  let subject = document.querySelector("#subject").value;
  let message = document.querySelector("#message").value;
  if (!hisName.length || !hisEmail.length || !subject.length || !message) {
    alert("fill all the inputs first");
  } else if (!validateEmail(hisEmail)) {
    alert("Your email adress is not valide");
  } else {
    //console.log(hisEmail);
    //console.log(hisName);
    return { hisName, hisEmail, subject, message };
  }
};
