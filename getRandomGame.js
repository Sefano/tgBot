import axios from "axios";

const filteredArray = [
  "gay",
  "lesbian",
  "sex",
  "dlc",
  "soundtrack",
  "ost",
  "expansion",
  "lust",
  "hentai",
  "18+",
  "girl",
  "woman",
  "milf",
  "bikini",
  "cum",
  "furry",
  "pack",
];

const filteredArrayNoCens = [
  "gay",
  "lesbian",
  "dlc",
  "soundtrack",
  "ost",
  "expansion",
  "pack",
];

export const getRandomGame = async (adult) => {
  let badGame = true;

  const response = await axios.get(
    "https://api.steampowered.com/ISteamApps/GetAppList/v0002/?format=json"
  );

  while (badGame) {
    try {
      let i = Math.floor(Math.random() * response.data.applist.apps.length);
      const title = response.data.applist.apps[i].name;
      const censorResult = filterTitle(
        title,
        filteredArray,
        filteredArrayNoCens,
        adult
      );
      if (censorResult) {
        console.log("Bad game!");
      } else {
        badGame = false;
        console.log("Good game!");
        return response.data.applist.apps[i].appid;
      }
    } catch (error) {
      console.log(error);
      break;
    }
  }
};

const filterTitle = (title, filteredArray, filteredArrayNoCens, adult) => {
  title = title.toLowerCase();
  if (adult === false) {
    for (const word of filteredArray) {
      if (title.includes(word.toLowerCase())) {
        return true;
      }
    }
    return false;
  } else {
    for (const word of filteredArrayNoCens) {
      if (title.includes(word.toLowerCase())) {
        return true;
      }
    }
    return false;
  }
};
