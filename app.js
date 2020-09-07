window.addEventListener('load', ()=> {
  // Долгота
  let long;
  // Широта
  let lat;
  let enterCity = document.querySelector('.enter-city');
  let enterLocation = document.querySelector('.enter-location');
  let temperatureDescription = document.querySelector('.temperature-description');
  let temperatureDegree = document.querySelector('.temperature-degree');
  let temperatureRange = document.querySelector('.temperature-range');
  let locationTimezone = document.querySelector('.location-timezone');
  let temperatureSection = document.querySelector('.temperature');
  let windSpeed = document.querySelector('.wind-speed');
  const temperatureSpan = document.querySelector('.temperature span');
  
  // Ключ API
  const keyApi = "6d12c4c1ee00ba22604a64e4e7f7cbb3";
  
  // Получение данных о погоде по местоположению пользователя
  weatherDataByLocation();

  // Нажатие на кнопку ввода погоды по названию введёного города
  enterCity.addEventListener("click", () => {
    let inputValue = document.querySelector('.inputValue');
    const api = "http://api.openweathermap.org/data/2.5/weather?q=" + inputValue.value + "&appid=" + keyApi;
    fetch(api)
        .then(response =>response.json())
        .then(data => {
          // Установка DOM элементов из API
          const timezone = data['name'];
          
          // Значения температур в Кельвинах
	  const temperature = data['main']['temp'];
          const temperature_min = data['main']['temp_min'];
          const temperature_max = data['main']['temp_max'];
          
          const summary = data['weather'][0]['description'];
          const icon = data['weather'][0]['main'];
          const wind = data['wind']['speed'];
          
          // Получение значений в Цельсиях и Фаренгейтах по формулам
          let celsius = kelvinToCelsius(temperature);
          let celsius_min = kelvinToCelsius(temperature_min);
          let celsius_max = kelvinToCelsius(temperature_max);
          
          let fahrenheit = celsiusToFahrenheit(celsius);
          let fahrenheit_min = celsiusToFahrenheit(celsius_min);
          let fahrenheit_max = celsiusToFahrenheit(celsius_max);
          
          // Вывод полученых данных
          locationTimezone.textContent = timezone;
          temperatureDegree.textContent = Math.floor(celsius) + String.fromCharCode(176);
          temperatureRange.textContent = "(" + Math.floor(celsius_min) + String.fromCharCode(176) + "C - " + Math.floor(celsius_max) + String.fromCharCode(176) + "C)";
          temperatureDescription.textContent = summary;
          windSpeed.textContent = "Wind: " + wind + " meters per second";
          
          // Установка иконки погоды
          setIcons(icon, document.querySelector(".icon"));
          
          // Смена температуры на Цельсии/Фаренгейты при кликах мышью
          temperatureSection.addEventListener("click", ()=>{
            if (temperatureSpan.textContent === "F") {
              temperatureSpan.textContent = "C";
              temperatureDegree.textContent = Math.floor(celsius) + String.fromCharCode(176);
              temperatureRange.textContent = "(" + Math.floor(celsius_min) + String.fromCharCode(176) + "C - " + Math.floor(celsius_max) + String.fromCharCode(176) + "C)";
            }else {
              temperatureSpan.textContent = "F";
              temperatureDegree.textContent = Math.floor(fahrenheit) + String.fromCharCode(176);
              temperatureRange.textContent = "(" + Math.floor(fahrenheit_min) + String.fromCharCode(176) + "F - " + Math.floor(fahrenheit_max) + String.fromCharCode(176) + "F)";
            }
         });
        })
        .catch(err => alert("Wrong city name!"));
        inputValue.value = "";
  })
  
  // Нажатие на кнопку вывода погоды по местоположению пользователя
  enterLocation.addEventListener("click", () => {
    // Получение данных о погоде по местоположению пользователя
    weatherDataByLocation();
  })
  
  // Функция получения данных о погоде по местоположению пользователя
  function weatherDataByLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position =>{
        long = position.coords.longitude;
        lat = position.coords.latitude;
        const api = "http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + long+ "&appid=" + keyApi;
        
        fetch(api)
          .then(response =>response.json())
          .then(data => {
            // Установка DOM элементов из API
            const timezone = data['name'];
            
            // Значения температур в Кельвинах
            const temperature = data['main']['temp'];
            const temperature_min = data['main']['temp_min'];
            const temperature_max = data['main']['temp_max'];
            
            const summary = data['weather'][0]['description'];
            const icon = data['weather'][0]['main'];
            const wind = data['wind']['speed'];
            
            // Получение значений в Цельсиях и Фаренгейтах по формулам
            let celsius = kelvinToCelsius(temperature);
            let celsius_min = kelvinToCelsius(temperature_min);
            let celsius_max = kelvinToCelsius(temperature_max);
            
            let fahrenheit = celsiusToFahrenheit(celsius);
            let fahrenheit_min = celsiusToFahrenheit(celsius_min);
            let fahrenheit_max = celsiusToFahrenheit(celsius_max);
            
            // Вывод полученых данных
            locationTimezone.textContent = timezone;
            temperatureDegree.textContent = Math.floor(celsius) + String.fromCharCode(176);
            temperatureRange.textContent = "(" + Math.floor(celsius_min) + String.fromCharCode(176) + "C - " + Math.floor(celsius_max) + String.fromCharCode(176) + "C)";
            temperatureDescription.textContent = summary;
            windSpeed.textContent = "Wind: " + wind + " meters per second";
            
            // Установка иконки погоды
            setIcons(icon, document.querySelector(".icon"));
            
            // Смена температуры на Цельсии/Фаренгейты при кликах мышью
            temperatureSection.addEventListener("click", ()=>{
              if (temperatureSpan.textContent === "F") {
                temperatureSpan.textContent = "C";
                temperatureDegree.textContent = Math.floor(celsius) + String.fromCharCode(176);
                temperatureRange.textContent = "(" + Math.floor(celsius_min) + String.fromCharCode(176) + "C - " + Math.floor(celsius_max) + String.fromCharCode(176) + "C)";
              }else {
                temperatureSpan.textContent = "F";
                temperatureDegree.textContent = Math.floor(fahrenheit) + String.fromCharCode(176);
                temperatureRange.textContent = "(" + Math.floor(fahrenheit_min) + String.fromCharCode(176) + "F - " + Math.floor(fahrenheit_max) + String.fromCharCode(176) + "F)";
              }
            });
          });
      });
    }
  }

  // Функция конвертации из градусов Кельвина в градусы Цельсия
  function kelvinToCelsius(kelvin) {
    return kelvin - 273.15;
  }

  // Функция конвертации из градусов Цельсия в градусы Фаренгейта
  function celsiusToFahrenheit(celsius) {
    return (celsius * 9/5) + 32;
  }
  
  // Функция установки иконок для отображения погоды
  function setIcons(icon, iconID) {
    const skycons = new Skycons({color: "white"});
    let currentIcon = icon.toUpperCase();

    switch (currentIcon) {
      case "CLOUDS":
        currentIcon = "CLOUDY";
        break;
      case "CLEAR":
        currentIcon = "CLEAR_DAY";
        break;
      case "HAZE": 
      case "SMOKE":
        currentIcon = "FOG";
        break;
      default:
        break;
    }

    skycons.play();
    return skycons.set(iconID, Skycons[currentIcon]);
  }
});
