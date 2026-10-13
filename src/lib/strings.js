// Central UI string dictionary as required by Agent-Rules.md Section 4.3
export const STRINGS = {
  app: {
    name: 'BinGo',
    tagline: 'Sort your waste in one scan',
  },
  home: {
    impactTitle: 'Every scan helps',
    itemsSorted: 'Items sorted',
    dayStreak: 'Day streak',
    scanTitle: 'Scan an item',
    scanSubtitle: 'Point your camera at one item to see how to dispose of it.',
    hintOneItem: 'Scan one item at a time',
    hintGoodLight: 'Use good light and fill the frame',
    btnGallery: 'Choose from gallery',
    loadingModel: 'Loading model...',
  },
  analyzing: {
    title: 'Analyzing',
    status: 'Analyzing your item...',
    hintOneItem: 'Keep it simple: one item only',
    hintTakesMoment: 'This takes a moment',
  },
  result: {
    title: 'Scan result',
    howToDispose: 'How to dispose',
    sdgOverline: 'SDG 15 · LIFE ON LAND',
    wasCorrect: 'Was this correct?',
    feedbackThanks: 'Thanks for the feedback',
    scanAnother: 'Scan another item',
    notSureTitle: 'Not sure',
    notSureMessage: 'Not sure, try another angle',
    tipAnotherAngle: 'Try another angle.',
    tipOneItem: 'Scan one item at a time.',
  },
  history: {
    title: 'History',
    emptyTitle: 'No scans yet',
    emptySubtitle: 'Your last 50 scans will show up here.',
  },
  nav: {
    home: 'Home',
    history: 'History',
    scan: 'Scan',
  },
  errors: {
    notImage: "That file isn't an image. Please choose a photo.",
    readFail: "Couldn't read that photo.",
    modelLoadFail: "Couldn't load scanner model.",
    rulesLoadFail: "Couldn't load app content.",
    scanFail: 'Something went wrong while scanning.',
    retry: 'Retry',
  },
}
