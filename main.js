console.clear();

const inputField = document.createElement("input");
const root = document.querySelector('#root');
let autoCorrectField

inputField.setAttribute("id", "input");
inputField.setAttribute("type", "text");
inputField.classList.add("search")

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
    console.log("hi");
    return today;

}

function displayWeatherCard(city){
    fetch(`http://api.weatherapi.com/v1/current.json?key=84bfaaf9b255449480d172558230301&q=${city.name}&aqi=no`)
        .then (res => res.json())
        .then (data => {
            console.log (data);
            let card = document.createElement("div");
            card.setAttribute("id", "card");
            root.appendChild(card);
        
            // let weatherData = document.createElement("p");
            // card.appendChild(weatherData);
            // weatherData.innerText=
            // `Temperature: ${data.current.feelslike_c}°C\n
            // ${data.current.condition.text}\n
            // Windspeed: ${data.current.gust_kph} kph`;

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

        });
}

function clearInputField(){
    inputField.value = "";
}