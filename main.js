let cityInput = document.querySelector(".city-input");
let serachBtn = document.querySelector(".search-btn");
let Notfoundsection = document.querySelector(".not-found");
let searchCitySection = document.querySelector(".search-city");
let weatherInfoSection = document.querySelector(".weather-info");
let countryName = document.querySelector(".conutry-name");
let temprature = document.querySelector(".temp-txt");
let conditionText = document.querySelector(".condition-txt");
let HumidityValue = document.querySelector(".humidity-value-txt");
let windValue = document.querySelector(".wind-value-txt");
let weatherSummaryImg = document.querySelector(".weather-summary-img");
let currentDate = document.querySelector(".current-date");
let forcastContainer = document.querySelector(".forecast-items-container");

const ApiKey = "74fab9b5f3dbf5841aea350aa20d974f";
serachBtn.addEventListener("click", () => {
	if (cityInput.value.trim() != "") {
		updateWeatherInfo(cityInput.value);
		cityInput.value = "";
		cityInput.blur();
	}
});
cityInput.addEventListener("keydown", (event) => {
	if (event.key == "Enter" && cityInput.value.trim() != "") {
		updateWeatherInfo(cityInput.value);
		cityInput.value = "";
		cityInput.blur();
	}
});

async function getFetchedData(endPoint, city) {
	const apiUlr = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${ApiKey}&units=metric`;
	const response = await fetch(apiUlr);
	return response.json();
}
async function updateWeatherInfo(city) {
	let weatherData = await getFetchedData("weather", city);
	if (weatherData.cod != 200) {
		showDisplaySection(Notfoundsection);
		return;
	}
	const {
		name: country,
		main: { temp, humidity },
		weather: [{ id, main }],
		wind: { speed },
	} = weatherData;
	countryName.textContent = country;
	temprature.textContent = `${Math.round(temp)}°C`;
	conditionText.textContent = main;
	HumidityValue.textContent = `${humidity}%`;
	windValue.textContent = `${speed} M/s`;
	weatherSummaryImg.src = `assets/weather/${getWeatherIcon(id)}`;
	currentDate.textContent = getCurrentDate();
	await updateForcastInfo(city);
	showDisplaySection(weatherInfoSection);
	console.log(weatherData);
}
async function updateForcastInfo(city) {
	let forecastData = await getFetchedData("forecast", city);
	let timeTake = "12:00:00";
	let todayDate = new Date().toISOString().split("T")[0];
	forcastContainer.innerHTML = "";
	forecastData.list.forEach((forCastWeather) => {
		if (
			forCastWeather.dt_txt.includes(timeTake) &&
			!forCastWeather.dt_txt.includes(todayDate)
		) {
			// console.log(forCastWeather);
			updateForcastItems(forCastWeather);
		}
	});
}

function showDisplaySection(section) {
	[Notfoundsection, weatherInfoSection, searchCitySection].forEach(
		(s) => (s.style.display = "none")
	);
	section.style.display = "flex";
}

function getWeatherIcon(id) {
	if (id <= 232) return "thunderstorm.svg";
	if (id <= 231) return "drizzle.svg";
	if (id <= 531) return "rain.svg";
	if (id <= 622) return "snow.svg";
	if (id <= 781) return "atomsphere.svg";
	if (id <= 800) return "clear.svg";
	else return "clouds.svg";
}

function getCurrentDate() {
	const date = new Date();
	const options = {
		weekday: "short",
		day: "2-digit",
		month: "short",
	};

	return date.toLocaleDateString("en-GB", options);
}

function updateForcastItems(weatherData) {
	console.log(weatherData);
	const {
		dt_txt: date,
		weather: [{ id }],
		main: { temp },
	} = weatherData;
	const dateTaken = new Date(date);
	const resultDate = dateTaken.toLocaleDateString("en-US", {
		day: "2-digit",
		month: "short",
	});
	const forcastItem = `
        <div class="forecast-item">
			<h5 class="forecst-item-data regular-txt">${resultDate}</h5>
			<img
				src="assets/weather/${getWeatherIcon(id)}"
				alt=""
				class="forecast-item-img"
			/>
			<h5 class="forecast-item-temp">${Math.round(temp)}°C</h5>
		</div>
                    `;
	forcastContainer.insertAdjacentHTML("beforeend", forcastItem);
}
