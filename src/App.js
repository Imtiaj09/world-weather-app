import logo from './logo.svg';

import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {IoMdSunny, IoMdRainy, IoMdCloudy, IoMdSnow, IoMdThunderstorm, IoMdSearch} from 'react-icons/io'

import {BsCloudHaze2Fill, BsCloudDrizzleFill, BsEye, BsWater, BsThermometer,BsWind, } from 'react-icons/bs';

import { TbTemperatureCelsius } from 'react-icons/tb';
import { ImSpinner8 } from 'react-icons/im';
import { icons } from 'react-icons';

//API key from Openweathermap 
const APIkey = '6b0370aea5bbda7aa301a434f49ee9d2'

function App() {
  const [data, setData] = useState(null);
  const [location, setLocation] = useState('Dhaka');
  const [inputValue, setInputValue] = useState('');
  const [animate, setAnimate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMassage, setErrorMassage] = useState('');

  const handleInputValue = e => {
    setInputValue(e.target.value)
  };

  const handleSubmit = e => {
    // console.log(inputValue)
    
    //not empty
    if (inputValue !== '') {
      setLocation(inputValue);
    }

    //select the input
    const input = document.querySelector('input');

    //value is empty set the animate true
    if (input.value === '') {
      setAnimate(true)

      setTimeout(() => {
        setAnimate(false);
      }, 500)
    }

    //to clear input
    input.value = '';

    //default value
    e.preventDefault()
  }

  // console.log(inputValue)

  // fetch the data
  useEffect(() => {
    //Loading true
    setLoading(true);
    
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${APIkey}`

    axios(url)
    .then((res) => {
      //after 1500ms the data will show
      setTimeout(() => {
        setData(res.data);
        //Loading false
        setLoading(false);
      }, 1500);

    }).catch(err => {
      setLoading(false);
      setErrorMassage(err);
    })
  }, [location])
  // console.log(data)

  //set error
  useEffect(() => {
    const timer = setTimeout(() => {
      setErrorMassage('')
    }, 2000)

    return ()=> clearTimeout(timer);
  }, [errorMassage])

  if (!data) {
    return <div>
      <div className='w-full h-screen bg-gradientBg bg-no-repeat bg-cover bg-center flex flex-col justify-center items-center'>
        <ImSpinner8 className='text-5xl animate-spin text-white'/>
      </div>
    </div>
  }

  let icon;
  // console.log(data.weather[0].main);

  switch (data.weather[0].main) {
    case 'Clouds':
      icon = <IoMdCloudy />;
      break;
    case 'Haze':
      icon = <BsCloudHaze2Fill />;
      break;
    case 'Rain':
      icon = <IoMdRainy className='text-[#31cafb]' />;
      break;
    case 'Clear':
      icon = <IoMdSunny className='text-[#ffde33]' />;
      break;
    case 'Drizzle':
      icon = <BsCloudDrizzleFill className='text-[#31cafb]' />;
      break;
    case 'Snow':
      icon = <IoMdSnow className='text-[#31cafb]' />;
      break;
    case 'Thunderstorm':
      icon = <IoMdThunderstorm />;
      break;
  }

  // Date
  const date = new Date();

  return (
    <div className='w-full h-screen bg-gradientBg bg-no-repeat bg-cover bg-center flex flex-col items-center justify-center px-4 lg:px-0'>
      {/* Fix korte hobe */}
      {errorMassage && (
        <div className='w-full max-w-[90vw] lg:max-w-[450px] text-center bg-[#ff208c] text-white absolute top-1 rounded-md'>{`${errorMassage.response.data.message}`}</div>
      )}

      {/* From Start */}
      <from className={`${animate ? 'animate-shake' : 'animate-none'} h-16 bg-black/30 w-full max-w-[450px] rounded-2xl backdrop-blur-[32px] mb-8`}>
        <div className='h-full relative flex items-center justify-between p-2'>
        <input 
        onChange={(e)=> handleInputValue(e)}
        className='flex-1 bg-transparent outline-none placeholder:text-white text-white text-[15px] font-light pl-6 h-full'
        type='text' 
        placeholder='Search by City or Country'/>
        <button onClick={(e)=> handleSubmit(e)} className='bg-[#8fdbff] hover:bg-[#8fc9ff] w-20 h-12 rounded-full flex justify-center items-center transition'>
          <IoMdSearch className='text-xl text-white'/>
        </button>
        </div>
      </from>
      {/* From End */}

      {/* card */}
      <div className='w-full max-w-[450px] bg-black/20 min-h-[584px] text-white backdrop-blur-[32px] rounded-[32px] py-12 px-6'>
      {loading ? 
      (<div className='w-full h-full flex justify-center items-center'><ImSpinner8 className='text-white text-5xl animate-spin'/></div>)
      :     
        (<div>
          {/* Start */}
          <div className='flex items-center gap-x-5'>
           {/* Top Card */}
           <div className='text-[90px]'>{icon}</div>
          
           <div>
            {/* Body Card - Country Name*/}
            <div className='text-2xl font-semibold'>{data.name}, {data.sys.country}</div>

            {/* Current Date */}
            <div>{date.getUTCDate()}-{date.getUTCMonth() + 1}-{date.getUTCFullYear()}</div>
            </div>
          </div>
          {/* End */}

          {/*Body Card*/}
          <div className='my-20'>
            <div className='flex justify-center items-center'>
              {/* Temperature */}
            <div className='text-[144px] leading-none'>{parseInt(data.main.temp)}</div>

            {/* Celsius icon set*/}
            <div className='text-4xl'>
              <TbTemperatureCelsius/>
            </div>
            </div> 

            {/* Weather description */}
            <div className='capitalize text-center'>
              {data.weather[0].description}
            </div>
          </div>

          {/* card bottom*/}
          <div className='max-w-[375px] mx-auto flex flex-col gap-y-6'>
            <div className='flex justify-between'>
                {/* Eye icon for Visibility */}
              <div className='flex items-center gap-x-2'>
                <div className='text-[20px]'>
                  <BsEye/>
                </div>
                <div>
                Visibility <span className='ml-2'>{data.visibility / 1000} km</span>
                </div>
              </div>

                {/* Thermometer icon for Feels Like */}
              <div className='flex items-center gap-x-2'>
                <div className='text-[20px]'>
                  <BsThermometer/>
                </div>

                <div className='flex'>
                Feels Like 
                <div className='flex ml-2'>{parseInt(data.main.feels_like)}
                <TbTemperatureCelsius/>
                </div>               
                </div>

              </div>
            </div>

            <div className='flex justify-between'>
                {/* Water icon for Humidity */}
              <div className='flex items-center gap-x-2'>
                <div className='text-[20px]'>
                  <BsWater/>
                </div>
                <div>
                Humidity <span className='ml-2'>{data.main.humidity} %</span>
                </div>
              </div>

                {/* Wind icon for Feels Like */}
              <div className='flex items-center gap-x-2'>
                <div className='text-[20px]'>
                  <BsWind/>
                </div>

                <div>Wind <spin className='ml-2'>{data.wind.speed} m/s</spin></div>
                
              </div>
            </div>

          </div>         
        </div>)
      }

      </div>
    </div>
  );
}

export default App;
