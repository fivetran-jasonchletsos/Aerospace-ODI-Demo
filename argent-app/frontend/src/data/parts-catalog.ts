// ============================================================
// Argent Aerospace — parts and assemblies catalog.
// 42 representative line-replaceable units, structural
// assemblies, and sub-systems drawn from Argent's commercial,
// defense, and MRO product lines.
//
// Fields used by the Related Parts similarity engine:
//   ata_chapter   — primary ATA chapter code (2-digit string)
//   system_family — top-level system grouping
//   platforms     — fleet platforms this part serves
//   supplier_id   — Argent supplier panel ID
//   failure_modes — observed / potential failure mode signatures
// ============================================================

export type Part = {
  part_no: string;
  description: string;
  ata_chapter: string;        // e.g. "27", "32", "71"
  system_family: string;      // e.g. "flight_controls", "landing_gear", "propulsion"
  platforms: string[];        // e.g. ["narrow_body", "wide_body"]
  supplier_id: string;
  unit_cost_usd: number;
  failure_modes: string[];    // short signature tokens
  segment: 'commercial' | 'defense' | 'mixed';
};

export const PARTS_CATALOG: Part[] = [
  // ── ATA 27 Flight Controls ─────────────────────────────────
  {
    part_no: "ARG-27-1001-A",
    description: "Primary flight control actuator, aileron",
    ata_chapter: "27",
    system_family: "flight_controls",
    platforms: ["narrow_body", "wide_body"],
    supplier_id: "SUP-0011",
    unit_cost_usd: 48_000,
    failure_modes: ["seal_leak", "position_feedback_drift", "motor_overheat"],
    segment: "commercial",
  },
  {
    part_no: "ARG-27-1002-B",
    description: "Fly-by-wire elevator servo actuator",
    ata_chapter: "27",
    system_family: "flight_controls",
    platforms: ["wide_body"],
    supplier_id: "SUP-0011",
    unit_cost_usd: 62_000,
    failure_modes: ["position_feedback_drift", "seal_leak", "thermal_cycling_fatigue"],
    segment: "commercial",
  },
  {
    part_no: "ARG-27-2001-A",
    description: "Spoiler panel drive unit",
    ata_chapter: "27",
    system_family: "flight_controls",
    platforms: ["narrow_body", "wide_body"],
    supplier_id: "SUP-0011",
    unit_cost_usd: 31_000,
    failure_modes: ["gear_wear", "position_feedback_drift", "seal_leak"],
    segment: "commercial",
  },
  {
    part_no: "ARG-27-3001-D",
    description: "High-lift flap track actuator",
    ata_chapter: "27",
    system_family: "flight_controls",
    platforms: ["narrow_body"],
    supplier_id: "SUP-0012",
    unit_cost_usd: 27_500,
    failure_modes: ["gear_wear", "corrosion", "seal_leak"],
    segment: "commercial",
  },

  // ── ATA 32 Landing Gear ────────────────────────────────────
  {
    part_no: "ARG-32-1001-C",
    description: "Main landing gear shock strut assembly",
    ata_chapter: "32",
    system_family: "landing_gear",
    platforms: ["narrow_body", "wide_body"],
    supplier_id: "SUP-0022",
    unit_cost_usd: 155_000,
    failure_modes: ["seal_leak", "corrosion", "structural_fatigue"],
    segment: "commercial",
  },
  {
    part_no: "ARG-32-1002-A",
    description: "Nose gear steering actuator",
    ata_chapter: "32",
    system_family: "landing_gear",
    platforms: ["narrow_body", "wide_body"],
    supplier_id: "SUP-0022",
    unit_cost_usd: 28_000,
    failure_modes: ["seal_leak", "position_feedback_drift", "torque_link_wear"],
    segment: "commercial",
  },
  {
    part_no: "ARG-32-2001-B",
    description: "Carbon brake heat pack assembly",
    ata_chapter: "32",
    system_family: "landing_gear",
    platforms: ["narrow_body", "wide_body", "regional_jet"],
    supplier_id: "SUP-0023",
    unit_cost_usd: 42_000,
    failure_modes: ["friction_material_wear", "thermal_overstress", "disc_cracking"],
    segment: "commercial",
  },
  {
    part_no: "ARG-32-2002-A",
    description: "Brake control unit (BCU)",
    ata_chapter: "32",
    system_family: "landing_gear",
    platforms: ["narrow_body", "wide_body"],
    supplier_id: "SUP-0024",
    unit_cost_usd: 19_500,
    failure_modes: ["firmware_fault", "pressure_valve_stick", "connector_corrosion"],
    segment: "commercial",
  },

  // ── ATA 29 Hydraulics ─────────────────────────────────────
  {
    part_no: "ARG-29-1001-A",
    description: "Engine-driven hydraulic pump, system A",
    ata_chapter: "29",
    system_family: "hydraulics",
    platforms: ["narrow_body", "wide_body"],
    supplier_id: "SUP-0031",
    unit_cost_usd: 38_500,
    failure_modes: ["seal_leak", "bearing_fatigue", "pressure_fluctuation"],
    segment: "commercial",
  },
  {
    part_no: "ARG-29-1002-B",
    description: "Electric motor pump, system B",
    ata_chapter: "29",
    system_family: "hydraulics",
    platforms: ["narrow_body", "wide_body"],
    supplier_id: "SUP-0031",
    unit_cost_usd: 44_000,
    failure_modes: ["motor_overheat", "seal_leak", "pressure_fluctuation"],
    segment: "commercial",
  },
  {
    part_no: "ARG-29-2001-A",
    description: "Hydraulic reservoir with level sensor",
    ata_chapter: "29",
    system_family: "hydraulics",
    platforms: ["narrow_body", "wide_body", "regional_jet"],
    supplier_id: "SUP-0032",
    unit_cost_usd: 8_200,
    failure_modes: ["seal_leak", "sensor_drift", "contamination"],
    segment: "commercial",
  },

  // ── ATA 71 Propulsion ─────────────────────────────────────
  {
    part_no: "ARG-71-1001-A",
    description: "Engine nacelle inlet cowl, titanium",
    ata_chapter: "71",
    system_family: "propulsion",
    platforms: ["narrow_body", "wide_body"],
    supplier_id: "SUP-0041",
    unit_cost_usd: 220_000,
    failure_modes: ["impact_damage", "delamination", "corrosion"],
    segment: "commercial",
  },
  {
    part_no: "ARG-71-2001-B",
    description: "Thrust reverser actuator",
    ata_chapter: "71",
    system_family: "propulsion",
    platforms: ["narrow_body", "wide_body"],
    supplier_id: "SUP-0011",
    unit_cost_usd: 55_000,
    failure_modes: ["seal_leak", "position_feedback_drift", "thermal_cycling_fatigue"],
    segment: "commercial",
  },
  {
    part_no: "ARG-71-3001-A",
    description: "Engine mount assembly, pylon attach",
    ata_chapter: "71",
    system_family: "propulsion",
    platforms: ["wide_body"],
    supplier_id: "SUP-0042",
    unit_cost_usd: 310_000,
    failure_modes: ["structural_fatigue", "corrosion", "bolt_fretting"],
    segment: "commercial",
  },

  // ── ATA 72 Turbine (MRO focus) ────────────────────────────
  {
    part_no: "ARG-72-1001-A",
    description: "High-pressure turbine blade (stage 1)",
    ata_chapter: "72",
    system_family: "propulsion",
    platforms: ["narrow_body", "wide_body"],
    supplier_id: "SUP-0043",
    unit_cost_usd: 18_500,
    failure_modes: ["thermal_cycling_fatigue", "oxidation_coating_spall", "tip_rub"],
    segment: "mixed",
  },
  {
    part_no: "ARG-72-1002-A",
    description: "Combustor liner panel, CMC",
    ata_chapter: "72",
    system_family: "propulsion",
    platforms: ["wide_body"],
    supplier_id: "SUP-0043",
    unit_cost_usd: 24_000,
    failure_modes: ["thermal_cycling_fatigue", "oxidation_coating_spall", "impact_damage"],
    segment: "commercial",
  },

  // ── ATA 34 Navigation ─────────────────────────────────────
  {
    part_no: "ARG-34-1001-A",
    description: "Inertial reference unit (IRU)",
    ata_chapter: "34",
    system_family: "avionics",
    platforms: ["narrow_body", "wide_body", "regional_jet"],
    supplier_id: "SUP-0051",
    unit_cost_usd: 85_000,
    failure_modes: ["firmware_fault", "gyro_drift", "connector_corrosion"],
    segment: "mixed",
  },
  {
    part_no: "ARG-34-2001-B",
    description: "Weather radar transceiver",
    ata_chapter: "34",
    system_family: "avionics",
    platforms: ["narrow_body", "wide_body"],
    supplier_id: "SUP-0052",
    unit_cost_usd: 47_000,
    failure_modes: ["firmware_fault", "waveguide_moisture", "connector_corrosion"],
    segment: "commercial",
  },

  // ── ATA 22 Autopilot ──────────────────────────────────────
  {
    part_no: "ARG-22-1001-A",
    description: "Flight management computer (FMC)",
    ata_chapter: "22",
    system_family: "avionics",
    platforms: ["narrow_body", "wide_body"],
    supplier_id: "SUP-0053",
    unit_cost_usd: 120_000,
    failure_modes: ["firmware_fault", "memory_corruption", "connector_corrosion"],
    segment: "commercial",
  },
  {
    part_no: "ARG-22-2001-A",
    description: "Autopilot servo actuator, pitch",
    ata_chapter: "22",
    system_family: "flight_controls",
    platforms: ["narrow_body", "wide_body"],
    supplier_id: "SUP-0011",
    unit_cost_usd: 33_000,
    failure_modes: ["position_feedback_drift", "gear_wear", "seal_leak"],
    segment: "commercial",
  },

  // ── ATA 24 Electrical Power ───────────────────────────────
  {
    part_no: "ARG-24-1001-A",
    description: "Integrated drive generator (IDG)",
    ata_chapter: "24",
    system_family: "electrical",
    platforms: ["narrow_body", "wide_body"],
    supplier_id: "SUP-0061",
    unit_cost_usd: 95_000,
    failure_modes: ["bearing_fatigue", "oil_contamination", "thermal_overstress"],
    segment: "commercial",
  },
  {
    part_no: "ARG-24-2001-B",
    description: "Battery contactor assembly",
    ata_chapter: "24",
    system_family: "electrical",
    platforms: ["narrow_body", "regional_jet"],
    supplier_id: "SUP-0062",
    unit_cost_usd: 4_800,
    failure_modes: ["contact_erosion", "connector_corrosion", "thermal_overstress"],
    segment: "commercial",
  },

  // ── ATA 36 Pneumatics ─────────────────────────────────────
  {
    part_no: "ARG-36-1001-A",
    description: "Bleed air valve, engine pylon",
    ata_chapter: "36",
    system_family: "pneumatics",
    platforms: ["narrow_body", "wide_body"],
    supplier_id: "SUP-0071",
    unit_cost_usd: 14_000,
    failure_modes: ["seal_leak", "actuator_jam", "thermal_cycling_fatigue"],
    segment: "commercial",
  },
  {
    part_no: "ARG-36-2001-A",
    description: "Precooler heat exchanger",
    ata_chapter: "36",
    system_family: "pneumatics",
    platforms: ["narrow_body", "wide_body"],
    supplier_id: "SUP-0072",
    unit_cost_usd: 22_000,
    failure_modes: ["corrosion", "thermal_cycling_fatigue", "contamination"],
    segment: "commercial",
  },

  // ── ATA 57 Wing Structures ────────────────────────────────
  {
    part_no: "ARG-57-1001-A",
    description: "Wing root forging, Ti-6Al-4V",
    ata_chapter: "57",
    system_family: "structure",
    platforms: ["narrow_body", "wide_body"],
    supplier_id: "SUP-0001",
    unit_cost_usd: 195_000,
    failure_modes: ["structural_fatigue", "corrosion", "bolt_fretting"],
    segment: "commercial",
  },
  {
    part_no: "ARG-57-2001-B",
    description: "Wing skin panel, CFRP co-cure",
    ata_chapter: "57",
    system_family: "structure",
    platforms: ["wide_body"],
    supplier_id: "SUP-0081",
    unit_cost_usd: 280_000,
    failure_modes: ["delamination", "impact_damage", "moisture_ingress"],
    segment: "commercial",
  },
  {
    part_no: "ARG-57-3001-A",
    description: "Spar web aluminum stretch-formed",
    ata_chapter: "57",
    system_family: "structure",
    platforms: ["narrow_body", "regional_jet"],
    supplier_id: "SUP-0082",
    unit_cost_usd: 48_000,
    failure_modes: ["structural_fatigue", "corrosion", "impact_damage"],
    segment: "commercial",
  },

  // ── ATA 53 Fuselage ──────────────────────────────────────
  {
    part_no: "ARG-53-1001-A",
    description: "Pressure bulkhead aft assembly",
    ata_chapter: "53",
    system_family: "structure",
    platforms: ["narrow_body", "wide_body"],
    supplier_id: "SUP-0083",
    unit_cost_usd: 340_000,
    failure_modes: ["structural_fatigue", "corrosion", "fastener_hole_elongation"],
    segment: "commercial",
  },
  {
    part_no: "ARG-53-2001-A",
    description: "Door surround frame, composite",
    ata_chapter: "53",
    system_family: "structure",
    platforms: ["narrow_body", "wide_body"],
    supplier_id: "SUP-0081",
    unit_cost_usd: 115_000,
    failure_modes: ["delamination", "impact_damage", "fastener_hole_elongation"],
    segment: "commercial",
  },

  // ── Defense — ATA 92 Electrical / Avionics (ISR) ─────────
  {
    part_no: "ARG-DF-9201-A",
    description: "ISR sensor pod interface unit",
    ata_chapter: "92",
    system_family: "avionics",
    platforms: ["isr_airframe"],
    supplier_id: "SUP-0091",
    unit_cost_usd: 480_000,
    failure_modes: ["firmware_fault", "connector_corrosion", "thermal_overstress"],
    segment: "defense",
  },
  {
    part_no: "ARG-DF-9202-B",
    description: "Secure data link terminal",
    ata_chapter: "92",
    system_family: "avionics",
    platforms: ["isr_airframe", "tanker_transport"],
    supplier_id: "SUP-0091",
    unit_cost_usd: 310_000,
    failure_modes: ["firmware_fault", "memory_corruption", "connector_corrosion"],
    segment: "defense",
  },
  {
    part_no: "ARG-DF-9203-A",
    description: "Radar transmit-receive module, AESA",
    ata_chapter: "92",
    system_family: "avionics",
    platforms: ["isr_airframe"],
    supplier_id: "SUP-0092",
    unit_cost_usd: 820_000,
    failure_modes: ["thermal_overstress", "firmware_fault", "waveguide_moisture"],
    segment: "defense",
  },

  // ── ATA 35 Oxygen ─────────────────────────────────────────
  {
    part_no: "ARG-35-1001-A",
    description: "Chemical oxygen generator, pax",
    ata_chapter: "35",
    system_family: "cabin_systems",
    platforms: ["narrow_body", "wide_body", "regional_jet"],
    supplier_id: "SUP-0101",
    unit_cost_usd: 620,
    failure_modes: ["expired_service_life", "activation_failure", "contamination"],
    segment: "commercial",
  },
  {
    part_no: "ARG-35-2001-A",
    description: "Crew oxygen regulator valve",
    ata_chapter: "35",
    system_family: "cabin_systems",
    platforms: ["narrow_body", "wide_body"],
    supplier_id: "SUP-0101",
    unit_cost_usd: 3_400,
    failure_modes: ["seal_leak", "regulator_jam", "contamination"],
    segment: "commercial",
  },

  // ── ATA 21 Air Conditioning ───────────────────────────────
  {
    part_no: "ARG-21-1001-A",
    description: "Air cycle machine (ACM) pack",
    ata_chapter: "21",
    system_family: "pneumatics",
    platforms: ["narrow_body", "wide_body"],
    supplier_id: "SUP-0071",
    unit_cost_usd: 72_000,
    failure_modes: ["bearing_fatigue", "seal_leak", "thermal_overstress"],
    segment: "commercial",
  },
  {
    part_no: "ARG-21-2001-A",
    description: "Zone temperature controller",
    ata_chapter: "21",
    system_family: "cabin_systems",
    platforms: ["narrow_body", "wide_body"],
    supplier_id: "SUP-0102",
    unit_cost_usd: 9_800,
    failure_modes: ["firmware_fault", "sensor_drift", "connector_corrosion"],
    segment: "commercial",
  },

  // ── ATA 28 Fuel ──────────────────────────────────────────
  {
    part_no: "ARG-28-1001-A",
    description: "Fuel boost pump assembly",
    ata_chapter: "28",
    system_family: "fuel_system",
    platforms: ["narrow_body", "wide_body"],
    supplier_id: "SUP-0031",
    unit_cost_usd: 12_500,
    failure_modes: ["motor_overheat", "impeller_cavitation", "seal_leak"],
    segment: "commercial",
  },
  {
    part_no: "ARG-28-2001-A",
    description: "Fuel quantity management unit",
    ata_chapter: "28",
    system_family: "fuel_system",
    platforms: ["narrow_body", "wide_body"],
    supplier_id: "SUP-0053",
    unit_cost_usd: 35_000,
    failure_modes: ["firmware_fault", "sensor_drift", "connector_corrosion"],
    segment: "commercial",
  },

  // ── ATA 49 APU ───────────────────────────────────────────
  {
    part_no: "ARG-49-1001-A",
    description: "APU starter-generator",
    ata_chapter: "49",
    system_family: "electrical",
    platforms: ["narrow_body", "wide_body"],
    supplier_id: "SUP-0061",
    unit_cost_usd: 66_000,
    failure_modes: ["bearing_fatigue", "thermal_overstress", "oil_contamination"],
    segment: "commercial",
  },
  {
    part_no: "ARG-49-2001-A",
    description: "APU bleed air shutoff valve",
    ata_chapter: "49",
    system_family: "pneumatics",
    platforms: ["narrow_body", "wide_body"],
    supplier_id: "SUP-0071",
    unit_cost_usd: 8_900,
    failure_modes: ["seal_leak", "actuator_jam", "thermal_cycling_fatigue"],
    segment: "commercial",
  },

  // ── Defense — ATA 45 CMS ─────────────────────────────────
  {
    part_no: "ARG-DF-4501-A",
    description: "Countermeasure dispensing computer",
    ata_chapter: "45",
    system_family: "avionics",
    platforms: ["isr_airframe", "tanker_transport"],
    supplier_id: "SUP-0091",
    unit_cost_usd: 195_000,
    failure_modes: ["firmware_fault", "memory_corruption", "thermal_overstress"],
    segment: "defense",
  },

  // ── MRO consumable / rotable ─────────────────────────────
  {
    part_no: "ARG-MRO-0001",
    description: "Aviation-grade hydraulic fluid (5606H, 55-gal drum)",
    ata_chapter: "29",
    system_family: "hydraulics",
    platforms: ["narrow_body", "wide_body", "regional_jet", "isr_airframe"],
    supplier_id: "SUP-0111",
    unit_cost_usd: 480,
    failure_modes: ["contamination", "moisture_ingress"],
    segment: "mixed",
  },
  {
    part_no: "ARG-MRO-0002",
    description: "Aerospace fastener kit, titanium AN/MS series",
    ata_chapter: "57",
    system_family: "structure",
    platforms: ["narrow_body", "wide_body", "regional_jet"],
    supplier_id: "SUP-0121",
    unit_cost_usd: 2_200,
    failure_modes: ["bolt_fretting", "corrosion", "fastener_hole_elongation"],
    segment: "commercial",
  },
];

