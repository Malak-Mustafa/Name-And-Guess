let nameField = document.getElementById("name");
let theBtn = document.getElementById("btn");
let guessedNames = document.querySelector(".names");
let genderCont = document.querySelector("#gnCon");
let ageCont = document.querySelector("#ageCon");
let countriesCont = document.querySelector("#counCon");

showName();
function showName() {
  let storedNames = localStorage.getItem("nameList");
  if (!storedNames) {
    return 0;
  } else {
    let arr = storedNames.split(",");
    for (let i = 0; i < arr.length; i++) {
      let guessedName = document.createElement("li");
      guessedName.innerText = arr[i];
      guessedNames.append(guessedName);
    }
  }
}

theBtn.addEventListener("click", () => {
  genderCont.innerHTML = "";
  ageCont.innerHTML = "";
  countriesCont.innerHTML = "";
  guessedNames.innerHTML = "";

  let theName = nameField.value;
  let lastChar = theName.slice(-1, theName.length);
  if (!/\s/.test(lastChar)) {
    let x = localStorage.getItem("nameList");
    if (!x) {
      localStorage.setItem("nameList", theName);
    } else if (x.search(theName) == -1) {
      x = x + "," + theName;
      localStorage.setItem("nameList", x);
    }

    showName();
    function getGender(name) {
      let url = "https://api.genderize.io/?name=" + name;
      let getGender = fetch(url);
      getGender
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
        })
        .then((json) => {
          let gender = json.gender;
          let p = document.createElement("p");
          p.innerHTML = gender;
          genderCont.appendChild(p);
        });
    }
    function getAge(name) {
      let url = "https://api.agify.io/?name=" + name;
      let getAge = fetch(url);
      getAge
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
        })
        .then((json) => {
          let age = json.age;
          console.log(age);
          let p = document.createElement("p");
          p.innerHTML = age;
          ageCont.appendChild(p);
        });
    }
    function getCountries(name) {
      let url = "https://api.nationalize.io/?name=" + name;
      let getCountries = fetch(url);
      let countries = getCountries
        .then((response) => {
          if (response.ok) {
            //console.log(response)
            return response.json();
          }
        })
        .then((json) => {
          return json.country;
        });
      return countries;
    }

    let myPromises = [
      getGender(theName),
      getAge(theName),
      getCountries(theName),
    ];
    let allPromises = Promise.all(myPromises).then((response) => {
      let countries = response[2];
      let countriesStr = "";
      countries.forEach((element) => {
        countriesStr += element.country_id + ",";
      });
      countriesStr = countriesStr.slice(0, -1);
      console.log(countriesStr);
      let url = "https://restcountries.com/v3.1/alpha?codes=" + countriesStr;
      getFlags = fetch(url);
      //console.log(getFlags);
      getFlags
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
        })
        .then((json) => {
          // console.log(json);
          json.forEach((element) => {
            console.log(element.flags.png);
            let img = document.createElement("img");
            img.setAttribute("class", "flag");
            img.src = element.flags.png;
            countriesCont.appendChild(img);
          });
        });
    });
  } else {
    alert("you cannot add space to the name");
  }
});
