export default function convert(number: number, decimals: number = 0) {
    let totalSeconds = number / 1000;
    let days = Math.floor(totalSeconds / 86400).toFixed() || 0;
  
    totalSeconds %= 86400;
    let hours = Math.floor(totalSeconds / 3600).toFixed() || 0;
  
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60).toFixed() || 0;
    let seconds = totalSeconds % 60 || 0;
    seconds = +seconds.toFixed(decimals);
  
    return convertLong([+days, +hours, +minutes, seconds]);
  }
  
  export function convertLong(converted: [number, number, number, number]) {
    {
      let days: number | string = converted[0];
      let hours: number | string = converted[1];
      let minutes: number | string = converted[2];
      let seconds: number | string = converted[3];
  
      let dias: string = "days";
      let horas: string = "hours";
      let minutos: string = "minutes";
      let segundos: string = "seconds";
  
      if (+days <= 0) {
        days = "";
        dias = "";
      }
  
      if (+days === 1) dias = dias.replace("s", "");
  
      if (+hours <= 0) {
        hours = "";
        horas = "";
      }
  
      if (+hours === 1) horas = "hour";
  
      if (+minutes <= 0) {
        minutes = "";
        minutos = "";
      }
      if (+minutes === 1) minutos = "minute";
  
      if (+seconds <= 0) {
        seconds = "";
        segundos = "";
      }
      if (+seconds === 1) segundos = "second";
  
      return [days, dias, hours, horas, minutes, minutos, seconds, segundos]
        .join(" ")
        .split(/[ ]+/)
        .join(" ")
        .trim();
    }
  }
  
  export function time(text: string): number | false {
    text = text.toLowerCase();
    return /^(\d+[mhsd]\s?)+$/gi.test(text)
      ? eval(
          "( " +
            text
              .replace("m", " * 60 + ")
              .replace("h", " * 60 * 60 + ")
              .replace("d", " * 24 * 60 * 60 + ")
              .replace("s", " + 0 + ") +
            "0 ) * 1000"
        )
      : false;
  }
