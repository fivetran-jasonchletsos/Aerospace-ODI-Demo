# Aerospace-ODI-Demo · Argent Aerospace

End-to-end demonstration of **Fivetran's Open Data Infrastructure (ODI)** in
an aerospace and defense setting. Argent Aerospace is a fictional Tier-1 prime
contractor. $24B annual revenue, 62,000 employees, 14 manufacturing and MRO sites,
roughly 3,400 in-service aircraft serviced. Commercial-OEM components, defense
systems (radar / ISR / air-defense) and after-market MRO services.

Audience: a Chief Operations Officer and a Chief Supply Chain Officer who want
one operating picture across SAP, Teamcenter, Apriso, Maximo, Costpoint, Ariba
and OEM customer-portal feeds — without breaking the FAR/DFARS authority
boundary between commercial and CUI defense data.

## Quick demo

No API keys, no AWS, no Fivetran. The snapshot JSONs are pre-built and
checked in under `argent-app/frontend/public/data/`.

```bash
cd argent-app/frontend
npm ci
npm run dev    # http://localhost:5173
```

## Architecture (illustrative)

```
   ┌────────────────────────────────────────────────────────────┐
   │  Seven source systems                                       │
   │  SAP S/4HANA · Teamcenter · Apriso MES · Maximo · Costpoint │
   │  SAP Ariba · OEM customer portals (Boeing/Airbus/Lockheed)  │
   └────────────────────────────┬───────────────────────────────┘
                                │  Fivetran connectors
                                │  CUI feeds → AWS GovCloud
                                │  Commercial feeds → AWS public
                                ▼
   ┌────────────────────────────────────────────────────────────┐
   │  Snowflake-managed Iceberg + raw Iceberg on S3              │
   │  Glue + Snowflake Horizon catalogs                          │
   │  data_handling tag enforced at the catalog layer            │
   └────────────────────────────┬───────────────────────────────┘
                                │  dbt — bronze → silver → gold
                                │  AS9100-aligned data quality tests
                                ▼
   ┌────────────────────────────────────────────────────────────┐
   │  Operations gold marts                                      │
   │    fct_site_production · fct_mro_workpackage                │
   │    fct_supplier_risk · fct_quality_metric                   │
   │    dim_program · fct_defense_program_health (CUI)           │
   └────────────────────────────┬───────────────────────────────┘
                                ▼
   ┌────────────────────────────────────────────────────────────┐
   │  React + Vite SPA on GitHub Pages                           │
   │  Operations · Programs · MRO · Supply Chain ·               │
   │  ODI Architecture · Pipeline · Policy Brief                 │
   └────────────────────────────────────────────────────────────┘
```

## Pages

- `/` — KPI tiles, global site map, top three operating issues this week
- `/programs` — 15 active programs across commercial and defense, plus the defense bid pipeline
- `/mro` — 11 bays, work packages, turnaround trend by airframe, top 10 fleet inductions due
- `/supply-chain` — Top 200 suppliers, composite risk, shortage alerts, tariff exposure
- `/architecture` — Source systems, lineage, Iceberg catalog, FAR/DFARS authority boundary
- `/pipeline` — Connector status, dbt layer counts, failure simulator
- `/policy` — Why aerospace + defense data is fragmented, and how ODI bridges it
- `/about` — Canonical ODI Story, source systems and tech-stack reference

## Compliance posture (in-scope for the demo)

- FAR 52.204-21 — Basic safeguarding of contractor information
- DFARS 252.204-7012 / 7019 / 7020 / 7021 — CUI safeguarding + DoD assessment + CMMC
- CMMC Level 2 (defense estate)
- ITAR 22 CFR 120-130 — US-person attestation at the catalog layer
- DCAA segregation of program cost via Deltek Costpoint
- AS9100D quality system; FAA Part 145 for MRO sites

All data shown is synthetic. Argent Aerospace is a fictional contractor invented
for this demonstration. No real DoD, Boeing, Airbus or Lockheed proprietary or
classified data is used.
