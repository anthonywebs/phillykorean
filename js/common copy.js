let SONG_LIST = [
  {
    owner: 'Anthony',
    title: 'Bam',
    path: './media/bam.m4a',
    weight: 0,
  }, 
  {
    owner: 'Anthony',
    title: 'Tide is high',
    path: './media/tide.m4a',
    weight: 0,
  }, 
  {
    owner: 'Anthony',
    title: 'Crazy in love',
    path: './media/crazy.m4a',
    weight: 0,
  }, 
  {
    owner: 'Anthony',
    title: 'Take on me',
    path: './media/takeonme.m4a',
    weight: 0,
  }, 
  {
    owner: 'Anthony',
    title: 'Call me maybe',
    path: './media/callme.m4a',
    weight: 0,
  }, 
  {
    owner: 'Anthony',
    title: 'Get out of my dreams, Get into my car',
    path: './media/getout.m4a',
    weight: 0,
  }, 
  {
    owner: 'Anthony',
    title: 'Blue sky',
    path: './media/bluesky.m4a',
    weight: 0,
  }, 
];

let SONG_TRACK = -1;

// comment the fonts that you don't need
const loadFont = async () => {
  const fonts = [
    new FontFace('Source_Code_Pro', 'url(assets/Source_Code_Pro/SourceCodePro-VariableFont_wght.ttf)'),

    new FontFace('SF_Pro_Display_Black', 'url(assets/SF-Pro/SF-Pro-Display/SF-Pro-Display-Black.woff)'),

    new FontFace('SF_Pro_Display_Bold', 'url(assets/SF-Pro/SF-Pro-Display/sf-pro-display_bold.woff2)'),
    // new FontFace('SF_Pro_Display_Light', 'url(assets/SF-Pro/SF-Pro-Display/sf-pro-display_light.woff2)'),
    // new FontFace('SF_Pro_Display_Medium', 'url(assets/SF-Pro/SF-Pro-Display/sf-pro-display_medium.woff2)'),
    new FontFace('SF_Pro_Display_Regular', 'url(assets/SF-Pro/SF-Pro-Display/sf-pro-display_regular.woff2)'),
    new FontFace('SF_Pro_Display_Semibold', 'url(assets/SF-Pro/SF-Pro-Display/sf-pro-display_semibold.woff2)'),
    // new FontFace('SF_Pro_Display_Thin', 'url(assets/SF-Pro/SF-Pro-Display/sf-pro-display_thin.woff2)'),
    // new FontFace('SF_Pro_Display_Ultralight', 'url(assets/SF-Pro/SF-Pro-Display/sf-pro-display_ultralight.woff2)'),

    new FontFace('SF_Pro_Text_Regular', 'url(assets/SF-Pro/SF-Pro-Text/sf-pro-text_regular.woff2)'),
    // new FontFace('SF-Pro-Text-Regular-italic', 'url(assets/SF-Pro/SF-Pro-Text/sf-pro-text_regular-italic.woff2)'),
    // new FontFace('SF-Pro-Text-Bold', 'url(assets/SF-Pro/SF-Pro-Text/sf-pro-text_bold.woff2)'),
    // new FontFace('SF-Pro-Text-semibold', 'url(assets/SF-Pro/SF-Pro-Text/sf-pro-text_semibold.woff2)'),
    // new FontFace('SF-Pro-Text-thin', 'url(assets/SF-Pro/SF-Pro-Text/sf-pro-text_thin.woff2)'),
  ];
  await Promise.all(fonts.map(font => font.load()));
  fonts.forEach(font => document.fonts.add(font));

  // fonts.forEach(font => {  // This is slow
  //   document.fonts.add(font);
  //   font.load().catch(console.error); // Catch any potential errors
  // });
  
  // await document.fonts.ready;
}
