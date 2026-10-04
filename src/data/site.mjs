// ─────────────────────────────────────────────────────────────
//  SITE SETTINGS — edit these, then run `npm run build`
//  Anything marked TODO must be filled in before going live.
// ─────────────────────────────────────────────────────────────
export const site = {
  name: "Angir Welding & Fabrication",
  legalName: "Angir Welding & Fabrication, Inc.",
  shortName: "Angir",
  // TODO: replace with the real domain once purchased (no trailing slash)
  url: "https://www.angirwelding.com",

  // Phone: `phoneDisplay` is shown, `phoneHref` is dialed.
  phoneDisplay: "(347) 987-8232",
  phoneHref: "+13479878232",
  // TODO: real email
  email: "office@angirwelding.com",

  address: {
    street: "1363 81st St",
    city: "Brooklyn",
    region: "NY",
    zip: "11228",
    neighborhood: "Dyker Heights",
    lat: 40.6177,
    lng: -74.0089,
  },

  // Google Business Profile link (used for "Read our reviews" / "Leave a review")
  googleProfile: "https://www.google.com/maps/search/?api=1&query=Angir+Welding+%26+Fabrication+1363+81st+St+Brooklyn+NY+11228",
  googleRating: "5.0",

  // Leave empty to hide. Example: [{d:"Mo-Sa", open:"07:00", close:"19:00"}]
  hours: [],
  hoursText: "Call or text any day — we answer late.",

  // Optional: paste a Formspree / Basin / Getform endpoint to receive quote
  // requests by email. Left empty, the form opens the visitor's email app.
  formEndpoint: "",

  social: {
    instagram: "", // e.g. "https://www.instagram.com/angirwelding/"
    tiktok: "",
    facebook: "",
  },

  // Only set these to true once they are actually true — they print on every page.
  licensedInsured: false,
  licenseNumber: "", // e.g. NYC DCWP Home Improvement Contractor license #
};
