import {
  getUserStats,
  getGlobalStats,
  getProgress,
  storeProgress,
} from "./localStorageUtils";


const brokeBothText = `שברת שיא אישי וגם את השיא היומי!🎉`
const brokePersonalText = `שברת שיא אישי!🎉`;
const brokeGlobalText = `שברת את השיא היומי!🎉`


const didBreakRecords = (riddle) => {
  const personalStats = getUserStats();
  const globalStats = getGlobalStats();
  const currPersonalRecord = personalStats && personalStats.best_time;
  const currGlobalRecord = globalStats && globalStats.best_time;
  const currTimeSeconds = Math.round(
    (riddle.endTime - riddle.startTime) / 1000
  );
  const brokePersonalRecord =
    !currPersonalRecord || currTimeSeconds < currPersonalRecord;
  const brokeGloballRecord =
    !currGlobalRecord || currTimeSeconds < currGlobalRecord;
  return [brokePersonalRecord, brokeGloballRecord];
};
export const updateRecordsBreak = (riddle) => {
  const progress = getProgress();
  const [brokePersonalRecord, brokeGloballRecord] = didBreakRecords(riddle);
  const recordBreak = {
    personal: brokePersonalRecord,
    global: brokeGloballRecord,
  };
  const newProgress = { ...progress, recordBreak: recordBreak };
  storeProgress(newProgress);
};


const getRecordsBreakText = (personal, global) => {
    if (!(personal || global)) return null;
    if (personal && global) return brokeBothText;
    if (personal) return brokePersonalText; 
    if (global) return brokeGlobalText;
  };
  
  export const RecordBreakView = ({riddle}) => {
    updateRecordsBreak(riddle)
    
    const recordBreak = getProgress().recordBreak;
    const textToShow = recordBreak
      ? getRecordsBreakText(recordBreak.personal, recordBreak.global)
      : null;
    return textToShow && <h3 dir="rtl"> {textToShow} </h3>;
  };