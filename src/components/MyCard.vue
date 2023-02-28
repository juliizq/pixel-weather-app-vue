<template>
  <div class="bg"
    v-bind:style="[typeof weather.main != 'undefined' ? { backgroundImage: `url(${require('@/assets/' + background + '/' + background + '-' + time + '.gif')})` } : {}]">
  </div>
  <div class="card"
    v-bind:style="[typeof weather.main != 'undefined' ? { backgroundImage: `url(${require('@/assets/' + background + '/' + background + '-' + time + '.gif')})` } : {}]">
    <h1 class="pixel-text title">Pixel Weather</h1>
    <div class="search-container">
      <input class="search-input" v-model="query" type="text" placeholder="Search for a city :)" name="search"
        @keyup.enter="getWeatherData()" @input="searchLocations">
      <ul v-if="showList && searchResults && searchResults.length > 0">
        <a class="autocomplete-text" href="#" v-for="(result, index) in searchResults" :key="index"
          @click="selectLocation(result)">
          {{ result.name }}
        </a>
      </ul>
    </div>
    <div v-if="typeof weather.main == 'undefined'">
      <p class='pixel-text text-undefined' city>No <br> location <br> added yet.</p>
    </div>
    <div v-else-if="error === '404'">
      <p class="pixel-text text-undefined">Not found</p>
    </div>
    <div class="full" v-else-if="typeof weather.main !== 'undefined'">

      <div class="container-info">
        <p class="pixel-text city">{{ weather.name }}</p>
        <p class="pixel-text temperature">{{ Math.round(weather.main.temp) }}°</p>
        <p class="pixel-text description">{{ weather.weather[0].description }}</p>
      </div>
      <div class="container-detail">
        <div class="detail">
          <p class="title-detail">{{ weather.main.humidity }}%</p>
          <p class="subtitle-detail">humidity</p>
        </div>
        <div class="detail">
          <p class="title-detail">{{ Math.round(weather.main.feels_like) }}°</p>
          <p class="subtitle-detail">feels like</p>
        </div>
        <div class="detail">
          <p class="title-detail">{{ Math.round(weather.main.temp_min) }}°/{{ Math.round(weather.main.temp_max) }}°</p>
          <p class="subtitle-detail">min max</p>
        </div>
      </div>
    </div>
  </div>
  <div class="footer">
    <p>Made with ♥ by <a href="https://www.linkedin.com/in/juliana-izquierdo-b55b71166/" target="_blank">Juliana</a></p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "MyCard",
  props: {},
  components: {},
  data() {
    return {
      apiKey: process.env.VUE_APP_API_KEY,
      apiUrl: 'https://api.openweathermap.org/data/2.5/',
      username: process.env.VUE_APP_USERNAME,
      weather: {},
      error: '',
      query: '',
      country: '',
      background: '',
      time: String,
      sunset: 0,
      sunrise: 0,
      searchResults: [],
      showList: false,
    }
  },
  methods: {
    async getWeatherData() {
      if (!this.query) return;
      try {
        const res = await axios.get(`${this.apiUrl}weather?q=${this.query}&appid=${this.apiKey}&units=metric`);
        this.setResults(res.data);
      } catch (error) {
        this.setError(error);
      }
    }
    ,
    async setResults(results) {
      if (!results || !results.weather || results.weather.length === 0) {
        this.weather = {};
        this.error = '404';
        return;
      }
      this.weather = results;
      this.background = this.weather.weather[0].main;
      const localDate = new Date()
      const localTime = localDate.getTime()
      const localOffset = localDate.getTimezoneOffset() * 60000
      const utc = localTime + localOffset
      const city = utc + (1000 * results.timezone)
      this.error = '';
      const currentTime = new Date(city);

      if (currentTime.valueOf() / 1000 < results.sys.sunset) {
        this.time = 'day'
      } else {
        this.time = 'night'
      }

      if (results.sys !== undefined && 'country' in results.sys) {
        this.country = results.sys.country;
      }
    },
    setError(error) {
      if (error.response && error.response.status === 404) {
        this.error = '404';
      } else {
        this.error = error.response?.status?.toString() || '';
      }
    },
    async searchLocations() {
      if (this.query.length >= 2) {
        try {
          const response = await axios.get(`http://api.geonames.org/searchJSON?name_startsWith=${this.query}&maxRows=10&username=${this.username}`);
          this.searchResults = response.data.geonames.map(result => ({
            name: `${result.name}, ${result.countryName}`,
            id: result.geonameId,
          }));
          this.showList = true;
        } catch (error) {
          console.error(error);
        }
      } else {
        this.searchResults = [];
        this.showList = false;
      }
    },
    selectLocation(result) {
      this.query = result.name;
      this.showList = false;
      this.getWeatherData();
    },
    closeList() {
      this.showList = false;
    },
  }
}
</script>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');

.bg {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url("../assets/default.gif");
  background-size: cover;
  -webkit-filter: blur(20px);
  -moz-filter: blur(20px);
  -o-filter: blur(20px);
  -ms-filter: blur(20px);
  filter: blur(20px);
  animation: fadeIn 1s;
}

