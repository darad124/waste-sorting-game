export type WasteCategory =
  | "recyclable"
  | "organic"
  | "hazardous"
  | "eWaste"
  | "general";

export interface WasteItem {
  id: string;
  name: string;
  category: WasteCategory;
  emoji: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  commonMistake?: WasteCategory;
  shortFact: string;
  disposalInstruction: string;
  impactNote: string;
}

export const WASTE_ITEMS: WasteItem[] = [
  // --- RECYCLABLE (green) ---
  {
    id: "plastic_bottle",
    name: "Plastic Water Bottle",
    category: "recyclable",
    emoji: "🧴",
    difficulty: 1,
    commonMistake: "general",
    shortFact: "Plastic bottles can take up to 450 years to decompose in a landfill.",
    disposalInstruction: "Empty, rinse, and squash the bottle. Keep the cap on if your local program allows it.",
    impactNote: "Recycling plastic saves energy and reduces the amount of oil needed to manufacture new plastic products."
  },
  {
    id: "cardboard_box",
    name: "Cardboard Box",
    category: "recyclable",
    emoji: "📦",
    difficulty: 1,
    commonMistake: "general",
    shortFact: "Recycling 1 ton of cardboard saves 46 gallons of oil and 9 cubic yards of landfill space.",
    disposalInstruction: "Flatten the box completely and ensure it is dry and free of plastic wrap or styrofoam.",
    impactNote: "Cardboard fibers can be recycled up to 7 times to make new paper products."
  },
  {
    id: "soda_can",
    name: "Aluminum Soda Can",
    category: "recyclable",
    emoji: "🥫",
    difficulty: 1,
    shortFact: "Aluminum can be recycled infinitely without losing any of its quality or strength.",
    disposalInstruction: "Rinse out any remaining liquid and drop it in the recycling bin. No need to crush it.",
    impactNote: "Recycling aluminum uses 95% less energy than creating new aluminum from raw bauxite ore."
  },
  {
    id: "newspaper",
    name: "Newspaper",
    category: "recyclable",
    emoji: "📰",
    difficulty: 2,
    shortFact: "Recycling a single run of a Sunday newspaper saves about 75,000 trees.",
    disposalInstruction: "Keep newspapers clean and dry. Avoid putting them in the recycling if they are wet or soiled with food.",
    impactNote: "Recycled newspapers are turned into new newsprint, egg cartons, and home insulation materials."
  },
  {
    id: "glass_jar",
    name: "Glass Jar",
    category: "recyclable",
    emoji: "🫙",
    difficulty: 2,
    commonMistake: "general",
    shortFact: "Glass never wears out—it can be recycled endlessly to make new glass jars and bottles.",
    disposalInstruction: "Rinse thoroughly to remove food residue. You can leave metal lids on as they are separated magnetically.",
    impactNote: "Recycled glass is melted at a lower temperature than raw materials, saving energy and lowering emissions."
  },

  // --- ORGANIC (brown) ---
  {
    id: "banana_peel",
    name: "Banana Peel",
    category: "organic",
    emoji: "🍌",
    difficulty: 1,
    commonMistake: "general",
    shortFact: "Banana peels decompose quickly and are rich in potassium, making them excellent compost.",
    disposalInstruction: "Remove any plastic PLU stickers before throwing the peel into the organic compost bin.",
    impactNote: "In landfills, organic waste decomposes without oxygen, producing methane—a greenhouse gas 25x more potent than CO2."
  },
  {
    id: "apple_core",
    name: "Apple Core",
    category: "organic",
    emoji: "🍎",
    difficulty: 1,
    shortFact: "Apple cores break down in composting systems within a few weeks, returning nutrients to the soil.",
    disposalInstruction: "Throw directly into the green/organic waste bin. Remove any stickers or plastic ties.",
    impactNote: "Composted organic matter improves soil health, retains moisture, and reduces the need for chemical fertilizers."
  },
  {
    id: "egg_shells",
    name: "Eggshells",
    category: "organic",
    emoji: "🥚",
    difficulty: 2,
    shortFact: "Eggshells add calcium to compost, which is highly beneficial for plants like tomatoes.",
    disposalInstruction: "Crush them slightly to speed up decomposition, and toss them in the organic waste bin.",
    impactNote: "Organic waste makes up around 30% of municipal trash. Composting it diverts massive amounts of waste from landfills."
  },
  {
    id: "coffee_grounds",
    name: "Coffee Grounds",
    category: "organic",
    emoji: "☕",
    difficulty: 2,
    commonMistake: "general",
    shortFact: "Coffee grounds are highly nitrogen-rich, helping speed up the composting process.",
    disposalInstruction: "Toss grounds and paper filters into the organic bin. (Ensure the filter is 100% paper, not plastic-lined).",
    impactNote: "Using composted coffee grounds in gardens helps naturally repel pests like slugs and snails."
  },
  {
    id: "pizza_box_soiled",
    name: "Greasy Pizza Box",
    category: "organic",
    emoji: "🍕",
    difficulty: 3,
    commonMistake: "recyclable",
    shortFact: "Oil and grease ruin the recycling process for cardboard, but they are perfectly fine for composting!",
    disposalInstruction: "Tear soiled cardboard into smaller pieces and place it in the organic waste or compost bin.",
    impactNote: "Putting greasy cardboard in recycling can contaminate entire batches of paper, causing them to be sent to landfills."
  },

  // --- HAZARDOUS (red) ---
  {
    id: "alkaline_battery",
    name: "Alkaline Battery",
    category: "hazardous",
    emoji: "🔋",
    difficulty: 2,
    commonMistake: "eWaste",
    shortFact: "Batteries contain heavy metals like zinc, manganese, and steel that can leach into soil if trashed.",
    disposalInstruction: "Never put batteries in general trash or recycling. Take them to a specialized household hazardous waste drop-off.",
    impactNote: "Recycling batteries recovers valuable metals and prevents toxic runoffs into water supplies."
  },
  {
    id: "paint_can",
    name: "Leftover Paint Can",
    category: "hazardous",
    emoji: "🎨",
    difficulty: 3,
    commonMistake: "recyclable",
    shortFact: "Liquid paint contains solvents and chemicals that can contaminate groundwater systems.",
    disposalInstruction: "Drop off at a local paint collection facility or mix with sawdust/kitty litter to dry it out before disposal.",
    impactNote: "Hazardous waste treatment facilities safely neutralize or incinerate chemical waste to protect ecosystems."
  },
  {
    id: "spray_can",
    name: "Aerosol Spray Can",
    category: "hazardous",
    emoji: "💨",
    difficulty: 3,
    commonMistake: "recyclable",
    shortFact: "Aerosol cans are pressurized and can explode under high heat or pressure in trash compactor trucks.",
    disposalInstruction: "If completely empty, some programs accept them in recycling, but partially full cans must go to hazardous waste.",
    impactNote: "Safe handling of aerosol cans prevents fire hazards and protects sanitation workers from injuries."
  },
  {
    id: "thermometer",
    name: "Mercury Thermometer",
    category: "hazardous",
    emoji: "🌡️",
    difficulty: 4,
    commonMistake: "general",
    shortFact: "Mercury is a highly toxic neurotoxin. Just a small amount can contaminate a large water reservoir.",
    disposalInstruction: "Bring to a hazardous waste depot. If broken, do not vacuum or sweep; follow mercury cleanup guidelines.",
    impactNote: "Proper containment of mercury items keeps heavy metals out of the food chain, especially seafood."
  },

  // --- E-WASTE (blue) ---
  {
    id: "old_cellphone",
    name: "Old Smart Phone",
    category: "eWaste",
    emoji: "📱",
    difficulty: 2,
    commonMistake: "hazardous",
    shortFact: "E-waste contains precious metals like gold and silver. There is 100x more gold in a ton of smartphones than in a ton of gold ore!",
    disposalInstruction: "Back up your data, factory reset the device, and bring it to an electronics recycling bin or retail buyback program.",
    impactNote: "Recycling electronics reduces the need to mine raw minerals, which causes severe environmental damage."
  },
  {
    id: "charging_cable",
    name: "USB Charging Cable",
    category: "eWaste",
    emoji: "🔌",
    difficulty: 2,
    commonMistake: "general",
    shortFact: "Cables contain valuable copper wiring covered in protective plastic, both of which are recyclable.",
    disposalInstruction: "Place in an e-waste bin. Do not throw in general recycling, as they get tangled in sorting machines (known as 'tanglers').",
    impactNote: "Diverting cables from landfills prevents plastic degradation and recovers copper, a vital industrial metal."
  },
  {
    id: "keyboard",
    name: "Broken Keyboard",
    category: "eWaste",
    emoji: "⌨️",
    difficulty: 3,
    commonMistake: "general",
    shortFact: "Computer keyboards consist of plastics, circuit boards, and wires that do not decompose.",
    disposalInstruction: "Drop off at an e-waste collection kiosk or a designated local electronics recycling event.",
    impactNote: "Electronic waste is the fastest-growing waste stream in the world, making recycling programs critical."
  },
  {
    id: "led_bulb",
    name: "LED Light Bulb",
    category: "eWaste",
    emoji: "💡",
    difficulty: 4,
    commonMistake: "general",
    shortFact: "LED bulbs contain microchips and electronic components that shouldn't be tossed in standard glass recycling.",
    disposalInstruction: "Take them to an electronics recycling center or participating retail stores that accept lightbulbs.",
    impactNote: "Recycling bulbs helps reclaim plastics and metals while keeping trace heavy metals out of landfills."
  },

  // --- GENERAL WASTE (grey) ---
  {
    id: "styrofoam_cup",
    name: "Styrofoam Coffee Cup",
    category: "general",
    emoji: "🥤",
    difficulty: 2,
    commonMistake: "recyclable",
    shortFact: "Styrofoam (expanded polystyrene) is made of 95% air but is highly resistant to natural decomposition.",
    disposalInstruction: "Throw in the general waste bin. Most recycling programs cannot process Styrofoam because it is too light and breaks apart.",
    impactNote: "Styrofoam breaks down into microplastics that pollute oceans and enter the food chains of marine life."
  },
  {
    id: "diaper",
    name: "Disposable Diaper",
    category: "general",
    emoji: "🧷",
    difficulty: 1,
    commonMistake: "organic",
    shortFact: "Disposable diapers can take up to 500 years to decompose in a landfill.",
    disposalInstruction: "Wrap securely and place in the general trash bin. Never put them in organic or recycling bins.",
    impactNote: "Diapers are composite materials (plastic, paper, super-absorbent gels) and are contaminated, making them unrecyclable."
  },
  {
    id: "ceramic_mug",
    name: "Broken Ceramic Mug",
    category: "general",
    emoji: "🥛",
    difficulty: 3,
    commonMistake: "recyclable",
    shortFact: "Ceramics melt at a much higher temperature than glass bottles, so they cannot be recycled together.",
    disposalInstruction: "Wrap in newspaper or cardboard to protect sanitation workers, and place in the general trash bin.",
    impactNote: "Mixing ceramics with recyclable glass ruins the entire batch of molten glass in the recycling furnace."
  },
  {
    id: "chip_bag",
    name: "Potato Chip Bag",
    category: "general",
    emoji: "🍿",
    difficulty: 3,
    commonMistake: "recyclable",
    shortFact: "Chip bags are made of plastic laminated with a thin layer of aluminum, making them impossible to separate.",
    disposalInstruction: "Throw in the general waste bin. Check for the 'Store Drop-Off' label to see if special soft-plastic collection is available.",
    impactNote: "Multi-layered packaging is cheap to make but is currently one of the hardest materials to recycle."
  },
  {
    id: "face_mask",
    name: "Disposable Face Mask",
    category: "general",
    emoji: "😷",
    difficulty: 1,
    commonMistake: "recyclable",
    shortFact: "Most surgical masks are made of polypropylene, a type of plastic that does not decompose quickly.",
    disposalInstruction: "Cut the ear loops to prevent wildlife entanglement, wrap securely, and throw in general waste.",
    impactNote: "Improperly discarded masks have become a significant source of ocean plastic pollution since 2020."
  },
  
  // --- NEW ADDITIONS ---
  // Recyclables
  {
    id: "milk_jug",
    name: "Plastic Milk Jug",
    category: "recyclable",
    emoji: "🥛",
    difficulty: 2,
    commonMistake: "general",
    shortFact: "HDPE milk jugs are highly recyclable and remade into drainage piping and plastic lumber.",
    disposalInstruction: "Empty, rinse, and crush. Recycle with the lid screwed on.",
    impactNote: "Recycling milk jugs saves up to 50% of the energy compared to manufacturing new plastic."
  },
  {
    id: "steel_tin_can",
    name: "Steel Soup Can",
    category: "recyclable",
    emoji: "🥫",
    difficulty: 2,
    shortFact: "Tin cans are made of steel and can be melted down and recycled infinitely without degrading.",
    disposalInstruction: "Rinse food residues thoroughly. You can place the metal lid inside the can to protect handlers.",
    impactNote: "Recycling steel saves enough energy to power a lightbulb for over 24 hours per can."
  },
  // Organics
  {
    id: "tea_bag",
    name: "Paper Tea Bag",
    category: "organic",
    emoji: "🍵",
    difficulty: 2,
    commonMistake: "general",
    shortFact: "Paper tea bags decompose quickly, but remember to clip or remove any metal staples.",
    disposalInstruction: "Remove staples or synthetic string before putting the bag into the compost caddy.",
    impactNote: "Composted tea bags add nitrogen and organic nutrients to gardening soil."
  },
  {
    id: "wooden_chopsticks",
    name: "Wooden Chopsticks",
    category: "organic",
    emoji: "🥢",
    difficulty: 3,
    commonMistake: "general",
    shortFact: "Clean bamboo or wood chopsticks decompose naturally in commercial composting facilities.",
    disposalInstruction: "Place in the organic compost bin. Ensure they are free from plastic wrappers or soy sauce packets.",
    impactNote: "Diverting wood utensils from landfills allows them to decay with oxygen, preventing methane gas release."
  },
  // Hazardous
  {
    id: "medicine_expired",
    name: "Expired Medicine",
    category: "hazardous",
    emoji: "💊",
    difficulty: 3,
    commonMistake: "general",
    shortFact: "Flushing medication down toilets pollutes rivers and threatens aquatic wildlife.",
    disposalInstruction: "Dispose at a pharmacy drop box or household hazardous waste collection site.",
    impactNote: "Proper hazardous processing filters medical chemicals out of water systems."
  },
  {
    id: "paint_thinner",
    name: "Chemical Thinner",
    category: "hazardous",
    emoji: "🧪",
    difficulty: 4,
    commonMistake: "recyclable",
    shortFact: "Solvents and paint thinners are highly toxic, corrosive, and flammable.",
    disposalInstruction: "Never pour down drains. Bring to a dedicated chemical hazardous waste depot.",
    impactNote: "Preventing chemical dumps protects municipal sanitation pipes and stops biological soil poisoning."
  },
  // E-Waste
  {
    id: "broken_tablet",
    name: "Cracked Tablet",
    category: "eWaste",
    emoji: "📟",
    difficulty: 3,
    commonMistake: "hazardous",
    shortFact: "Tablets contain toxic heavy metals and lithium batteries that must be disassembled separately.",
    disposalInstruction: "Remove personal accounts, back up data, and bring to an electronics collection center.",
    impactNote: "Reclaiming rare earth metals from screens reduces destructive mineral mining."
  },
  {
    id: "remote_control",
    name: "TV Remote Control",
    category: "eWaste",
    emoji: "🎛️",
    difficulty: 3,
    commonMistake: "general",
    shortFact: "Remotes have plastic casings, rubber pads, and circuit boards containing lead.",
    disposalInstruction: "Take out the AA/AAA batteries first, and recycle the remote in an e-waste bin.",
    impactNote: "Recycling remote controls recovers reusable ABS plastics and copper contacts."
  },
  // General Waste
  {
    id: "plastic_wrap",
    name: "Cling Wrap",
    category: "general",
    emoji: "🧻",
    difficulty: 4,
    commonMistake: "recyclable",
    shortFact: "Thin stretch wrap tangles around sorting gears, causing machinery shut downs.",
    disposalInstruction: "Place in general trash. Check if soft-plastic retail kiosks accept clean wraps.",
    impactNote: "Standard home collection centers do not possess mechanisms to isolate thin-film plastics."
  },
  {
    id: "chewing_gum",
    name: "Chewing Gum",
    category: "general",
    emoji: "🍬",
    difficulty: 2,
    commonMistake: "organic",
    shortFact: "Modern commercial chewing gum is made of synthetic polymers (rubbers) and will not compost.",
    disposalInstruction: "Wrap in a piece of paper and discard in the grey general waste bin.",
    impactNote: "Littered gum is a significant cause of street pollution and is highly toxic if ingested by birds."
  }
];
