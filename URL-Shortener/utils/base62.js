// Base62 Alphabet Set (Total 62 characters)
const BASE62_ALPHABET =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

export const encodeBase62 = (num) => {
  if (num == 0) return BASE62_ALPHABET[0];

  let result = "";
  let base = BASE62_ALPHABET.length;

  while (num > 0) {
    let reminder = num % base;

    result = BASE62_ALPHABET[reminder] + result;

    num = Math.floor(num / base);
  }
  return result;
};

export const decodeBase62 = (str) => {
  let num = 0;
  let base = BASE62_ALPHABET.length;

  for (let i = 0; i < str.length; i++) {
    let char = BASE62_ALPHABET[i];
    let power = str.length - i - 1;
    let index = BASE62_ALPHABET.indexOf(char);

    if (index == -1) throw new Error("Invalid Base62 character");

    num += index * Math.pow(base, power);
  }
  return num;
};
