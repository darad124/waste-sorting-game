import React from "react";

interface ItemSVGProps {
  itemId: string;
  size?: number;
  className?: string;
}

export const ItemSVG: React.FC<ItemSVGProps> = ({ itemId, size = 48, className = "" }) => {
  switch (itemId) {
    case "plastic_bottle":
      return (
        <svg viewBox="0 0 100 100" className={className} width={size} height={size}>
          <rect x="42" y="10" width="16" height="8" rx="2" fill="#1d4ed8" />
          <rect x="44" y="18" width="12" height="4" fill="#2563eb" />
          <path d="M40 22 H60 L56 32 H44 Z" fill="#93c5fd" />
          <path d="M44 32 L36 44 V82 Q36 88 42 88 H58 Q64 88 64 82 V44 L56 32 Z" fill="#bfdbfe" />
          <rect x="36" y="50" width="28" height="16" fill="#3b82f6" />
          <path d="M 40 58 Q 50 54 60 58" fill="none" stroke="#eff6ff" strokeWidth="2" />
          <path d="M40 36 L38 44 V80" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
        </svg>
      );

    case "cardboard_box":
      return (
        <svg viewBox="0 0 100 100" className={className} width={size} height={size}>
          <path d="M20 40 L50 58 L50 88 L20 70 Z" fill="#b45309" />
          <path d="M50 58 L80 40 L80 70 L50 88 Z" fill="#92400e" />
          <path d="M20 40 L50 22 L80 40 L50 58 Z" fill="#d97706" />
          <path d="M50 22 L30 31 L50 43 L70 31 Z" fill="#b45309" opacity="0.15" />
          <line x1="50" y1="22" x2="50" y2="58" stroke="#78350f" strokeWidth="2" />
        </svg>
      );

    case "soda_can":
      return (
        <svg viewBox="0 0 100 100" className={className} width={size} height={size}>
          <ellipse cx="50" cy="20" rx="20" ry="5" fill="#94a3b8" />
          <ellipse cx="50" cy="20" rx="16" ry="3.5" fill="#cbd5e1" />
          <path d="M30 20 V76 Q30 82 50 82 Q70 82 70 76 V20 Z" fill="#dc2626" />
          <path d="M30 45 Q50 35 70 45 V55 Q50 45 30 55 Z" fill="#ffffff" />
          <path d="M36 24 V72" fill="none" stroke="#ffffff" strokeWidth="2.5" opacity="0.4" strokeLinecap="round" />
          <path d="M48 17 L52 17 L52 21 L48 21 Z" fill="#64748b" />
          <circle cx="50" cy="21" r="2" fill="#475569" />
        </svg>
      );

    case "newspaper":
      return (
        <svg viewBox="0 0 100 100" className={className} width={size} height={size}>
          <rect x="25" y="20" width="50" height="60" rx="3" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
          <rect x="28" y="24" width="48" height="58" rx="2" fill="#cbd5e1" />
          <rect x="30" y="28" width="40" height="8" fill="#475569" />
          <line x1="30" y1="42" x2="70" y2="42" stroke="#64748b" strokeWidth="2" strokeDasharray="4,2" />
          <line x1="30" y1="48" x2="70" y2="48" stroke="#64748b" strokeWidth="2" strokeDasharray="3,2" />
          <line x1="30" y1="54" x2="60" y2="54" stroke="#64748b" strokeWidth="2" strokeDasharray="4,1" />
          <rect x="30" y="60" width="16" height="14" fill="#94a3b8" />
          <line x1="50" y1="64" x2="70" y2="64" stroke="#64748b" strokeWidth="2" />
          <line x1="50" y1="70" x2="70" y2="70" stroke="#64748b" strokeWidth="2" />
        </svg>
      );

    case "glass_jar":
      return (
        <svg viewBox="0 0 100 100" className={className} width={size} height={size}>
          <rect x="38" y="16" width="24" height="6" rx="1.5" fill="#d97706" />
          <rect x="36" y="22" width="28" height="4" rx="1" fill="#b45309" />
          <path d="M40 26 H60 V34 H40 Z" fill="#99f6e4" opacity="0.6" />
          <path d="M40 34 H60 C72 34 72 44 72 48 V80 C72 86 64 88 50 88 C36 88 28 86 28 80 V48 C28 44 28 34 40 34 Z" fill="#ccfbf1" opacity="0.75" stroke="#2dd4bf" strokeWidth="2" />
          <path d="M34 46 V76" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
          <ellipse cx="50" cy="82" rx="16" ry="4" fill="#0d9488" opacity="0.2" />
        </svg>
      );

    case "banana_peel":
      return (
        <svg viewBox="0 0 100 100" className={className} width={size} height={size}>
          <path d="M50 20 Q52 14 56 16 T50 26 Z" fill="#78350f" />
          <path d="M50 26 C42 42 22 55 12 55 C22 58 40 50 50 40 Z" fill="#eab308" />
          <path d="M50 26 C58 42 78 55 88 55 C78 58 60 50 50 40 Z" fill="#eab308" />
          <path d="M50 26 C52 46 45 74 38 88 C46 80 54 54 50 26 Z" fill="#ca8a04" />
          <path d="M50 26 C48 46 55 74 62 88 C54 80 46 54 50 26 Z" fill="#fde047" />
          <circle cx="45" cy="50" r="2" fill="#451a03" opacity="0.4" />
          <circle cx="53" cy="62" r="1.5" fill="#451a03" opacity="0.4" />
          <circle cx="36" cy="74" r="2" fill="#451a03" opacity="0.4" />
          <path d="M 37 86 L 39 88 L 36 88 Z" fill="#451a03" />
          <path d="M 61 86 L 63 88 L 60 88 Z" fill="#451a03" />
        </svg>
      );

    case "apple_core":
      return (
        <svg viewBox="0 0 100 100" className={className} width={size} height={size}>
          <path d="M50 25 Q54 12 60 14" fill="none" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M54 16 Q64 12 62 20 Q54 22 54 16 Z" fill="#16a34a" />
          <path d="M30 36 C34 26 66 26 70 36 C64 36 58 42 50 42 C42 42 36 36 30 36 Z" fill="#dc2626" />
          <path d="M30 68 C34 78 66 78 70 68 C64 68 58 64 50 64 C42 64 36 68 30 68 Z" fill="#dc2626" />
          <path d="M50 42 C44 42 42 46 42 53 C42 60 44 64 50 64 C56 64 58 60 58 53 C58 46 56 42 50 42 Z" fill="#fef08a" />
          <circle cx="47" cy="51" r="2" fill="#451a03" />
          <circle cx="53" cy="55" r="2" fill="#451a03" />
        </svg>
      );

    case "egg_shells":
      return (
        <svg viewBox="0 0 100 100" className={className} width={size} height={size}>
          <path d="M15 50 C15 30 35 25 45 42 L40 50 L48 55 L38 62 L45 70 C35 78 15 70 15 50 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
          <path d="M85 50 C85 30 65 25 55 42 L60 50 L52 55 L62 62 L55 70 C65 78 85 70 85 50 Z" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="2" />
          <circle cx="34" cy="52" r="6" fill="#f59e0b" opacity="0.15" />
        </svg>
      );

    case "coffee_grounds":
      return (
        <svg viewBox="0 0 100 100" className={className} width={size} height={size}>
          <path d="M24 36 L34 74 C36 78 40 80 50 80 C60 80 64 78 66 74 L76 36 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
          <path d="M22 36 H78 L74 44 H26 Z" fill="#e2e8f0" />
          <path d="M30 50 L34 72 C35 75 38 76 50 76 C62 76 65 75 66 72 L70 50 Z" fill="#451a03" />
          <circle cx="44" cy="62" r="1.5" fill="#1c1917" />
          <circle cx="56" cy="66" r="1.5" fill="#1c1917" />
          <circle cx="50" cy="58" r="1.5" fill="#1c1917" />
        </svg>
      );

    case "pizza_box_soiled":
      return (
        <svg viewBox="0 0 100 100" className={className} width={size} height={size}>
          <rect x="20" y="24" width="60" height="52" rx="3" fill="#f5f5f4" stroke="#d6d3d1" strokeWidth="2" />
          <line x1="20" y1="28" x2="80" y2="28" stroke="#d6d3d1" strokeWidth="1.5" />
          <path d="M50 34 L62 52 H38 Z" fill="#ef4444" opacity="0.4" />
          <circle cx="50" cy="46" r="12" fill="none" stroke="#ef4444" strokeWidth="2" opacity="0.5" />
          <circle cx="34" cy="62" r="8" fill="#ca8a04" opacity="0.35" />
          <circle cx="68" cy="58" r="6" fill="#ca8a04" opacity="0.4" />
          <circle cx="48" cy="68" r="7" fill="#b45309" opacity="0.3" />
        </svg>
      );

    case "alkaline_battery":
      return (
        <svg viewBox="0 0 100 100" className={className} width={size} height={size}>
          <rect x="44" y="16" width="12" height="6" rx="1" fill="#d97706" />
          <rect x="28" y="22" width="44" height="62" rx="4" fill="#1e293b" />
          <path d="M28 22 H72 V42 H28 Z" fill="#ea580c" />
          <text x="50" y="66" textAnchor="middle" fontSize="14" fill="#ffffff" fontWeight="bold" fontFamily="sans-serif">+</text>
          <rect x="28" y="42" width="44" height="4" fill="#10b981" />
        </svg>
      );

    case "paint_can":
      return (
        <svg viewBox="0 0 100 100" className={className} width={size} height={size}>
          <path d="M24 45 C 24 15 76 15 76 45" fill="none" stroke="#64748b" strokeWidth="2" />
          <rect x="24" y="40" width="52" height="48" rx="2" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="2" />
          <rect x="24" y="52" width="52" height="22" fill="#ffffff" />
          <text x="50" y="68" textAnchor="middle" fontSize="11" fill="#475569" fontWeight="bold">PAINT</text>
          <path d="M24 40 H76 V46 C70 46 68 56 64 56 C60 56 58 46 52 46 C46 46 44 58 38 58 C32 58 30 40 24 40 Z" fill="#3b82f6" />
          <circle cx="38" cy="62" r="3.5" fill="#3b82f6" />
        </svg>
      );

    case "spray_can":
      return (
        <svg viewBox="0 0 100 100" className={className} width={size} height={size}>
          <path d="M46 16 H54 V26 H46 Z" fill="#e2e8f0" />
          <path d="M42 22 L46 22 L46 26 L42 26 Z" fill="#94a3b8" />
          <path d="M32 32 C32 24 68 24 68 32 Z" fill="#cbd5e1" />
          <rect x="32" y="32" width="36" height="56" rx="2" fill="#059669" />
          <rect x="32" y="52" width="36" height="12" fill="#ef4444" />
          <path d="M 50 54 L 56 62 H 44 Z" fill="#ffffff" />
          <circle cx="28" cy="20" r="1.5" fill="#38bdf8" opacity="0.6" />
          <circle cx="24" cy="24" r="2.5" fill="#38bdf8" opacity="0.4" />
        </svg>
      );

    case "thermometer":
      return (
        <svg viewBox="0 0 100 100" className={className} width={size} height={size}>
          <rect x="42" y="10" width="16" height="80" rx="3" fill="#f5f5f4" stroke="#e7e5e4" strokeWidth="2" />
          <rect x="48" y="16" width="4" height="56" rx="1.5" fill="#e2e8f0" />
          <circle cx="50" cy="74" r="6" fill="#ef4444" />
          <rect x="49" y="36" width="2" height="34" fill="#ef4444" />
          <line x1="44" y1="24" x2="47" y2="24" stroke="#78716c" strokeWidth="1" />
          <line x1="44" y1="34" x2="47" y2="34" stroke="#78716c" strokeWidth="1" />
          <line x1="44" y1="44" x2="47" y2="44" stroke="#78716c" strokeWidth="1" />
          <line x1="44" y1="54" x2="47" y2="54" stroke="#78716c" strokeWidth="1" />
        </svg>
      );

    case "old_cellphone":
      return (
        <svg viewBox="0 0 100 100" className={className} width={size} height={size}>
          <rect x="30" y="14" width="40" height="72" rx="6" fill="#334155" />
          <rect x="34" y="22" width="32" height="52" rx="2" fill="#0f172a" />
          <circle cx="50" cy="80" r="3.5" fill="none" stroke="#64748b" strokeWidth="1.5" />
          <path d="M38 28 L50 44 L44 56 L62 60" fill="none" stroke="#94a3b8" strokeWidth="1.5" opacity="0.7" />
          <path d="M50 44 L60 38 L64 48" fill="none" stroke="#94a3b8" strokeWidth="1.2" opacity="0.6" />
          <path d="M44 56 L36 62" fill="none" stroke="#94a3b8" strokeWidth="1" opacity="0.5" />
        </svg>
      );

    case "charging_cable":
      return (
        <svg viewBox="0 0 100 100" className={className} width={size} height={size}>
          <path d="M28 50 C24 38 34 26 46 28 C58 30 64 46 50 56 C38 64 48 76 60 74 C68 72 74 60 72 48" fill="none" stroke="#475569" strokeWidth="4.5" strokeLinecap="round" />
          <rect x="68" y="32" width="8" height="14" rx="1.5" fill="#1e293b" />
          <rect x="70" y="24" width="4" height="8" fill="#cbd5e1" />
        </svg>
      );

    case "keyboard":
      return (
        <svg viewBox="0 0 100 100" className={className} width={size} height={size}>
          <rect x="15" y="34" width="70" height="32" rx="4" fill="#475569" stroke="#334155" strokeWidth="2" />
          <rect x="18" y="38" width="6" height="5" rx="1" fill="#cbd5e1" />
          <rect x="26" y="38" width="6" height="5" rx="1" fill="#cbd5e1" />
          <rect x="34" y="38" width="6" height="5" rx="1" fill="#cbd5e1" />
          <rect x="42" y="38" width="6" height="5" rx="1" fill="#cbd5e1" />
          <rect x="50" y="38" width="6" height="5" rx="1" fill="#cbd5e1" />
          <rect x="58" y="38" width="6" height="5" rx="1" fill="#cbd5e1" />
          <rect x="66" y="38" width="6" height="5" rx="1" fill="#cbd5e1" />
          <rect x="74" y="38" width="8" height="5" rx="1" fill="#94a3b8" />
          <rect x="18" y="46" width="8" height="5" rx="1" fill="#94a3b8" />
          <rect x="28" y="46" width="6" height="5" rx="1" fill="#cbd5e1" />
          <rect x="36" y="46" width="6" height="5" rx="1" fill="#cbd5e1" />
          <rect x="44" y="46" width="6" height="5" rx="1" fill="#cbd5e1" />
          <rect x="52" y="46" width="6" height="5" rx="1" fill="#cbd5e1" />
          <rect x="60" y="46" width="6" height="5" rx="1" fill="#cbd5e1" />
          <rect x="68" y="46" width="6" height="5" rx="1" fill="#cbd5e1" />
          <rect x="76" y="46" width="6" height="5" rx="1" fill="#cbd5e1" />
          <rect x="18" y="54" width="10" height="5" rx="1" fill="#94a3b8" />
          <rect x="30" y="54" width="38" height="5" rx="1" fill="#cbd5e1" />
          <rect x="70" y="54" width="12" height="5" rx="1" fill="#94a3b8" />
        </svg>
      );

    case "led_bulb":
      return (
        <svg viewBox="0 0 100 100" className={className} width={size} height={size}>
          <rect x="42" y="70" width="16" height="12" fill="#94a3b8" />
          <line x1="42" y1="74" x2="58" y2="74" stroke="#475569" strokeWidth="1.5" />
          <line x1="42" y1="78" x2="58" y2="78" stroke="#475569" strokeWidth="1.5" />
          <path d="M46 82 L50 86 L54 82 Z" fill="#475569" />
          <path d="M40 70 C34 70 28 60 28 46 C28 30 38 20 50 20 C62 20 72 30 72 46 C72 60 66 70 60 70 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
          <rect x="47" y="45" width="6" height="25" fill="#e2e8f0" />
          <circle cx="50" cy="40" r="8" fill="#86efac" opacity="0.8" />
          <circle cx="50" cy="40" r="3" fill="#22c55e" />
        </svg>
      );

    case "styrofoam_cup":
      return (
        <svg viewBox="0 0 100 100" className={className} width={size} height={size}>
          <path d="M30 24 L38 82 C38 85 42 86 50 86 C58 86 62 85 62 82 L70 24 Z" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2.5" />
          <ellipse cx="50" cy="24" rx="20" ry="3" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
          <path d="M32 40 Q50 43 68 40" fill="none" stroke="#f1f5f9" strokeWidth="2" />
          <path d="M34 56 Q50 59 66 56" fill="none" stroke="#f1f5f9" strokeWidth="2" />
        </svg>
      );

    case "diaper":
      return (
        <svg viewBox="0 0 100 100" className={className} width={size} height={size}>
          <path d="M22 34 Q50 24 78 34 L72 74 C60 84 40 84 28 74 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
          <path d="M28 50 Q50 64 72 50" fill="none" stroke="#f1f5f9" strokeWidth="2.5" />
          <rect x="18" y="38" width="8" height="6" rx="1" fill="#3b82f6" />
          <rect x="74" y="38" width="8" height="6" rx="1" fill="#3b82f6" />
        </svg>
      );

    case "ceramic_mug":
      return (
        <svg viewBox="0 0 100 100" className={className} width={size} height={size}>
          <path d="M68 36 C82 36 82 64 68 64" fill="none" stroke="#cbd5e1" strokeWidth="7.5" strokeLinecap="round" />
          <path d="M68 36 C80 36 80 64 68 64" fill="none" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
          <rect x="24" y="24" width="44" height="52" rx="5" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="2" />
          <ellipse cx="46" cy="24" rx="22" ry="4" fill="#94a3b8" />
          <path d="M36 24 L42 40 L38 52" fill="none" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    case "chip_bag":
      return (
        <svg viewBox="0 0 100 100" className={className} width={size} height={size}>
          <path d="M26 22 L74 22 L70 78 L30 78 Z" fill="#f97316" />
          <path d="M26 22 L30 18 L34 22 L38 18 L42 22 L46 18 L50 22 L54 18 L58 22 L62 18 L66 22 L70 18 L74 22 Z" fill="#c2410c" />
          <path d="M30 78 L34 82 L38 78 L42 82 L46 78 L50 82 L54 78 L58 82 L62 78 L66 82 L70 78 Z" fill="#c2410c" />
          <polygon points="34,42 66,36 60,62 38,58" fill="#fde047" />
          <circle cx="48" cy="48" r="4" fill="#ef4444" />
        </svg>
      );

    case "face_mask":
      return (
        <svg viewBox="0 0 100 100" className={className} width={size} height={size}>
          <path d="M22 44 C8 44 8 56 22 56" fill="none" stroke="#e2e8f0" strokeWidth="2.5" />
          <path d="M78 44 C92 44 92 56 78 56" fill="none" stroke="#e2e8f0" strokeWidth="2.5" />
          <rect x="22" y="36" width="56" height="28" rx="2" fill="#bae6fd" stroke="#7dd3fc" strokeWidth="1.5" />
          <line x1="24" y1="43" x2="76" y2="43" stroke="#38bdf8" strokeWidth="1.5" />
          <line x1="24" y1="50" x2="76" y2="50" stroke="#38bdf8" strokeWidth="1.5" />
          <line x1="24" y1="57" x2="76" y2="57" stroke="#38bdf8" strokeWidth="1.5" />
        </svg>
      );

    case "milk_jug":
      return (
        <svg viewBox="0 0 100 100" className={className} width={size} height={size}>
          <rect x="42" y="10" width="16" height="8" rx="2" fill="#2563eb" />
          <path d="M 32 30 C 32 18 68 18 68 30 L 68 80 C 68 86 62 88 50 88 C 38 88 32 86 32 80 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2.5" />
          <path d="M 32 40 L 22 45 L 22 65 L 32 70" fill="none" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" />
          <path d="M 32 40 L 22 45 L 22 65 L 32 70" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case "steel_tin_can":
      return (
        <svg viewBox="0 0 100 100" className={className} width={size} height={size}>
          <rect x="30" y="20" width="40" height="60" rx="3" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="2" />
          <line x1="30" y1="35" x2="70" y2="35" stroke="#94a3b8" strokeWidth="2" />
          <line x1="30" y1="50" x2="70" y2="50" stroke="#94a3b8" strokeWidth="2" />
          <line x1="30" y1="65" x2="70" y2="65" stroke="#94a3b8" strokeWidth="2" />
          <rect x="30" y="40" width="40" height="20" fill="#22c55e" opacity="0.8" />
          <circle cx="50" cy="50" r="5" fill="#fef08a" />
        </svg>
      );

    case "tea_bag":
      return (
        <svg viewBox="0 0 100 100" className={className} width={size} height={size}>
          <path d="M30 40 L50 20 L70 40 L65 75 L35 75 Z" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="2" />
          <rect x="37" y="42" width="26" height="30" fill="#b45309" opacity="0.15" />
          <path d="M50 20 C 50 10 70 8 72 16" fill="none" stroke="#cbd5e1" strokeWidth="1.5" />
          <rect x="68" y="16" width="12" height="10" rx="1" fill="#ef4444" />
          <line x1="48" y1="22" x2="52" y2="22" stroke="#475569" strokeWidth="2.5" />
        </svg>
      );

    case "wooden_chopsticks":
      return (
        <svg viewBox="0 0 100 100" className={className} width={size} height={size}>
          <line x1="20" y1="80" x2="75" y2="20" stroke="#ca8a04" strokeWidth="5.5" strokeLinecap="round" />
          <line x1="26" y1="86" x2="81" y2="26" stroke="#ca8a04" strokeWidth="5.5" strokeLinecap="round" />
          <line x1="20" y1="80" x2="40" y2="58" stroke="#a16207" strokeWidth="5.5" strokeLinecap="round" opacity="0.3" />
          <line x1="26" y1="86" x2="46" y2="64" stroke="#a16207" strokeWidth="5.5" strokeLinecap="round" opacity="0.3" />
        </svg>
      );

    case "medicine_expired":
      return (
        <svg viewBox="0 0 100 100" className={className} width={size} height={size}>
          <rect x="36" y="24" width="28" height="52" rx="4" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
          <rect x="36" y="34" width="28" height="14" fill="#ef4444" opacity="0.85" />
          <line x1="50" y1="37" x2="50" y2="45" stroke="#ffffff" strokeWidth="2.5" />
          <line x1="46" y1="41" x2="54" y2="41" stroke="#ffffff" strokeWidth="2.5" />
          <circle cx="44" cy="58" r="4.5" fill="#f59e0b" />
          <circle cx="56" cy="66" r="4.5" fill="#3b82f6" />
        </svg>
      );

    case "paint_thinner":
      return (
        <svg viewBox="0 0 100 100" className={className} width={size} height={size}>
          <rect x="32" y="34" width="36" height="52" rx="3" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="2.5" />
          <rect x="42" y="16" width="16" height="18" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.5" />
          <circle cx="50" cy="18" r="4" fill="#ef4444" />
          <circle cx="50" cy="62" r="10" fill="none" stroke="#f43f5e" strokeWidth="3.5" opacity="0.8" />
          <line x1="44" y1="56" x2="56" y2="68" stroke="#f43f5e" strokeWidth="3" />
        </svg>
      );

    case "broken_tablet":
      return (
        <svg viewBox="0 0 100 100" className={className} width={size} height={size}>
          <rect x="22" y="15" width="56" height="70" rx="5" fill="#334155" stroke="#1e293b" strokeWidth="2.5" />
          <rect x="26" y="22" width="48" height="56" fill="#0f172a" />
          <path d="M 28 26 L 46 54 L 56 46 L 70 74" fill="none" stroke="#94a3b8" strokeWidth="1.5" opacity="0.8" />
          <path d="M 46 54 L 38 68" fill="none" stroke="#94a3b8" strokeWidth="1" opacity="0.6" />
          <circle cx="50" cy="81" r="2.5" fill="none" stroke="#64748b" strokeWidth="1.5" />
        </svg>
      );

    case "remote_control":
      return (
        <svg viewBox="0 0 100 100" className={className} width={size} height={size}>
          <rect x="38" y="14" width="24" height="72" rx="4" fill="#334155" />
          <circle cx="50" cy="22" r="3" fill="#ef4444" />
          <rect x="43" y="32" width="4" height="4" rx="0.5" fill="#94a3b8" />
          <rect x="53" y="32" width="4" height="4" rx="0.5" fill="#94a3b8" />
          <rect x="43" y="42" width="4" height="4" rx="0.5" fill="#cbd5e1" />
          <rect x="53" y="42" width="4" height="4" rx="0.5" fill="#cbd5e1" />
          <rect x="43" y="52" width="4" height="4" rx="0.5" fill="#cbd5e1" />
          <rect x="53" y="52" width="4" height="4" rx="0.5" fill="#cbd5e1" />
          <rect x="43" y="62" width="4" height="4" rx="0.5" fill="#cbd5e1" />
          <rect x="53" y="62" width="4" height="4" rx="0.5" fill="#cbd5e1" />
          <rect x="45" y="74" width="10" height="5" rx="1" fill="#475569" />
        </svg>
      );

    case "plastic_wrap":
      return (
        <svg viewBox="0 0 100 100" className={className} width={size} height={size}>
          <rect x="15" y="40" width="70" height="20" fill="#94a3b8" opacity="0.6" rx="2" />
          <path d="M 12 40 C 20 36 30 44 40 40 C 50 36 60 44 70 40 C 80 36 88 44 88 44" fill="none" stroke="#bae6fd" strokeWidth="4.5" opacity="0.8" />
          <path d="M 12 50 C 20 46 30 54 40 50 C 50 46 60 54 70 50 C 80 46 88 54 88 54" fill="none" stroke="#e0f2fe" strokeWidth="3" opacity="0.8" />
        </svg>
      );

    case "chewing_gum":
      return (
        <svg viewBox="0 0 100 100" className={className} width={size} height={size}>
          <path d="M25 45 C32 30 68 30 75 45 C82 52 82 62 75 70 C68 76 32 76 25 70 C18 62 18 52 25 45 Z" fill="#f472b6" stroke="#db2777" strokeWidth="1.5" />
          <circle cx="42" cy="52" r="3.5" fill="#fbcfe8" opacity="0.6" />
          <circle cx="58" cy="58" r="4.5" fill="#fbcfe8" opacity="0.6" />
        </svg>
      );

    /* --- Outlast roster --------------------------------------------- */

    case "paper_bag":
      return (
        <svg viewBox="0 0 100 100" className={className} width={size} height={size}>
          <path d="M40 30 Q40 18 50 18 Q60 18 60 30" fill="none" stroke="#a16207" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M26 30 L74 30 L70 86 L30 86 Z" fill="#d9a441" />
          <path d="M50 30 L74 30 L70 86 L50 86 Z" fill="#c08a32" />
          <path d="M26 30 L74 30 L73 38 L27 38 Z" fill="#8a6224" />
          <line x1="50" y1="38" x2="50" y2="86" stroke="#a16207" strokeWidth="1.5" opacity="0.5" />
        </svg>
      );

    case "glass_bottle":
      return (
        <svg viewBox="0 0 100 100" className={className} width={size} height={size}>
          <path d="M44 14 L56 14 L56 34 Q68 44 68 58 L68 84 Q68 88 64 88 L36 88 Q32 88 32 84 L32 58 Q32 44 44 34 Z" fill="#4d7c52" />
          <path d="M50 14 L56 14 L56 34 Q68 44 68 58 L68 84 Q68 88 64 88 L50 88 Z" fill="#3f6644" />
          <rect x="42" y="12" width="16" height="6" rx="1.5" fill="#b91c1c" />
          <rect x="34" y="60" width="32" height="18" rx="2" fill="#f1f5f9" opacity="0.9" />
          <path d="M39 40 Q37 54 37 82" fill="none" stroke="#a7f3d0" strokeWidth="2.5" opacity="0.5" strokeLinecap="round" />
        </svg>
      );

    case "aluminium_foil":
      return (
        <svg viewBox="0 0 100 100" className={className} width={size} height={size}>
          <path d="M14 46 L26 22 L48 16 L70 20 L88 36 L84 60 L68 80 L44 84 L22 74 L10 60 Z" fill="#cbd5e1" />
          <path d="M26 22 L48 16 L50 44 L30 50 Z" fill="#f1f5f9" />
          <path d="M48 16 L70 20 L74 42 L50 44 Z" fill="#a9b6c6" />
          <path d="M70 20 L88 36 L84 60 L74 42 Z" fill="#e2e8f0" />
          <path d="M14 46 L26 22 L30 50 L22 74 L10 60 Z" fill="#94a3b8" />
          <path d="M30 50 L50 44 L52 70 L28 72 Z" fill="#eef2f6" />
          <path d="M50 44 L74 42 L68 80 L52 70 Z" fill="#b6c2d1" />
          <path d="M22 74 L28 72 L52 70 L44 84 Z" fill="#dbe2ea" />
          <path d="M84 60 L68 80 L74 42 Z" fill="#8fa0b3" opacity="0.65" />
        </svg>
      );

    case "egg_carton":
      return (
        <svg viewBox="0 0 100 100" className={className} width={size} height={size}>
          <path d="M12 52 Q20 30 28 52 Q36 30 44 52 Q52 30 60 52 Q68 30 76 52 L88 52 L88 58 L12 58 Z" fill="#dcd2c0" />
          <path d="M12 58 L88 58 L88 74 Q50 80 12 74 Z" fill="#b3a68e" />
          <path d="M28 52 Q28 38 34 40 Q30 44 32 52 Z" fill="#f2ece0" opacity="0.8" />
          <path d="M44 52 Q44 38 50 40 Q46 44 48 52 Z" fill="#f2ece0" opacity="0.8" />
          <path d="M60 52 Q60 38 66 40 Q62 44 64 52 Z" fill="#f2ece0" opacity="0.8" />
          <rect x="42" y="70" width="16" height="8" rx="2" fill="#9b8f78" />
          <line x1="12" y1="58" x2="88" y2="58" stroke="#8f8371" strokeWidth="2.5" />
        </svg>
      );

    case "orange_peel":
      return (
        <svg viewBox="0 0 100 100" className={className} width={size} height={size}>
          <path
            d="M50 20 A30 30 0 0 1 80 50 A30 30 0 0 1 50 80 A24 24 0 0 1 26 56 A19 19 0 0 1 45 37 A14 14 0 0 1 59 51 A9 9 0 0 1 50 60"
            fill="none" stroke="#fde8d0" strokeWidth="13" strokeLinecap="round"
          />
          <path
            d="M50 20 A30 30 0 0 1 80 50 A30 30 0 0 1 50 80 A24 24 0 0 1 26 56 A19 19 0 0 1 45 37 A14 14 0 0 1 59 51 A9 9 0 0 1 50 60"
            fill="none" stroke="#f97316" strokeWidth="8" strokeLinecap="round"
          />
          <path
            d="M50 20 A30 30 0 0 1 80 50"
            fill="none" stroke="#fdba74" strokeWidth="2.5" strokeLinecap="round" opacity="0.8"
          />
          <circle cx="72" cy="66" r="1.6" fill="#c2410c" opacity="0.5" />
          <circle cx="34" cy="38" r="1.6" fill="#c2410c" opacity="0.5" />
        </svg>
      );

    case "cigarette_butt":
      return (
        <svg viewBox="0 0 100 100" className={className} width={size} height={size}>
          <rect x="18" y="42" width="44" height="18" rx="3" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5" />
          <rect x="58" y="42" width="26" height="18" rx="3" fill="#d9a441" />
          <rect x="58" y="42" width="4" height="18" fill="#b98a2e" />
          <path d="M66 44 L66 58 M72 44 L72 58 M78 44 L78 58" stroke="#b98a2e" strokeWidth="1.5" opacity="0.7" />
          <path d="M18 42 Q12 51 18 60 Z" fill="#334155" />
          <circle cx="22" cy="51" r="2.5" fill="#1e293b" opacity="0.5" />
        </svg>
      );

    case "plastic_bag":
      return (
        <svg viewBox="0 0 100 100" className={className} width={size} height={size}>
          <path d="M34 34 Q34 20 42 20 Q48 20 48 32" fill="none" stroke="#7dd3fc" strokeWidth="3" strokeLinecap="round" />
          <path d="M52 32 Q52 20 58 20 Q66 20 66 34" fill="none" stroke="#7dd3fc" strokeWidth="3" strokeLinecap="round" />
          <path d="M26 34 L74 34 Q80 62 72 86 Q50 92 28 86 Q20 62 26 34 Z" fill="#bae6fd" />
          <path d="M50 34 L74 34 Q80 62 72 86 Q61 89 50 89 Z" fill="#7dd3fc" opacity="0.6" />
          <path d="M34 44 Q38 64 36 82" fill="none" stroke="#e0f2fe" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case "coffee_cup":
      return (
        <svg viewBox="0 0 100 100" className={className} width={size} height={size}>
          <path d="M30 30 L38 84 Q38 88 50 88 Q62 88 62 84 L70 30 Z" fill="#fdfcfa" stroke="#e7e2da" strokeWidth="2" />
          <path d="M28 26 Q50 20 72 26 L71 34 Q50 28 29 34 Z" fill="#78350f" />
          <ellipse cx="50" cy="26" rx="21" ry="4.5" fill="#92400e" />
          <path d="M33 48 L67 48 L64 70 L36 70 Z" fill="#c2884a" />
          <path d="M36 56 Q50 60 64 56" fill="none" stroke="#8a5a26" strokeWidth="2" opacity="0.7" />
        </svg>
      );

    case "plastic_straw":
      return (
        <svg viewBox="0 0 100 100" className={className} width={size} height={size}>
          <path d="M40 22 L54 22 L54 34 L40 34 Z" fill="#ef4444" />
          <path d="M40 34 L54 34 L54 50 L40 50 Z" fill="#fca5a5" />
          <path d="M40 36 H54 M40 40 H54 M40 44 H54 M40 48 H54" stroke="#dc2626" strokeWidth="2.2" />
          <path d="M40 50 L54 50 L60 88 L46 88 Z" fill="#ef4444" />
          <path d="M44 52 L50 86" stroke="#fecaca" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
          <ellipse cx="47" cy="22" rx="7" ry="3" fill="#b91c1c" />
          <ellipse cx="47" cy="22" rx="4.5" ry="1.8" fill="#7f1d1d" />
        </svg>
      );

    case "toothbrush":
      return (
        <svg viewBox="0 0 100 100" className={className} width={size} height={size}>
          <path d="M8 54 L58 45 Q66 44 67 50 Q68 56 60 57 L10 64 Q4 65 3 59 Q2 54 8 54 Z" fill="#2563eb" />
          <path d="M9 59 L60 51 Q68 50 67 50 Q68 56 60 57 L10 64 Q4 65 3 59 Z" fill="#1e40af" opacity="0.55" />
          <rect x="62" y="41" width="30" height="16" rx="6" fill="#e2e8f0" transform="rotate(-7 77 49)" />
          <path d="M66 39 V25 M74 38 V23 M82 37 V22 M89 36 V24" stroke="#f8fafc" strokeWidth="6" strokeLinecap="round" />
          <path d="M66 39 V25 M74 38 V23 M82 37 V22 M89 36 V24" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="12" cy="59" r="3" fill="#1e40af" opacity="0.5" />
        </svg>
      );

    case "cotton_shirt":
      return (
        <svg viewBox="0 0 100 100" className={className} width={size} height={size}>
          <path d="M36 22 L44 20 Q50 27 56 20 L64 22 L84 34 L76 46 L68 42 L68 82 Q50 86 32 82 L32 42 L24 46 L16 34 Z" fill="#60a5fa" />
          <path d="M50 24 L64 22 L84 34 L76 46 L68 42 L68 82 Q59 84 50 84 Z" fill="#3b82f6" />
          <path d="M44 20 Q50 30 56 20" fill="none" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" />
          <path d="M32 70 Q50 74 68 70" fill="none" stroke="#93c5fd" strokeWidth="2" opacity="0.7" />
        </svg>
      );

    case "wool_sock":
      return (
        <svg viewBox="0 0 100 100" className={className} width={size} height={size}>
          <path d="M38 18 L64 18 L64 54 Q64 66 52 72 L32 82 Q22 86 18 78 Q14 70 22 64 L36 54 Q38 50 38 44 Z" fill="#e11d48" />
          <path d="M51 18 L64 18 L64 54 Q64 66 52 72 L36 81 L30 72 L48 62 Q51 58 51 50 Z" fill="#be123c" />
          <rect x="36" y="16" width="30" height="10" rx="3" fill="#fda4af" />
          <path d="M40 30 H62 M40 38 H62" stroke="#fda4af" strokeWidth="2" opacity="0.6" />
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 100 100" className={className} width={size} height={size}>
          <circle cx="50" cy="50" r="40" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="2" />
          <text x="50" y="58" textAnchor="middle" fontSize="24" fill="#475569" fontWeight="bold">?</text>
        </svg>
      );
  }
};
