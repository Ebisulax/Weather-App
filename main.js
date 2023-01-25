console.clear();

const inputField = document.createElement("input");
const root = document.querySelector('#root');
let autoCorrectField

inputField.setAttribute("id", "input");
inputField.setAttribute("type", "text");

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
                if (el.name.startsWith(str)){
                    addAutoCorrect(el)
                }
            }
        })
}

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

function displayWeatherCard(city){
    fetch(`http://api.weatherapi.com/v1/current.json?key=84bfaaf9b255449480d172558230301&q=${city.name}&aqi=no`)
        .then (res => res.json())
        .then (data => {
            console.log (data);
            let card = document.createElement("div");
            card.setAttribute("id", "card");
            root.appendChild(card);
        
            let p = document.createElement("p");
            card.appendChild(p);
            p.innerText=
            `Temperature: ${data.current.feelslike_c}°C\n
            ${data.current.condition.text}\n
            Windspeed: ${data.current.gust_kph} kph`;
        });
}

function clearInputField(){
    inputField.value = "";
}