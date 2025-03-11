import axios from "axios";

export const getRandomGame = async () => {
  const response = await axios.get(
    "https://api.steampowered.com/ISteamApps/GetAppList/v0002/?format=json"
  );
  let i = Math.floor(Math.random() * response.data.applist.apps.length);
  return response.data.applist.apps[i].appid;
};
