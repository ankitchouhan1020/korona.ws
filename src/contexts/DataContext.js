import React, {
  createContext,
  useContext,
  useState,
  useEffect
 } from 'react';

 import * as cities from './cities.json';
 const DataContext = createContext();
 
 export function DataProvider(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [clickedCity, setClickedCity] = useState(null)
 

  // API presents official data from https://www.mohfw.gov.in/
  useEffect(() => {
   fetch("https://api.rootnet.in/covid19-in/stats/daily")
    .then(res => res.json())
    .then(
     (result) => {
      setData(processData(result));
      setIsLoading(false)
     },
     (error) => {
      console.log('error in restriving data.')
     });
  }, []);
 
  return ( <
   DataContext.Provider value = {
    {
     isLoading,
     ...data,
     clickedCity,
     setClickedCity
    }
   } {
    ...props
   }
   />
  )
 }
 
 export function useData() {
  return useContext(DataContext);
 }
 
 
 function processData(apiResult) {
  if (apiResult.success === 'false') return {};
  let data = apiResult.data;
  const len = data.length;

  // Correcting state naming in api
  data[9].regional[1].loc = "Chhattisgarh"
 
  // adding count field
  for (let i in data) {
   let cases = data[i].regional;
   for (let j in cases) {
    cases[j]['count'] = cases[j].confirmedCasesIndian + cases[j].confirmedCasesForeign;
   }
  }
 
  // To form same data as used in original project, we preprocess data
  // First date of database will contain all initial values
  // Onwards data will contain only increment in values
  // Code isn't optimized yet.

  let tempRegional = [];
  for (let i = len - 1; i > 0; i--) {
   tempRegional.push(solveDifference(data[i].regional, data[i - 1].regional));
  }

  for (let i = len - 1, j = 0; i > 0; i--, j++) {
   data[i].regional = tempRegional[j];
  }
 
  let parsedCases = [];
  for (let i = 0; i < len; i++) {
   parsedCases.push(parseCases(data, i))
  }

  let finalDatabase = parsedCases[0];
  finalDatabase['cities'] = cities['cities'];

  for (let i = 1; i < len; i++) {
   for (let j in parsedCases[i].cases) finalDatabase['cases'].push(parsedCases[i]['cases'][j]);
   for (let j in parsedCases[i].cures) finalDatabase['cures'].push(parsedCases[i]['cures'][j]);
   for (let j in parsedCases[i].deaths) finalDatabase['deaths'].push(parsedCases[i]['deaths'][j]);
  }
 
  return finalDatabase;
 }
 
 // Parse Cases according to old database
 function parseCases(data, targetDay) {
  let day = data[targetDay].day;
  let targetCases = data[targetDay].regional;
  let cases = [],
   deaths = [],
   cures = [];
 
  for (let i in targetCases) {
   let caseConfirmed = {
    "city": targetCases[i].loc,
    "count": targetCases[i].count,
    "date": day
   }
 
   cases.push(caseConfirmed);
   if (parseInt(targetCases[i].deaths) !== 0) {
    let death = {
     "city": targetCases[i].loc,
     "count": targetCases[i].deaths,
     "date": day
    }
    deaths.push(death);
   }
   if (parseInt(targetCases[i].discharged) !== 0) {
    let cure = {
     "city": targetCases[i].loc,
     "count": targetCases[i].discharged,
     "date": day
    }
    cures.push(cure);
   }
  }
 
  let res = {
   "cases": cases,
   "deaths": deaths,
   "cures": cures,
  }
  return res;
 }
 
 // Calculate difference between value of two consecutive days
 function solveDifference(regionalNew, regionalOld) {
  let tempDiff = [];
 
  for (let i in regionalNew) {
   let newState = true;
   for (let j in regionalOld) {
      if (regionalNew[i].loc === regionalOld[j].loc) {
      newState = false;
      let tempObj = {};
      tempObj.loc = regionalNew[i].loc
      tempObj.deaths = regionalNew[i].deaths - regionalOld[j].deaths;
      tempObj.discharged = regionalNew[i].discharged - regionalOld[j].discharged;
      tempObj.count = regionalNew[i].count - regionalOld[j].count;

      if (tempObj.deaths > 0 || tempObj.discharged > 0 || tempObj.count > 0) {
        tempDiff.push(tempObj);
        }
      }
      if (!newState) break;
   }
   if (newState) {
      tempDiff.push(regionalNew[i]);
    }
  }
  return tempDiff;
 }