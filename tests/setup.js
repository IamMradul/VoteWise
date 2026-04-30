// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
    ok: true
  })
);

// Mock window.APP_CONFIG
global.window.APP_CONFIG = {
  GEMINI_API_KEY: "test_key",
  GOOGLE_MAPS_API_KEY: "test_key",
  GA_MEASUREMENT_ID: "G-TEST",
  FIREBASE_CONFIG: {}
};

// Mock gtag
global.window.gtag = jest.fn();
global.gtag = global.window.gtag;

// Mock Firebase
global.window.firebase = {
  initializeApp: jest.fn(),
  firestore: jest.fn(() => ({
    collection: jest.fn(() => ({
      add: jest.fn(),
      orderBy: jest.fn(() => ({
        limit: jest.fn(() => ({
          get: jest.fn(() => Promise.resolve({ forEach: jest.fn() }))
        }))
      }))
    }))
  }))
};
global.firebase = global.window.firebase;