.card {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  border-radius: 30px;
  background-image: url("../assets/default.gif");
  display: flex;
  flex-direction: column;
  padding: 20px 25px;
  background-size: cover;
  box-shadow: rgba(0, 0, 0, 0.216) 0px 4px 12px;
  animation: fadeIn 1s;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }

  50% {
    opacity: 0.5;
  }

  100% {
    opacity: 1;
  }
}

.pixel-text {
  font-family: 'VT323', monospace;
}

.container-info {
  margin: 20px 15px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.30);
}

.full {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
}

.title {
  margin: 20px 10px;
}

.city {
  overflow: hidden;
}

.temperature {
  margin: 0;
}

.container-detail {
  display: flex;
  border: 1px solid white;
  justify-content: space-around;
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.169);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.602);
  padding: 7px 10px;
  text-align: center;
  align-items: center;
}

.detail {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px 20px;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.30);
}

.title-detail {
  margin: 0;
}

.subtitle-detail {
  margin: 0;
}

.search-container {
  border: 1px solid white;
  display: flex;
  justify-content: space-between;
  color: white;
  border-radius: 30px;
  width: 100%;
  height: 40px;
  background: rgba(255, 255, 255, 0.169);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  align-items: center;
  position: relative;
}

.search-input {
  margin: 0 10px;
  width: 100%;
  height: 100%;
  font-size: 1rem;
  border: none;
  outline: none;
  background-color: transparent;
  color: white;

  &:focus {
    border: none;
    background-color: transparent;
  }
}

.search-container ul {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  margin: 0;
  margin-top: 5px;
  border-radius: 30px;
  list-style-type: none;
  z-index: 1;
  background: rgba(244, 244, 244, 0.821);
  color: white;
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border: 1px solid white;
  padding: 0;
  overflow-x: hidden;
}

.search-container a {
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 10px;
  cursor: pointer;
  color: black;
  display: block;
  width: 100%;
  text-decoration: none;
}

.search-container a:hover {
  background-color: #ffffff;
}

.search-button {
  background-color: transparent;
  color: white;
  border: none;
  cursor: pointer;
}

.text-undefined {
  margin: 20px 10px;
}

::placeholder {
  /* Chrome, Firefox, Opera, Safari 10.1+ */
  color: white;
  opacity: 1;
  /* Firefox */
}

:-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  color: white;
}

::-ms-input-placeholder {
  /* Microsoft Edge */
  color: white;
}

.footer {
  display: flex;
  align-items: center;
  justify-content: center;
  color: black;
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, -50%);
}

.footer a {
  text-decoration: none;
  color: black;
}


@media only screen and (max-width: 595px) {
  .card {
    width: 250px;
    height: 400px;
  }

  .title,
  .city {
    font-size: 2rem;
  }

  .search-container {
    height: 30px;
  }


  .text-undefined {
    font-size: 1.6rem;
  }

  .temperature {
    font-size: 2.5rem;
  }

  .title-detail {
    font-size: 1rem;
  }

  .subtitle-detail {
    font-size: .8rem;
  }

  .description {
    font-size: 1.2rem;
  }

  .container-detail {
    padding: 0;
  }
}

@media only screen and (min-width: 600px) {
  .card {
    width: 300px;
    height: 500px;
  }

  .title,
  .city {
    font-size: 2rem;
  }

  .text-undefined {
    font-size: 1.6rem;
  }

  .temperature {
    font-size: 4rem;
  }

  .title-detail {
    font-size: 1rem;
  }

  .subtitle-detail {
    font-size: .8rem;
  }
}

@media only screen and (min-width: 768px) {
  .card {
    width: 350px;
    height: 550px;
  }

  .title,
  .city {
    font-size: 3rem;
  }

  .text-undefined {
    font-size: 1.9rem;
  }

  .temperature {
    font-size: 6rem;
  }

  .title-detail {
    font-size: 1.2rem;
  }

  .subtitle-detail {
    font-size: .8rem;
  }

  .description {
    font-size: 1.4rem;
  }

}

@media only screen and (min-width: 1025px) {
  .card {
    width: 400px;
    height: 650px;
  }

  .text-undefined {
    font-size: 2.2rem;
  }

  .temperature {
    font-size: 8rem;
  }

  .title-detail {
    font-size: 1.4rem;
  }

  .subtitle-detail {
    font-size: 1rem;
  }

  .description {
    font-size: 1.6rem;
  }

}

@media only screen and (min-width: 1200px) {
  .card {
    width: 400px;
    height: 650px;
  }

  .text-undefined {
    font-size: 2.6rem;
  }

  .temperature {
    font-size: 9rem;
  }

  .title-detail {
    font-size: 1.6rem;
  }

  .subtitle-detail {
    font-size: 1.2rem;
  }

  .description {
    font-size: 1.8rem;
  }

}

@media only screen and (min-width: 2000px) {
  .card {
    width: 700px;
    height: 1100px;
  }

  .text-undefined {
    font-size: 4rem;
  }

  .temperature {
    font-size: 12rem;
  }

  .title-detail {
    font-size: 2.6rem;
  }

  .subtitle-detail {
    font-size: 2.2rem;
  }

  .description {
    font-size: 2.8rem;
  }

  .city {
    font-size: 7rem;
  }

  .title {
    font-size: 5rem;
  }

  .search-container {
    height: 70px;
  }

  .search-input {
    font-size: 2rem;
  }
}</style>