// Sorted part number index for O(1) lookup
const _index = new Map<string, Part>(PARTS_CATALOG.map((p) => [p.part_no, p]));
export function partByNo(no: string): Part | undefined {
  return _index.get(no);
}

// Unique system families
export const SYSTEM_FAMILIES = [...new Set(PARTS_CATALOG.map((p) => p.system_family))].sort();

// Human labels for system families
export const SYSTEM_FAMILY_LABEL: Record<string, string> = {
  flight_controls: "Flight Controls",
  landing_gear:    "Landing Gear",
  hydraulics:      "Hydraulics",
  propulsion:      "Propulsion",
  avionics:        "Avionics",
  electrical:      "Electrical Power",
  pneumatics:      "Pneumatics / ECS",
  structure:       "Structures",
  cabin_systems:   "Cabin Systems",
  fuel_system:     "Fuel System",
};

// Human labels for ATA chapters used in this catalog
export const ATA_LABEL: Record<string, string> = {
  "21": "ATA 21 Air Conditioning",
  "22": "ATA 22 Autopilot",
  "24": "ATA 24 Electrical Power",
  "27": "ATA 27 Flight Controls",
  "28": "ATA 28 Fuel",
  "29": "ATA 29 Hydraulics",
  "32": "ATA 32 Landing Gear",
  "34": "ATA 34 Navigation",
  "35": "ATA 35 Oxygen",
  "36": "ATA 36 Pneumatics",
  "45": "ATA 45 CMS",
  "49": "ATA 49 APU",
  "53": "ATA 53 Fuselage",
  "57": "ATA 57 Wings",
  "71": "ATA 71 Propulsion",
  "72": "ATA 72 Turbine",
  "92": "ATA 92 Avionics (Defense)",
};

// Platform labels
export const PLATFORM_LABEL: Record<string, string> = {
  narrow_body:     "Single-aisle narrow-body",
  wide_body:       "Wide-body twin-aisle",
  regional_jet:    "Regional jet",
  isr_airframe:    "ISR airframe",
  tanker_transport:"Tanker / transport",
};
