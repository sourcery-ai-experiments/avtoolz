export const supportedLocales = [
  { shortLabel: "en", longLabel: "English" },
  // { shortLabel: "fr", longLabel: "French" },
  // { shortLabel: "hi", longLabel: "Hindi" },
  // { shortLabel: "af", longLabel: "Afrikaans" },
  // { shortLabel: "am", longLabel: "Amharic" },
  // { shortLabel: "ar", longLabel: "Arabic" },
  // { shortLabel: "az", longLabel: "Azerbaijani" },
  // { shortLabel: "be", longLabel: "Belorussian" },
  // { shortLabel: "bg", longLabel: "Bulgarian" },
  // { shortLabel: "bn", longLabel: "Bengali" },
  // { shortLabel: "br", longLabel: "Breton" },
  // { shortLabel: "bs", longLabel: "Bosnian" },
  // { shortLabel: "ca", longLabel: "Catalan" },
  // { shortLabel: "cs", longLabel: "Czech" },
  // { shortLabel: "cy", longLabel: "Cymraeg" },
  // { shortLabel: "da", longLabel: "Danish" },
  // { shortLabel: "de", longLabel: "German" },
  // { shortLabel: "dv", longLabel: "Dhivehi" },
  // { shortLabel: "es", longLabel: "Spanish" },
  // { shortLabel: "et", longLabel: "Estonian" },
  // { shortLabel: "eu", longLabel: "Basque" },
  // { shortLabel: "fa", longLabel: "Persian" },
  // { shortLabel: "fi", longLabel: "Finnish" },
  // { shortLabel: "ga", longLabel: "Irish" },
  // { shortLabel: "gl", longLabel: "Galician" },
  // { shortLabel: "el", longLabel: "Greek" },
  // { shortLabel: "ha", longLabel: "Hausa" },
  // { shortLabel: "he", longLabel: "Hebrew" },
  // { shortLabel: "hr", longLabel: "Croatian" },
  // { shortLabel: "hu", longLabel: "Hungarian" },
  // { shortLabel: "hy", longLabel: "Armenian" },
  // { shortLabel: "is", longLabel: "Icelandic" },
  // { shortLabel: "it", longLabel: "Italian" },
  // { shortLabel: "id", longLabel: "Indonesian" },
  // { shortLabel: "ja", longLabel: "Japanese" },
  // { shortLabel: "ka", longLabel: "Georgian" },
  // { shortLabel: "kk", longLabel: "Kazakh" },
  // { shortLabel: "km", longLabel: "Khmer" },
  // { shortLabel: "ko", longLabel: "Korean" },
  // { shortLabel: "ku", longLabel: "Kurdish" },
  // { shortLabel: "ky", longLabel: "Kyrgyz" },
  // { shortLabel: "lt", longLabel: "Lithuanian" },
  // { shortLabel: "lv", longLabel: "Latvian" },
  // { shortLabel: "mk", longLabel: "Macedonian" },
  // { shortLabel: "ml", longLabel: "Malayalam" },
  // { shortLabel: "mn", longLabel: "Mongolian" },
  // { shortLabel: "mr", longLabel: "Marathi" },
  // { shortLabel: "ms", longLabel: "Malay" },
  // { shortLabel: "mt", longLabel: "Maltese" },
  // { shortLabel: "nb", longLabel: "Norwegian Bokmål" },
  // { shortLabel: "nl", longLabel: "Dutch" },
  // { shortLabel: "nn", longLabel: "Norwegian Nynorsk" },
  // { shortLabel: "no", longLabel: "Norwegian" },
  // { shortLabel: "pl", longLabel: "Polish" },
  // { shortLabel: "ps", longLabel: "Pashto" },
  // { shortLabel: "pt", longLabel: "Portuguese" },
  // { shortLabel: "ro", longLabel: "Romanian" },
  // { shortLabel: "ru", longLabel: "Russian" },
  // { shortLabel: "sd", longLabel: "Sindhi" },
  // { shortLabel: "sk", longLabel: "Slovak" },
  // { shortLabel: "sl", longLabel: "Slovene" },
  // { shortLabel: "so", longLabel: "Somali" },
  // { shortLabel: "sq", longLabel: "Albanian" },
  // { shortLabel: "sr", longLabel: "Serbian" },
  // { shortLabel: "sv", longLabel: "Swedish" },
  // { shortLabel: "sw", longLabel: "Swahili" },
  // { shortLabel: "ta", longLabel: "Tamil" },
  // { shortLabel: "tg", longLabel: "Tajik" },
  // { shortLabel: "th", longLabel: "Thai" },
  // { shortLabel: "tr", longLabel: "Turkish" },
  // { shortLabel: "tt", longLabel: "Tatar" },
  // { shortLabel: "ug", longLabel: "Uyghur" },
  // { shortLabel: "uk", longLabel: "Ukrainian" },
  // { shortLabel: "ur", longLabel: "Urdu" },
  // { shortLabel: "uz", longLabel: "Uzbek" },
  // { shortLabel: "zh", longLabel: "Chinese" },
  // { shortLabel: "vi", longLabel: "Vietnamese" },
];

// find the locale that matches the language code
export const getLocaleInWords = (lang: string) => {
  const locale = supportedLocales.find((locale) => locale.shortLabel === lang);
  return locale ? locale.longLabel : lang;
};
