import React, { useEffect, useState } from 'react';
import { Bar, Pie } from "react-chartjs-2";
import { Chart as chartjs } from "chart.js/auto"
import axios from 'axios';
import Loader from './Loader';
import { Typography } from '@mui/material';


const BarChart = ({ lat, lng }) => {
    const [chartData, setChartData] = useState(null);
    const [userData, setUserData] = useState(null);
    const [displayChart, setDisplayChart] = useState(true)
    const [percentage, setPercentage] = useState(null)
    useEffect(() => {
        console.log(lat, lng)
        if (lat) {
            getChartData(lat, lng);
        }
    }, [lat, lng])
    useEffect(() => {
        if (chartData && chartData.intensities_requested.length === 9) {
            setDisplayChart(true)
            setPercentage(calculateCrimePercentages(chartData.intensities_max, chartData.intensities_min, chartData.intensities_requested))
            setUserData({
                // UserData.map((data) => data.year)
                labels: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023],
                datasets: [{
                    label: "Crimes",
                    data: chartData.intensities_requested,
                    backgroundColor: [
                        "#264653",
                        "#287271",
                        "#2A9D8F",
                        "#8AB17D",
                        "#E9C46A",
                        "#EFB366",
                        "#F4A261",
                        "#EE8959",
                        '#E76F51'
                    ],
                    borderWidth: 0,
                }]
            })
        } else {
            setDisplayChart(false)
        }
    }, [chartData])

    function calculateCrimePercentages(crimesMax, crimesMin, crimesRegion) {
        const totalCrimes = crimesRegion.reduce((acc, curr) => acc + curr, 0);
        const maxCrimes = crimesMax.reduce((acc, curr) => acc + curr, 0);
        const minCrimes = crimesMin.reduce((acc, curr) => acc + curr, 0);

        const lessPercentage = ((maxCrimes - totalCrimes) / maxCrimes) * 100;
        const morePercentage = ((totalCrimes - minCrimes) / minCrimes) * 100;

        return [lessPercentage, morePercentage];
    }

    const getChartData = (lat, lng) => {
        axios.get(`http://127.0.0.1:5000/predict_crimes?lat=${lat}&lng=${lng}`)
            .then(function (response) {
                console.log("SUCCESS", response.data)
                setChartData(response.data)
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    return (
        <div style={{ width: "100%", height: "100%" }}>
            {/* <div style={{ width: "100%", height: "30%" }}>
                <Bar data={userData} />
            </div> */}
            <div style={{ width: "100%", height: "100%", display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                {displayChart === true && userData === null ?
                    <Loader />
                    :
                    displayChart === true && userData !== null ?
                        <>
                            <Pie data={userData} />
                            <Typography variant='h6'>
                                Crimes in <span style={{ color: '#ff2625', textTransform: 'capitalize' }}>({lat}°, {lng}°)</span> over the years
                            </Typography>
                            <Typography variant='p' sx={{ color: '#333' }}>
                                <span style={{ color: '#ff2625', textTransform: 'capitalize' }}>{percentage[0].toFixed(2)}%</span> less crimes compared to the most dangerous area.
                            </Typography>
                        </>
                        :
                        <Typography variant='h6'>Either you clicked outside Boston or<br /> There is not enough data to display</Typography>}

            </div>
        </div>
    )
}

export default BarChart