console.clear();

const inputField = document.createElement("input");
const root = document.querySelector('#root');
let autoCorrectField;

inputField.setAttribute("id", "input");
inputField.setAttribute("type", "text");
inputField.classList.add("search");

root.appendChild(inputField);

const input = document.querySelector("#input");

input.addEventListener("input", () => {
    const inputValue = input.value;
    removeAutoCorrectOptions();
    if (inputValue.length >= 3){
        checkForCities(inputValue);
    }
})

function checkForCities(str){
    fetch(`http://api.weatherapi.com/v1/search.json?key=84bfaaf9b255449480d172558230301&q=${str}`)
        .then (res => res.json())
        .then (data => {
            console.log (data);
            for (let el of data){
                if (el.name.toLowerCase().startsWith(str.toLowerCase())){
                    addAutoCorrect(el)
                }
            }
        })
}

//Show suggestive list of cities when entering 3 letters
function addAutoCorrect(city){
    autoCorrectField = document.createElement("p");
    autoCorrectField.innerText += city.name + ", " + city.country;
    autoCorrectField.classList.add('suggestion');
    autoCorrectField.addEventListener("click", () => {
        removeAutoCorrectOptions();
        clearInputField();
        displayWeatherCard(city);
    });
    root.appendChild(autoCorrectField);
}

function removeAutoCorrectOptions(){
    while (root.childElementCount>1){
    root.removeChild(root.lastChild)
    }
}

function getCurrentDate (){
    const date = new Date();

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    let today = `${day}.${month}.${year}`;
    return today;
}

function getSuggestionOfTheDay(temperature) {
    if(temperature <= 0) {
        return "Make a snow angel (or devil) scenery OR watch and review famous Christmas movies";
    } else if (temperature > 0 && temperature <= 5 ) {
        return "Go Ice Skating with friends OR try Yoga to warm up";  
    } else if (temperature > 5 && temperature <= 10) {
        return "Take a route to work/school you never did OR code an app that excites you";
    } else if (temperature > 10 && temperature <= 16) {
        return "Go to your fave cafè and watch the city around you OR clean out and rearrange your closet"; 
    } else if (temperature > 16 && temperature <= 22) { 
        return "Take a route to work/school you never did OR indoor workout dance class";
    } else if (temperature > 22 && temperature <= 26) {
        return "Stroll through the park and get your fave snack OR come up with your own Iced Coffee/Iced Tea recipe";
    } else if (temperature > 30) {
        return "Take a swim OR make yourself a cooling summer cocktail";
    }
}

function displayWeatherCard(city){
    fetch(`http://api.weatherapi.com/v1/current.json?key=84bfaaf9b255449480d172558230301&q=${city.name}&aqi=no`)
        .then (res => res.json())
        .then (data => {
            console.log (data);
            let card = document.createElement("div");
            card.setAttribute("id", "card");
            root.appendChild(card);

            let elementToday = document.createElement("p");
            elementToday.innerText = `Today, ${getCurrentDate()} in ${city.name} it is`;
            elementToday.classList.add("date");
            card.appendChild(elementToday);

            let elementTemperature = document.createElement("p");
            elementTemperature.innerText = `${data.current.feelslike_c}°C`;
            elementTemperature.classList.add("temperature");
            card.appendChild(elementTemperature);

            let elementWeatherCondition = document.createElement("p");
            elementWeatherCondition.innerText = `${data.current.condition.text}`;
            card.appendChild(elementWeatherCondition);

            let elementWindspeed = document.createElement("p");
            elementWindspeed.innerText = `Windspeed: ${data.current.gust_kph} kph`;
            card.appendChild(elementWindspeed);

            let elementIcon = document.createElement("img");
            elementIcon.src = `${data.current.condition.icon.slice(21)}`;
            elementIcon.classList.add("condition-icon")
            card.appendChild(elementIcon);

            let suggestion = document.querySelector("footer");
            suggestion.innerHTML = getSuggestionOfTheDay(data.current.feelslike_c);
        });
}


function clearInputField(){
    inputField.value = "";
}