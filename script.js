const cityInput = document.querySelector('.weather-input input')
const searchBtn = document.querySelector('.search-bttn')
const locationBtn = document.querySelector('.loc-bttn')
const weatherCards = document.querySelector('.weather-cards')
const currWeather = document.querySelector('.curr-weather')


function updateCards(name, days, idx) {
    if (idx) {
        weatherCards.innerHTML += `<li class="cards">
                                    <h3>(${days.dt_txt.slice(0, -9)})</h3>
                                    <div class="icon">
                                        <img src="https://openweathermap.org/img/wn/${days.weather[0].icon.slice(0, -1)}d@2x.png" alt="weather-icon">
                                        <h5>${days.weather[0].description}</h5>
                                    </div>
                                    <h4>Temp: ${Math.trunc((days.main.temp - 273.15))}°C</h4>
                                    <h4>Wind: ${days.wind.speed}m/s</h4>
                                    <h4>Humidity:${days.main.humidity}%</h4>
                                   </li>`
    }
    else {
        currWeather.innerHTML = `<div class="info">
                                    <h2>${name} (${days.dt_txt.slice(0, -9)})</h2>
                                    <h4>Temp: ${Math.trunc((days.main.temp - 273.15))}°C</h4>
                                    <h4>Wind: ${days.wind.speed}m/s</h4>
                                    <h4>Humidity: ${days.main.humidity}%</h4>
                                </div>
                                <div class="icon">
                                    <img src="https://openweathermap.org/img/wn/${days.weather[0].icon.slice(0, -1)}d@2x.png" alt="weather-icon">
                                    <h4>${days.weather[0].description}</h4>
                                </div>`
    }

}


const getWeatherForecast = async (name, lat, lon) => {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=9c226dabb58d69666c4edf8a14665721`)
    const data = await response.json()
    console.log(data)
    const uniqueDate = []

    const forcastDays = data.list.filter(forecast => {
        const forecastDate = new Date(forecast.dt_txt).getDate()

        if (!uniqueDate.includes(forecastDate)) return uniqueDate.push(forecastDate)
    })

    // console.log(forcastDays);
    weatherCards.innerHTML = ''
    forcastDays.forEach((day, idx) => {
        updateCards(name, day, idx)
    })
}


const getDetails = async (cityName) => {
    try {
        const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=9c226dabb58d69666c4edf8a14665721`)
        const data = await response.json()

        const { name, lat, lon } = data[0]
        getWeatherForecast(name, lat, lon)

    } catch (error) {
        console.log('error :', error)
    }
}
searchBtn.addEventListener('click', () => {
    getDetails(cityInput.value)
    cityInput.value = ''
})



const getUserDetails = () => {
    navigator.geolocation.getCurrentPosition(
        async position => {
            const { latitude, longitude } = position.coords

            const response = await fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=9c226dabb58d69666c4edf8a14665721`)
            const data = await response.json()
            console.log(data)
            getWeatherForecast(data[0].name, latitude, longitude)
        },
        error => {
            alert(`${error.message}.Please reset your permission`)
        }
    )
}
locationBtn.addEventListener('click', getUserDetails)


window.addEventListener('load', () => {
    getDetails('agartala')
})