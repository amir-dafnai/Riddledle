import {
  getUserStats,
  getGlobalStats,
  getProgress,
  storeProgress,
} from "./localStorageUtils";

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
  if (
    progress &&
    progress.recordBreak &&
    (progress.recordBreak.personal || progress.recordBreak.global)
  )
    return;
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
    if (personal && global) return `שברת שיא אישי וגם את השיא היומי!🎉`;
    if (personal) return `שברת שיא אישי!🎉`;
    if (global) return `שברת את השיא היומי!`;
  };
  
  export const RecordBreakView = () => {
    const recordBreak = getProgress().recordBreak;
    const textToShow = recordBreak
      ? getRecordsBreakText(recordBreak.personal, recordBreak.global)
      : null;
    return textToShow && <h3 dir="rtl"> {textToShow} </h3>;
  };