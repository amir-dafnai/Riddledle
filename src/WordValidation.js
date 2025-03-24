import { getUrl } from "./appUtils";

export const areWordsValid = async (chars) => {
  const words_string = chars.join("").split(" ").join(",");
  const response = await fetch(`${getUrl()}is_valid?words=${words_string}`);
  const data = await response.json();
  return data.is_valid;
};
