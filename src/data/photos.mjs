// ─────────────────────────────────────────────────────────────
//  Site photography — Unsplash (free for commercial use, Unsplash License)
//  key → { id, raw (Unsplash CDN base), by, un (photographer), file (keyword
//  file name used when photos are downloaded locally), alt }
//
//  The site loads these straight from Unsplash's CDN. Run `npm run photos`
//  on a machine with internet to download them into docs/assets/photos/
//  under their keyword file names; the build then uses the local copies.
//  To use your OWN job photos, drop them into docs/assets/photos/ with the
//  same file name (FILE-800.webp, FILE-1200.webp, FILE-1600.webp).
// ─────────────────────────────────────────────────────────────
const U = (id, ts, by, un, file, alt) => ({ id, raw: `https://images.unsplash.com/photo-${ts}`, by, un, file, alt });

export const photos = {
  // ── services
  "metal-stairs": U("aHBHd8e133s", "1613798399339-a8d57a2e0a95", "Zac Gudakov", "zacgudakov", "custom-metal-stairs-brooklyn-nyc", "Modern steel staircase with wood treads and metal railing"),
  "spiral-stairs": U("ayWgRkCk2sQ", "1526573059328-179b147e1b42", "Serhat Beyazkaya", "serhatbeyazkaya", "spiral-staircase-brooklyn-nyc", "Curved spiral staircase with a metal handrail"),
  "stair-railings": U("7OvMK8Ia3YE", "1523789248610-bb592e870951", "Raphaël LR", "raphaelrng", "stair-railings-handrails-brooklyn-nyc", "Black steel stair railing running down a staircase"),
  "exterior-railings": U("Wh44X8kJkzk", "1617401714556-f145c353028c", "Steve Strang", "strangs", "stoop-railings-brownstone-brooklyn", "Row of brownstones with stoops and iron railings"),
  "balcony-railings": U("IDVRl7W0H_o", "1596482377715-261682039572", "Isabel Read", "isabelame1", "balcony-railings-brooklyn-nyc", "Black wrought iron balcony railing on a brick building"),
  "stainless-steel-railings": U("rQEZZrGGmCI", "1788248002086-5a281cde6422", "Declan Sun", "declansun", "stainless-steel-glass-railings-nyc", "Glass panel railings with stainless steel posts on a terrace"),
  "ada-handrails": U("T9Q14c-g8g0", "1777816923918-470862a09643", "Heng Chiu", "chiuchuuu", "ada-handrails-ramp-railings-brooklyn", "Stainless steel handrails along a concrete ramp"),
  "iron-gates": U("jY_6cO6wcC4", "1674826834717-40728c84b9ad", "Anastasiya D", "vasilechak", "wrought-iron-gates-brooklyn-nyc", "Ornate wrought iron gate with ring handles"),
  "sliding-gates": U("315Qt56HXV8", "1743657405622-556b6be5deef", "Mark Owen Wilkinson Hughes", "markowihu", "sliding-driveway-gates-brooklyn-nyc", "Steel sliding gate with a diamond lattice pattern"),
  "iron-fences": U("oVueqggYsbU", "1619322704995-5215d5f47a75", "Joshua Olsen", "photowolf", "wrought-iron-fence-installation-brooklyn", "Black iron picket fence with spear finials"),
  "window-guards": U("rxK0Ji80630", "1785053307461-6bc8c036ed25", "Liam Scotchmer", "liam_scotchmer", "window-guards-security-bars-brooklyn", "Brick building with steel security bars on the windows"),
  "security-doors": U("0aMQQSKN5rA", "1561745673-9e1f003fd41c", "Mike Elliott", "mikeelliott", "steel-security-doors-iron-gates-brooklyn", "Arched doorway protected by a decorative iron security gate"),
  "fire-escape-repair": U("Cy_t4RDJmdI", "1587137727599-c0010ac13724", "Lewis J Goetz", "lgoetz", "fire-escape-repair-nyc", "Brick New York apartment building with steel fire escapes"),
  "structural-steel": U("cqNgo3sQ_24", "1616224952327-6240f31e5bdc", "Rick Hyne", "quinley1770", "structural-steel-beam-installation-nyc", "Workers installing structural steel beams on a building"),
  "lintel-replacement": U("runeRAo9LWE", "1598944071980-c14003934c93", "Michael Marais", "michael_marais", "steel-lintel-replacement-brick-window-brooklyn", "Window set into a brick wall beneath a lintel"),
  "cellar-doors": U("taXKja90mzc", "1783849697499-efd4b6be34be", "Christian Keybets", "christian_keybets", "diamond-plate-sidewalk-cellar-doors-nyc", "Dark steel diamond plate used for sidewalk cellar doors"),
  "steel-canopies": U("lCmZqcHM-OY", "1696846912973-3233cc80bf86", "Tile Merchant Ireland", "tilemerchant", "steel-pergola-canopy-brooklyn", "Modern black steel pergola over a backyard patio"),
  "roof-ladders": U("G3USyM5pqb4", "1660020485361-baa863003991", "Mounish Raja", "mounishraja", "roof-access-ladder-nyc", "Steel roof access ladder over a parapet"),
  "mezzanines-platforms": U("7b49gfsgQZY", "1469289759076-d1484757abc3", "xyzcharlize", "charlize", "steel-mezzanine-warehouse-brooklyn", "Warehouse interior with steel racking and storage platforms"),
  "tree-guards": U("RSILUMwabqc", "1559081548-c5bbb6222948", "Avi Werde", "aviwerde", "tree-guards-sidewalk-ironwork-brooklyn", "Brooklyn row houses with street trees and front-yard ironwork"),
  "rolling-gates": U("LOyBYl-8dOU", "1563033963-d3a6e1debdbc", "Mihály Köles", "mihaly_koles", "rolling-gate-repair-storefront-brooklyn", "Storefront with a roll-down security gate pulled shut"),
  "stainless-steel-fabrication": U("rO6709B116E", "1589109807644-924edf14ee09", "Ricardo Gomez Angel", "rgaleriacom", "stainless-steel-restaurant-kitchen-fabrication-nyc", "Commercial kitchen with stainless steel tables and shelving"),
  "bollards": U("zXEtTbSJGcI", "1713300972516-1986891e0c0d", "Viktor Khilchuk", "mrvigner", "steel-bollards-installation-nyc", "Row of steel bollards protecting a sidewalk"),
  "custom-metal-fabrication": U("JpzMc-FMUes", "1738162837389-3b02d6dd507b", "Cemrecan Yurtman", "cmrcn_", "custom-metal-fabrication-shop-brooklyn", "Welder fabricating a steel part in a metal shop"),
  "ornamental-ironwork": U("6ssg93Qrzpo", "1780069645437-cf565c8af829", "Ludovico Ceroseis", "ludovico_06", "ornamental-wrought-iron-work-brooklyn", "Ornamental iron fence with decorative lanterns and scrollwork"),
  "custom-metal-furniture": U("hFjjMP5TxwI", "1625744070229-bb3f58a97e03", "sq lim", "sql", "custom-steel-furniture-table-bases-nyc", "Dining table with a steel base and wood top"),
  "rust-repair-painting": U("ZPd5JxdVLfc", "1790713716204-a133424557e1", "Mavi Atlas", "maviatlas", "rusted-iron-railing-restoration-brooklyn", "Rusted wrought iron railing on a stone porch, ready for restoration"),
  "welding-repair": U("E15BQufHzJs", "1668140736531-d23950307b3c", "Heber Davis", "heberdavisphotography", "welding-repair-shop-brooklyn", "Welder in protective gear repairing steel with sparks flying"),
  "mobile-welding": U("Ws8SCmDS9mw", "1683470157212-cd4005549fce", "Rizky Nuriman", "subworks", "mobile-welding-on-site-brooklyn-nyc", "Welder working on site on a steel structure"),
  "emergency-welding": U("VW4xiLRr-do", "1508465818649-14a170138405", "Glenn Hansen", "hansenhouse", "emergency-welding-repair-brooklyn", "Sparks spraying from a weld in the dark"),
  "gate-repair": U("BfwWK7kDrzA", "1585580956413-5a952a885159", "Fons Heijnsbroek", "fonsheijnsbroek_amsterdam_photos", "iron-gate-fence-repair-brooklyn", "Black decorative iron gate and fence on a city sidewalk"),
  "aluminum-welding": U("A4v12bnjU-4", "1773967671015-0f78d6c092d5", "Jeff McLain", "jeffmclain", "aluminum-boat-welding-brooklyn", "Aluminum boats docked at a marina"),
  "stainless-steel-welding": U("n1RJ7pXgGTE", "1466779561253-0a08336ba2ab", "Pete Wright", "petewright", "tig-stainless-steel-welding-nyc", "TIG welder in a helmet welding steel"),
  "cast-iron-repair": U("poRZ5fKjU-Y", "1737236443770-608ce83ae7ab", "Markus Winkler", "markuswinkler", "cast-iron-ornament-repair-brooklyn", "Cast iron rosette ornament set into an iron fence"),
  "trailer-truck-repair": U("-DZkYpnr9Y8", "1790707760473-e1d8b2126d06", "Adam Winger", "awcreativeut", "trailer-truck-welding-repair-brooklyn", "Enclosed cargo trailer parked on a gravel lot"),

  // ── page photos
  "page:hero": U("bzzSg8hTKKY", "1609348632802-b952f368fc3a", "Benjamin Wedemeyer", "benjaminwedemeyer", "welder-welding-fabrication-brooklyn-nyc", "Welder in a helmet welding steel with a bright arc"),
  "page:split": U("tXJhAFVOHVk", "1598302936625-6075fbd98dd7", "Josh Beech", "ig_joshabeech", "metal-grinding-fabrication-brooklyn", "Metal worker grinding a steel beam with sparks flying"),
  "page:about": U("sPl7FgBalxI", "1608126841548-dfad1d420a0f", "Syd Mills", "sydmills", "welder-metal-shop-brooklyn", "Welder bent over a workbench in a metal shop"),
  "page:about2": U("_l048yMzn1s", "1784442201403-9bee7050144c", "Jorge L. Valdivia", "jorgeel_vm09", "mig-welding-sparks-brooklyn-nyc", "Welder creating bright sparks in a dark workshop"),

  // ── guides
  "guide:nyc-railing-height-code": U("qOHPkRRmpC0", "1512459134034-f8f5c50df27d", "Aditya Chinchure", "adityachinchure", "nyc-railing-height-code-guide", "Metal stair and guard railing beside a concrete wall"),
  "guide:fire-escape-inspection-nyc": U("oQpGg_uRPXQ", "1685356601058-88bd261fb137", "Aidan Murphy", "aidansplanet", "nyc-fire-escape-inspection-guide", "Fire escapes zig-zagging down a New York apartment building"),
  "guide:nyc-window-guard-law": U("D-U9kFVG138", "1593821182275-0fe19796d302", "Julie Ricard", "jricard", "nyc-window-guard-law-guide", "New York building facade with windows and fire escapes"),
  "guide:railing-materials-compared": U("QC9B4zdTDzw", "1774707595261-64a4fd8eeac1", "Gio L", "artenico", "wrought-iron-vs-steel-aluminum-stainless-railings", "Ornate wrought iron railing with gothic arch details"),
  "guide:storefront-rolling-gate-law": U("Nz3cMTGRgKk", "1762198651386-108ab64468fc", "Mykyta Kravčenko", "makitrenko", "nyc-storefront-rolling-gate-law-guide", "Closed storefront with metal roll-down security shutters"),
  "guide:steel-railing-cost-factors": U("Riw179Nna6w", "1738162837672-de9d735a9b90", "Cemrecan Yurtman", "cmrcn_", "custom-railing-gate-stair-cost-guide", "Metal worker grinding a steel piece in the shop"),

  // ── service areas
  "area:dyker-heights": U("kMrhCnrbIFQ", "1749292177172-66edfd44e7cc", "Zoshua Colah", "zoshuacolah", "welding-ironwork-dyker-heights-brooklyn", "Brick and colorful row houses on a Brooklyn street"),
  "area:bay-ridge": U("fnK72vtWVCA", "1665416738654-98ebf6aab981", "Abdallah Kokash", "akokash", "welding-ironwork-bay-ridge-brooklyn", "Verrazzano-Narrows Bridge seen from the Shore Road promenade"),
  "area:fort-hamilton": U("3wDqAkj1rNY", "1665939338177-5f393f5546c3", "Jason Krieger", "kriegs", "welding-ironwork-fort-hamilton-brooklyn", "Verrazzano-Narrows Bridge tower over the Narrows"),
  "area:bensonhurst": U("5udBKkXTUK8", "1552418844-c3bf1431ea48", "Avi Werde", "aviwerde", "welding-ironwork-bensonhurst-brooklyn", "Colorful attached row houses with front stoops"),
  "area:bath-beach": U("00ecA2PYA-4", "1722206335508-f370f8ba10d4", "Zoshua Colah", "zoshuacolah", "welding-ironwork-bath-beach-brooklyn", "Boat crossing the water toward the Verrazzano Bridge"),
  "area:borough-park": U("kBztv24Gz40", "1658195980157-6bf0abd82f38", "Stephen McFadden", "videoguy80", "welding-ironwork-borough-park-brooklyn", "Brick apartment building with fire escapes"),
  "area:sunset-park": U("a7AhbqFAEcQ", "1577640204417-a73c72c7cb97", "Nelson Ndongala", "whodunelson", "welding-ironwork-sunset-park-brooklyn", "Brooklyn rooftops with the Manhattan skyline beyond"),
  "area:gravesend": U("Rv9Dc_O-kqk", "1739131936348-aa227601f140", "Zoshua Colah", "zoshuacolah", "welding-ironwork-gravesend-brooklyn", "Brooklyn avenue lined with brick buildings and storefronts"),
  "area:midwood": U("yfmkBgAQpzQ", "1641217658611-5ffbcde46b61", "Sam Balye", "sambalye", "welding-ironwork-midwood-brooklyn", "Row of multi-family brick houses behind a tree"),
  "area:sheepshead-bay": U("b_hwO8MLS2U", "1758248421462-82f0cffe9e7e", "Jim Petkiewicz", "pecko", "welding-ironwork-sheepshead-bay-brooklyn", "Steel pedestrian footbridge against a blue sky"),
  "area:brighton-beach": U("0NRjfj6EgRo", "1571671339665-355842bb57e7", "Brian Kyed", "brnkd", "welding-ironwork-brighton-beach-brooklyn", "Beach and boardwalk area with the Wonder Wheel in the distance"),
  "area:coney-island": U("q_KaMY4yXl4", "1663052721581-59b01a205f33", "Dana Andreea Gheorghe", "dana_andreea", "welding-ironwork-coney-island-brooklyn", "Coney Island pier, beach and Parachute Jump tower"),
  "area:marine-park": U("j9SCrZt4NPY", "1713280191630-7c9c7ce51e2f", "Frolicsome Fairy", "frolicsomefairy", "welding-ironwork-marine-park-brooklyn", "Autumn trees in front of Brooklyn homes at sunset"),
  "area:canarsie": U("tJ-Rx-7AudE", "1566572059454-dd7eaf3f1aa2", "Laura Peruchi", "lauraperuchi", "welding-ironwork-canarsie-brooklyn", "Brick row houses on a tree-lined block"),
  "area:flatbush": U("fe0_dsZ4-LM", "1774031137615-23d5bed07a68", "Quincy Rose", "quincyrose", "welding-ironwork-flatbush-brooklyn", "Townhouses behind green street trees"),
  "area:kensington": U("u5h888fh5RY", "1678654215032-6fe169b26423", "Tyler Donaghy", "tylerdonaghy", "welding-ironwork-kensington-brooklyn", "Brick row house cornice against a blue sky"),
  "area:windsor-terrace": U("p_3p7RZocy0", "1702677710595-3e1163062d41", "Michael Moloney", "mjmolo", "welding-ironwork-windsor-terrace-brooklyn", "Tree-lined Brooklyn sidewalk with iron fences"),
  "area:park-slope": U("rdJXlCdRVaQ", "1515112569565-1e4aef316db9", "Josh Wilburne", "joshwilburne", "welding-ironwork-park-slope-brooklyn", "Brownstone stoops with iron railings and front gardens"),
  "area:gowanus": U("5kS61S5ZAJg", "1470290032981-3371c20736f6", "Robert Katzki", "ro_ka", "welding-ironwork-gowanus-brooklyn", "Old brick industrial buildings and a smokestack"),
  "area:red-hook": U("SKsweJJHpkM", "1556566671-9c6f17c316af", "Julieta Demaria", "demariaj", "welding-ironwork-red-hook-brooklyn", "Brooklyn Bridge and Lower Manhattan from the Brooklyn waterfront"),
  "area:brooklyn-heights": U("KJH2wCcYy_E", "1679059543897-4624d028c025", "Ozay Demirezen", "ozaydmrzn", "welding-ironwork-brooklyn-heights", "Brooklyn Bridge and Manhattan skyline from the Brooklyn shore"),
  "area:downtown-brooklyn": U("puwdjzA1-AQ", "1565867254334-10280784ff69", "Miltiadis Fragkidis", "_miltiadis_", "welding-ironwork-downtown-brooklyn", "Manhattan Bridge framed by brick buildings in Brooklyn"),
  "area:fort-greene": U("yuhjpNvG9u0", "1466064947541-371168912a17", "Daryan Shamkhali", "daryan", "welding-ironwork-fort-greene-brooklyn", "Brick building with fire escapes seen from below"),
  "area:prospect-heights": U("YbZtSVlbWTM", "1698248476376-f28f8869b622", "Santeri", "sanderson12367", "welding-ironwork-prospect-heights-brooklyn", "Row of brownstones with stoops and iron railings"),
  "area:crown-heights": U("tHOYEWuIsjQ", "1786254554660-4bb2deb40831", "Bee", "bee_bee_bee", "welding-ironwork-crown-heights-brooklyn", "Brownstone townhouses with ornate iron railings and stoops"),
  "area:bed-stuy": U("XUZ0DUrDXkc", "1702677780313-079f79a6bed8", "Michael Moloney", "mjmolo", "welding-ironwork-bed-stuy-brooklyn", "Sunny row of brownstones behind street trees"),
  "area:bushwick": U("NF1OsaFLMlc", "1557500608-1c483bc8d90d", "Avi Werde", "aviwerde", "welding-ironwork-bushwick-brooklyn", "Colorful mixed-use buildings with storefronts and fire escapes"),
  "area:williamsburg": U("nHVLILa-LfE", "1511150445975-1a4499d7182d", "Zac Ong", "zacong", "welding-ironwork-williamsburg-brooklyn", "Williamsburg Bridge steel truss over the East River"),
  "area:greenpoint": U("pezDxdh_XF4", "1668693394982-29efa0807d43", "Sebastian Enrique", "sebenrique12", "welding-ironwork-greenpoint-brooklyn", "Wythe Avenue street sign in North Brooklyn"),
  "area:east-new-york": U("YbS4j9oQ9n4", "1665852444511-64f80caeb150", "B W", "brandon_ww", "welding-ironwork-east-new-york-brooklyn", "Brick apartment building behind autumn trees"),
  "area:staten-island": U("Yb2IPAgthno", "1648461311622-5ad0396ce72a", "David Jones", "davidjones", "welding-ironwork-staten-island", "Staten Island Ferry crossing New York Harbor"),
  "area:manhattan": U("bR2cPU2Onvs", "1575775424127-28bc80754cf5", "David Nieto", "nietramos_d", "welding-ironwork-manhattan", "Manhattan street of cast-iron buildings with fire escapes"),
  "area:queens": U("tedvPmabw1s", "1609194243294-41e8564646c2", "Juan Karmy", "karmy", "welding-ironwork-queens", "The Unisphere in Flushing Meadows, Queens"),
};
