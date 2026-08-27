// Shared presentation metadata for each waste category.
// Kept out of BinBadge.tsx so component files only export components (fast refresh).
export const CATEGORY_META = {
  recyclable: {
    label: "Recyclable",
    colorClass: "text-brand-recyclable bg-brand-recyclable/10 border-brand-recyclable/30",
    emoji: "♻️",
    description: "Plastics, metal, cardboard, paper, and clean glass.",
  },
  organic: {
    label: "Organic",
    colorClass: "text-brand-organic bg-brand-organic/10 border-brand-organic/30",
    emoji: "🍌",
    description: "Food leftovers, fruit peels, eggshells, and coffee grounds.",
  },
  hazardous: {
    label: "Hazardous",
    colorClass: "text-brand-hazardous bg-brand-hazardous/10 border-brand-hazardous/30",
    emoji: "⚠️",
    description: "Batteries, aerosol sprays, wet paint, chemicals, and mercury.",
  },
  eWaste: {
    label: "E-Waste",
    colorClass: "text-brand-ewaste bg-brand-ewaste/10 border-brand-ewaste/30",
    emoji: "🔌",
    description: "Old phones, chargers, USB cords, keyboards, and lightbulbs.",
  },
  general: {
    label: "General Waste",
    colorClass: "text-brand-general bg-brand-general/10 border-brand-general/30",
    emoji: "🗑️",
    description: "Styrofoam, soiled packaging, ceramics, diapers, and face masks.",
  },
};
