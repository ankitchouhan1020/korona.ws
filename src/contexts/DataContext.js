import React, { createContext, useContext, useState, useEffect } from 'react';
import * as cities from './cities.json';
const DataContext = createContext();

export function DataProvider(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [clickedCity, setClickedCity] = useState(null)

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
  },[]);

  return (
    <DataContext.Provider
      value={{
        isLoading,
        ...data,
        clickedCity,
        setClickedCity
      }}
      {...props}
    />
  )
}

export function useData() {
  return useContext(DataContext);
}


function processData(apiResult){
  if(apiResult.success === 'false') return {};
  let data = apiResult.data;
  const len = data.length;
   // Return only latest information
  let casesFromLatestDate = parseCases(data,len-1);
  let casesFromDayBeforeLatest = parseCases(data,len-2);

  let lastestWithDiff = solveDifference(casesFromLatestDate, casesFromDayBeforeLatest);
  return lastestWithDiff;
  // return casesFromLatestDate;
}

// Parse Cases according to old database
function parseCases(data,targetDay){
  let day = data[targetDay].day;
  let targetCases = data[targetDay].regional;
  let cases = [],deaths = [],cures = [];

  for(let i in targetCases){
    let caseConfirmed = {
      "city" : targetCases[i].loc,
      "count" : parseInt(targetCases[i].confirmedCasesIndian) + parseInt(targetCases[i].confirmedCasesForeign),
      "date" : day
    }
    
    cases.push(caseConfirmed);
    if(parseInt(targetCases[i].deaths) !==0){
      let death = {
        "city" : targetCases[i].loc,
        "count" : parseInt(targetCases[i].deaths),
        "date" : day
      }
      deaths.push(death);
    }
    if(parseInt(targetCases[i].discharged) !== 0){
      let cure = {
        "city" : targetCases[i].loc,
        "count" : parseInt(targetCases[i].discharged),
        "date" : day
      }
      cures.push(cure);
    }
  }

  let res = {
    "cases" : cases,
    "deaths" : deaths,
    "cures" : cures,
    "cities" : cities['cities'],
  }
  // console.log(res)
  return res;
}

function solveDifference(newDay, oldDay){
  let lastestWithDiff = {};
  for(let obj in oldDay){
    lastestWithDiff[obj] = solveASingleOne(newDay[obj],oldDay[obj]);
  }
  return lastestWithDiff;
}

function solveASingleOne(casesNew, casesOld){
  let tempDiff = [];
  for(let i in casesOld) tempDiff.push(casesOld[i]);
  
  for(let i in casesNew){
    let newState = true;
    for(let j in casesOld){
      if(casesNew[i].city === casesOld[j].city){
        newState = false;
        if(casesNew[i].count > casesOld[j].count){
          casesNew[i].count = casesNew[i].count - casesOld[j].count;
          tempDiff.push(casesNew[i]);
        }
      }
      if(!newState) break;
    }
    if(newState){
      tempDiff.push(casesNew[i]);
    }
  }
  
  return tempDiff;
}