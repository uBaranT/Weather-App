// Kullanacagimiz weather API icin olusturduk. Sehirler ile ilgili bilgileri vs.yi API uzerinden cekecegiz.

import { DateTime } from "luxon";

const API_KEY = ''; // enter your api-key
//const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const BASE_URL = ''; // https://api.openweathermap.org/data/2.5/weather?q={name}&appid={API_KEY}
//const BASE_URL= 'https://api.openweathermap.org/data/3.0/onecall?q=Istanbul&exclude=current,daily,hourly&appid={API_KEY}'
// https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}

const getWeatherData = (infoType, searchParams) => {
    const url = new URL(`${BASE_URL}/${infoType}`);
    url.search = new URLSearchParams({ ...searchParams, appid: API_KEY }).toString();

   // console.log(url);

    return fetch(url)
    .then((res) => res.json())
    .then((data) => data);

};


const formatCurrentWeather = (data) =>  {
    const {
        coord: {lat,lon},
        main: {temp, feels_like, temp_min, temp_max, humidity},
        name,
        dt,
        sys: {country,sunrise, sunset},
        weather,
        wind:{speed}

    } = data;

    const {main:details, icon} = weather[0];

    return {
        lat,
        lon,
        temp,
        feels_like,
        temp_max,
        temp_min,
        humidity,
        name, 
        dt,
        country,
        sunrise,
        sunset,
        weather,
        details,
        icon,
        speed
    };
};

const formatForecastWeather = (data) => {

    let { timezone,daily, hourly } = data;

        if (daily && Array.isArray(daily)) {

            daily = daily.slice(0,5).map((d) => {
                return {
                    title: formatToLocalTime(d.dt, timezone, 'ccc'),
                    temp: d.temp.day,
                    icon: d.weather[0].icon,
                };
            });
        }


        if (hourly && Array.isArray(hourly)) {

            hourly = hourly.slice (1,6).map((d) => {
                return {
                    title:formatToLocalTime(d.dt, timezone, 'hh:mm a'),
                    temp: d.temp,
                    icon: d.weather[0].icon,
                };
            });
        }

        return {timezone,daily,hourly};

        /*daily=daily.slice(1,6).map((d) => {
            return{
                title: formatToLocalTime(d.dt, timezone,'ccc'),
                temp: d.temp.day,
                icon: d.weather[0].icon
            }
        });

        hourly=hourly.slice(1,6).map((d) => {
            return{
                title: formatToLocalTime(d.dt, timezone,'hh:mm a'),
                temp: d.temp,
                icon: d.weather[0].icon,
            };
        });
    
     return {timezone,daily,hourly};
     */
};

const getFormattedWeatherData = async(searchParams) => {

    const formattedCurrentWeather = await getWeatherData ('weather',searchParams).then(formatCurrentWeather);

    const {lat,lon} = formattedCurrentWeather;

    const formattedForecastWeather = await getWeatherData('onecall', {
        lat,
        lon, 
        exclude: 'current, minutely, alerts',
        units: searchParams.units
    }).then(formatForecastWeather);

    return {...formattedCurrentWeather,...formattedForecastWeather};
};



const formatToLocalTime = (

    secs,
    zone,
    format = "cccc, dd LLL yyyy'| Local time: 'hh:mm a") => 
    DateTime.fromSeconds(secs).setZone(zone).toFormat(format);
                    
const iconUrlFromCode = (code) => 
`http://openweathermap.org/img/wn/${code}@2x.png`;

export default getFormattedWeatherData;

export {formatToLocalTime, iconUrlFromCode};
