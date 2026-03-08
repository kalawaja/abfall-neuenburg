import { useState, useMemo, useEffect } from "react";

// ─── DATENBANK ────────────────────────────────────────────────────────────────
const DB = {
  waste_types: [
    { id: 1, name: "Restmüll",              color: "#6B7280", bg: "#F4F4F5", emoji: "🗑️", hint: "Nicht recycelbare Abfälle" },
    { id: 2, name: "Biotonne",              color: "#92400E", bg: "#FDF3EB", emoji: "🌿", hint: "Küchen- und Gartenabfälle" },
    { id: 3, name: "Gelbe Tonne",           color: "#CA8A04", bg: "#FEFCE8", emoji: "♻️", hint: "Verpackungen aus Kunststoff & Metall" },
    { id: 4, name: "Papiertonne",           color: "#1D4ED8", bg: "#EFF6FF", emoji: "📄", hint: "Papier, Pappe, Karton" },
    { id: 8, name: "Papier Vereinssamml.",  color: "#0891B2", bg: "#ECFEFF", emoji: "📰", hint: "Vereinssammlung – Bündel an die Straße" },
    { id: 6, name: "Weihnachtsbäume",       color: "#16A34A", bg: "#F0FDF4", emoji: "🎄", hint: "Weihnachtsbaumsammlung im Januar" },
    { id: 7, name: "Schadstoffsammlung",    color: "#DC2626", bg: "#FEF2F2", emoji: "☣️", hint: "Farben, Batterien, Chemikalien" },
  ],
  zones: [
    { id: 1, code: "S",  name: "Stadt",        subtitle: "Neuenburg Kernstadt" },
    { id: 2, code: "G",  name: "Grißheim",     subtitle: "Ortsteil Grißheim" },
    { id: 3, code: "St", name: "Steinenstadt", subtitle: "Ortsteil Steinenstadt" },
    { id: 4, code: "Z",  name: "Zienken",      subtitle: "Ortsteil Zienken" },
  ],
  // 390 Einträge – direkt aus ICS-Dateien (2026, alle 4 Zonen, Vereinssammlung = type 8)
  collections: [
    { date: "2026-01-05", type: 2, zone: 1 },
    { date: "2026-01-05", type: 3, zone: 1 },
    { date: "2026-01-07", type: 2, zone: 2 },
    { date: "2026-01-07", type: 3, zone: 2 },
    { date: "2026-01-07", type: 2, zone: 3 },
    { date: "2026-01-07", type: 3, zone: 3 },
    { date: "2026-01-07", type: 2, zone: 4 },
    { date: "2026-01-07", type: 3, zone: 4 },
    { date: "2026-01-10", type: 6, zone: 1 },
    { date: "2026-01-10", type: 6, zone: 2 },
    { date: "2026-01-10", type: 6, zone: 3 },
    { date: "2026-01-10", type: 6, zone: 4 },
    { date: "2026-01-12", type: 1, zone: 1 },
    { date: "2026-01-12", type: 1, zone: 2 },
    { date: "2026-01-12", type: 1, zone: 3 },
    { date: "2026-01-12", type: 1, zone: 4 },
    { date: "2026-01-19", type: 2, zone: 1 },
    { date: "2026-01-19", type: 4, zone: 1 },
    { date: "2026-01-20", type: 2, zone: 2 },
    { date: "2026-01-20", type: 4, zone: 2 },
    { date: "2026-01-20", type: 2, zone: 3 },
    { date: "2026-01-20", type: 4, zone: 3 },
    { date: "2026-01-20", type: 2, zone: 4 },
    { date: "2026-01-20", type: 4, zone: 4 },
    { date: "2026-01-26", type: 1, zone: 1 },
    { date: "2026-01-26", type: 3, zone: 1 },
    { date: "2026-01-26", type: 1, zone: 2 },
    { date: "2026-01-26", type: 1, zone: 3 },
    { date: "2026-01-26", type: 1, zone: 4 },
    { date: "2026-01-27", type: 3, zone: 2 },
    { date: "2026-01-27", type: 3, zone: 3 },
    { date: "2026-01-27", type: 3, zone: 4 },
    { date: "2026-01-31", type: 7, zone: 1 },
    { date: "2026-01-31", type: 7, zone: 2 },
    { date: "2026-01-31", type: 7, zone: 3 },
    { date: "2026-01-31", type: 7, zone: 4 },
    { date: "2026-02-02", type: 2, zone: 1 },
    { date: "2026-02-03", type: 2, zone: 2 },
    { date: "2026-02-03", type: 2, zone: 3 },
    { date: "2026-02-03", type: 2, zone: 4 },
    { date: "2026-02-09", type: 1, zone: 1 },
    { date: "2026-02-09", type: 1, zone: 2 },
    { date: "2026-02-09", type: 1, zone: 3 },
    { date: "2026-02-09", type: 1, zone: 4 },
    { date: "2026-02-17", type: 2, zone: 1 },
    { date: "2026-02-17", type: 3, zone: 1 },
    { date: "2026-02-17", type: 4, zone: 1 },
    { date: "2026-02-18", type: 2, zone: 2 },
    { date: "2026-02-18", type: 3, zone: 2 },
    { date: "2026-02-18", type: 4, zone: 2 },
    { date: "2026-02-18", type: 2, zone: 3 },
    { date: "2026-02-18", type: 3, zone: 3 },
    { date: "2026-02-18", type: 4, zone: 3 },
    { date: "2026-02-18", type: 2, zone: 4 },
    { date: "2026-02-18", type: 3, zone: 4 },
    { date: "2026-02-18", type: 4, zone: 4 },
    { date: "2026-02-23", type: 1, zone: 1 },
    { date: "2026-02-23", type: 1, zone: 2 },
    { date: "2026-02-23", type: 1, zone: 3 },
    { date: "2026-02-23", type: 1, zone: 4 },
    { date: "2026-02-28", type: 8, zone: 2 },
    { date: "2026-03-02", type: 2, zone: 1 },
    { date: "2026-03-03", type: 2, zone: 2 },
    { date: "2026-03-03", type: 2, zone: 3 },
    { date: "2026-03-03", type: 2, zone: 4 },
    { date: "2026-03-09", type: 1, zone: 1 },
    { date: "2026-03-09", type: 3, zone: 1 },
    { date: "2026-03-09", type: 1, zone: 2 },
    { date: "2026-03-09", type: 1, zone: 3 },
    { date: "2026-03-09", type: 1, zone: 4 },
    { date: "2026-03-10", type: 7, zone: 1 },
    { date: "2026-03-10", type: 3, zone: 2 },
    { date: "2026-03-10", type: 7, zone: 2 },
    { date: "2026-03-10", type: 3, zone: 3 },
    { date: "2026-03-10", type: 7, zone: 3 },
    { date: "2026-03-10", type: 3, zone: 4 },
    { date: "2026-03-10", type: 7, zone: 4 },
    { date: "2026-03-16", type: 2, zone: 1 },
    { date: "2026-03-16", type: 4, zone: 1 },
    { date: "2026-03-17", type: 2, zone: 2 },
    { date: "2026-03-17", type: 4, zone: 2 },
    { date: "2026-03-17", type: 2, zone: 3 },
    { date: "2026-03-17", type: 4, zone: 3 },
    { date: "2026-03-17", type: 2, zone: 4 },
    { date: "2026-03-17", type: 4, zone: 4 },
    { date: "2026-03-23", type: 1, zone: 1 },
    { date: "2026-03-23", type: 1, zone: 2 },
    { date: "2026-03-23", type: 1, zone: 3 },
    { date: "2026-03-23", type: 1, zone: 4 },
    { date: "2026-03-30", type: 2, zone: 1 },
    { date: "2026-03-30", type: 3, zone: 1 },
    { date: "2026-03-31", type: 2, zone: 2 },
    { date: "2026-03-31", type: 3, zone: 2 },
    { date: "2026-03-31", type: 2, zone: 3 },
    { date: "2026-03-31", type: 3, zone: 3 },
    { date: "2026-03-31", type: 2, zone: 4 },
    { date: "2026-03-31", type: 3, zone: 4 },
    { date: "2026-04-07", type: 1, zone: 1 },
    { date: "2026-04-07", type: 1, zone: 2 },
    { date: "2026-04-07", type: 1, zone: 3 },
    { date: "2026-04-07", type: 1, zone: 4 },
    { date: "2026-04-13", type: 2, zone: 1 },
    { date: "2026-04-13", type: 4, zone: 1 },
    { date: "2026-04-14", type: 2, zone: 2 },
    { date: "2026-04-14", type: 4, zone: 2 },
    { date: "2026-04-14", type: 2, zone: 3 },
    { date: "2026-04-14", type: 4, zone: 3 },
    { date: "2026-04-14", type: 2, zone: 4 },
    { date: "2026-04-14", type: 4, zone: 4 },
    { date: "2026-04-20", type: 1, zone: 1 },
    { date: "2026-04-20", type: 3, zone: 1 },
    { date: "2026-04-20", type: 1, zone: 2 },
    { date: "2026-04-20", type: 1, zone: 3 },
    { date: "2026-04-20", type: 1, zone: 4 },
    { date: "2026-04-21", type: 3, zone: 2 },
    { date: "2026-04-21", type: 3, zone: 3 },
    { date: "2026-04-21", type: 3, zone: 4 },
    { date: "2026-04-25", type: 8, zone: 1 },
    { date: "2026-04-27", type: 2, zone: 1 },
    { date: "2026-04-28", type: 2, zone: 2 },
    { date: "2026-04-28", type: 2, zone: 3 },
    { date: "2026-04-28", type: 2, zone: 4 },
    { date: "2026-05-04", type: 1, zone: 1 },
    { date: "2026-05-04", type: 1, zone: 2 },
    { date: "2026-05-04", type: 1, zone: 3 },
    { date: "2026-05-04", type: 1, zone: 4 },
    { date: "2026-05-09", type: 8, zone: 2 },
    { date: "2026-05-11", type: 2, zone: 1 },
    { date: "2026-05-11", type: 3, zone: 1 },
    { date: "2026-05-11", type: 4, zone: 1 },
    { date: "2026-05-12", type: 2, zone: 2 },
    { date: "2026-05-12", type: 3, zone: 2 },
    { date: "2026-05-12", type: 4, zone: 2 },
    { date: "2026-05-12", type: 2, zone: 3 },
    { date: "2026-05-12", type: 3, zone: 3 },
    { date: "2026-05-12", type: 4, zone: 3 },
    { date: "2026-05-12", type: 2, zone: 4 },
    { date: "2026-05-12", type: 3, zone: 4 },
    { date: "2026-05-12", type: 4, zone: 4 },
    { date: "2026-05-18", type: 1, zone: 1 },
    { date: "2026-05-18", type: 1, zone: 2 },
    { date: "2026-05-18", type: 1, zone: 3 },
    { date: "2026-05-18", type: 1, zone: 4 },
    { date: "2026-05-26", type: 2, zone: 1 },
    { date: "2026-05-27", type: 2, zone: 2 },
    { date: "2026-05-27", type: 2, zone: 3 },
    { date: "2026-05-27", type: 2, zone: 4 },
    { date: "2026-06-01", type: 1, zone: 1 },
    { date: "2026-06-01", type: 3, zone: 1 },
    { date: "2026-06-01", type: 1, zone: 2 },
    { date: "2026-06-01", type: 1, zone: 3 },
    { date: "2026-06-01", type: 1, zone: 4 },
    { date: "2026-06-02", type: 3, zone: 2 },
    { date: "2026-06-02", type: 3, zone: 3 },
    { date: "2026-06-02", type: 3, zone: 4 },
    { date: "2026-06-08", type: 2, zone: 1 },
    { date: "2026-06-08", type: 4, zone: 1 },
    { date: "2026-06-09", type: 2, zone: 2 },
    { date: "2026-06-09", type: 4, zone: 2 },
    { date: "2026-06-09", type: 2, zone: 3 },
    { date: "2026-06-09", type: 4, zone: 3 },
    { date: "2026-06-09", type: 2, zone: 4 },
    { date: "2026-06-09", type: 4, zone: 4 },
    { date: "2026-06-15", type: 1, zone: 1 },
    { date: "2026-06-15", type: 2, zone: 1 },
    { date: "2026-06-15", type: 1, zone: 2 },
    { date: "2026-06-15", type: 1, zone: 3 },
    { date: "2026-06-15", type: 1, zone: 4 },
    { date: "2026-06-16", type: 2, zone: 2 },
    { date: "2026-06-16", type: 2, zone: 3 },
    { date: "2026-06-16", type: 2, zone: 4 },
    { date: "2026-06-22", type: 2, zone: 1 },
    { date: "2026-06-22", type: 3, zone: 1 },
    { date: "2026-06-23", type: 2, zone: 2 },
    { date: "2026-06-23", type: 3, zone: 2 },
    { date: "2026-06-23", type: 2, zone: 3 },
    { date: "2026-06-23", type: 3, zone: 3 },
    { date: "2026-06-23", type: 2, zone: 4 },
    { date: "2026-06-23", type: 3, zone: 4 },
    { date: "2026-06-29", type: 1, zone: 1 },
    { date: "2026-06-29", type: 2, zone: 1 },
    { date: "2026-06-29", type: 1, zone: 2 },
    { date: "2026-06-29", type: 1, zone: 3 },
    { date: "2026-06-29", type: 1, zone: 4 },
    { date: "2026-06-30", type: 2, zone: 2 },
    { date: "2026-06-30", type: 2, zone: 3 },
    { date: "2026-06-30", type: 2, zone: 4 },
    { date: "2026-07-06", type: 2, zone: 1 },
    { date: "2026-07-06", type: 4, zone: 1 },
    { date: "2026-07-07", type: 2, zone: 2 },
    { date: "2026-07-07", type: 4, zone: 2 },
    { date: "2026-07-07", type: 2, zone: 3 },
    { date: "2026-07-07", type: 4, zone: 3 },
    { date: "2026-07-07", type: 2, zone: 4 },
    { date: "2026-07-07", type: 4, zone: 4 },
    { date: "2026-07-13", type: 1, zone: 1 },
    { date: "2026-07-13", type: 2, zone: 1 },
    { date: "2026-07-13", type: 3, zone: 1 },
    { date: "2026-07-13", type: 1, zone: 2 },
    { date: "2026-07-13", type: 1, zone: 3 },
    { date: "2026-07-13", type: 1, zone: 4 },
    { date: "2026-07-14", type: 2, zone: 2 },
    { date: "2026-07-14", type: 3, zone: 2 },
    { date: "2026-07-14", type: 2, zone: 3 },
    { date: "2026-07-14", type: 3, zone: 3 },
    { date: "2026-07-14", type: 2, zone: 4 },
    { date: "2026-07-14", type: 3, zone: 4 },
    { date: "2026-07-18", type: 7, zone: 1 },
    { date: "2026-07-18", type: 7, zone: 2 },
    { date: "2026-07-18", type: 7, zone: 3 },
    { date: "2026-07-18", type: 7, zone: 4 },
    { date: "2026-07-20", type: 2, zone: 1 },
    { date: "2026-07-21", type: 2, zone: 2 },
    { date: "2026-07-21", type: 2, zone: 3 },
    { date: "2026-07-21", type: 2, zone: 4 },
    { date: "2026-07-27", type: 1, zone: 1 },
    { date: "2026-07-27", type: 2, zone: 1 },
    { date: "2026-07-27", type: 1, zone: 2 },
    { date: "2026-07-27", type: 1, zone: 3 },
    { date: "2026-07-27", type: 1, zone: 4 },
    { date: "2026-07-28", type: 2, zone: 2 },
    { date: "2026-07-28", type: 2, zone: 3 },
    { date: "2026-07-28", type: 2, zone: 4 },
    { date: "2026-08-03", type: 2, zone: 1 },
    { date: "2026-08-03", type: 3, zone: 1 },
    { date: "2026-08-03", type: 4, zone: 1 },
    { date: "2026-08-04", type: 2, zone: 2 },
    { date: "2026-08-04", type: 3, zone: 2 },
    { date: "2026-08-04", type: 4, zone: 2 },
    { date: "2026-08-04", type: 2, zone: 3 },
    { date: "2026-08-04", type: 3, zone: 3 },
    { date: "2026-08-04", type: 4, zone: 3 },
    { date: "2026-08-04", type: 2, zone: 4 },
    { date: "2026-08-04", type: 3, zone: 4 },
    { date: "2026-08-04", type: 4, zone: 4 },
    { date: "2026-08-10", type: 1, zone: 1 },
    { date: "2026-08-10", type: 2, zone: 1 },
    { date: "2026-08-10", type: 1, zone: 2 },
    { date: "2026-08-10", type: 1, zone: 3 },
    { date: "2026-08-10", type: 1, zone: 4 },
    { date: "2026-08-11", type: 2, zone: 2 },
    { date: "2026-08-11", type: 2, zone: 3 },
    { date: "2026-08-11", type: 2, zone: 4 },
    { date: "2026-08-17", type: 2, zone: 1 },
    { date: "2026-08-18", type: 2, zone: 2 },
    { date: "2026-08-18", type: 2, zone: 3 },
    { date: "2026-08-18", type: 2, zone: 4 },
    { date: "2026-08-24", type: 1, zone: 1 },
    { date: "2026-08-24", type: 2, zone: 1 },
    { date: "2026-08-24", type: 3, zone: 1 },
    { date: "2026-08-24", type: 1, zone: 2 },
    { date: "2026-08-24", type: 1, zone: 3 },
    { date: "2026-08-24", type: 1, zone: 4 },
    { date: "2026-08-25", type: 2, zone: 2 },
    { date: "2026-08-25", type: 3, zone: 2 },
    { date: "2026-08-25", type: 2, zone: 3 },
    { date: "2026-08-25", type: 3, zone: 3 },
    { date: "2026-08-25", type: 2, zone: 4 },
    { date: "2026-08-25", type: 3, zone: 4 },
    { date: "2026-08-31", type: 2, zone: 1 },
    { date: "2026-08-31", type: 4, zone: 1 },
    { date: "2026-09-01", type: 2, zone: 2 },
    { date: "2026-09-01", type: 4, zone: 2 },
    { date: "2026-09-01", type: 2, zone: 3 },
    { date: "2026-09-01", type: 4, zone: 3 },
    { date: "2026-09-01", type: 2, zone: 4 },
    { date: "2026-09-01", type: 4, zone: 4 },
    { date: "2026-09-07", type: 1, zone: 1 },
    { date: "2026-09-07", type: 2, zone: 1 },
    { date: "2026-09-07", type: 1, zone: 2 },
    { date: "2026-09-07", type: 1, zone: 3 },
    { date: "2026-09-07", type: 1, zone: 4 },
    { date: "2026-09-08", type: 2, zone: 2 },
    { date: "2026-09-08", type: 2, zone: 3 },
    { date: "2026-09-08", type: 2, zone: 4 },
    { date: "2026-09-14", type: 2, zone: 1 },
    { date: "2026-09-14", type: 3, zone: 1 },
    { date: "2026-09-15", type: 2, zone: 2 },
    { date: "2026-09-15", type: 3, zone: 2 },
    { date: "2026-09-15", type: 2, zone: 3 },
    { date: "2026-09-15", type: 3, zone: 3 },
    { date: "2026-09-15", type: 2, zone: 4 },
    { date: "2026-09-15", type: 3, zone: 4 },
    { date: "2026-09-21", type: 1, zone: 1 },
    { date: "2026-09-21", type: 2, zone: 1 },
    { date: "2026-09-21", type: 1, zone: 2 },
    { date: "2026-09-21", type: 1, zone: 3 },
    { date: "2026-09-21", type: 1, zone: 4 },
    { date: "2026-09-22", type: 2, zone: 2 },
    { date: "2026-09-22", type: 2, zone: 3 },
    { date: "2026-09-22", type: 2, zone: 4 },
    { date: "2026-09-26", type: 8, zone: 2 },
    { date: "2026-09-28", type: 2, zone: 1 },
    { date: "2026-09-28", type: 4, zone: 1 },
    { date: "2026-09-29", type: 2, zone: 2 },
    { date: "2026-09-29", type: 4, zone: 2 },
    { date: "2026-09-29", type: 2, zone: 3 },
    { date: "2026-09-29", type: 4, zone: 3 },
    { date: "2026-09-29", type: 2, zone: 4 },
    { date: "2026-09-29", type: 4, zone: 4 },
    { date: "2026-10-05", type: 1, zone: 1 },
    { date: "2026-10-05", type: 3, zone: 1 },
    { date: "2026-10-05", type: 1, zone: 2 },
    { date: "2026-10-05", type: 1, zone: 3 },
    { date: "2026-10-05", type: 1, zone: 4 },
    { date: "2026-10-06", type: 3, zone: 2 },
    { date: "2026-10-06", type: 3, zone: 3 },
    { date: "2026-10-06", type: 3, zone: 4 },
    { date: "2026-10-10", type: 8, zone: 1 },
    { date: "2026-10-12", type: 2, zone: 1 },
    { date: "2026-10-13", type: 2, zone: 2 },
    { date: "2026-10-13", type: 2, zone: 3 },
    { date: "2026-10-13", type: 2, zone: 4 },
    { date: "2026-10-19", type: 1, zone: 1 },
    { date: "2026-10-19", type: 1, zone: 2 },
    { date: "2026-10-19", type: 1, zone: 3 },
    { date: "2026-10-19", type: 1, zone: 4 },
    { date: "2026-10-26", type: 2, zone: 1 },
    { date: "2026-10-26", type: 3, zone: 1 },
    { date: "2026-10-26", type: 4, zone: 1 },
    { date: "2026-10-27", type: 2, zone: 2 },
    { date: "2026-10-27", type: 3, zone: 2 },
    { date: "2026-10-27", type: 4, zone: 2 },
    { date: "2026-10-27", type: 2, zone: 3 },
    { date: "2026-10-27", type: 3, zone: 3 },
    { date: "2026-10-27", type: 4, zone: 3 },
    { date: "2026-10-27", type: 2, zone: 4 },
    { date: "2026-10-27", type: 3, zone: 4 },
    { date: "2026-10-27", type: 4, zone: 4 },
    { date: "2026-11-02", type: 1, zone: 1 },
    { date: "2026-11-02", type: 1, zone: 2 },
    { date: "2026-11-02", type: 1, zone: 3 },
    { date: "2026-11-02", type: 1, zone: 4 },
    { date: "2026-11-04", type: 7, zone: 1 },
    { date: "2026-11-04", type: 7, zone: 2 },
    { date: "2026-11-04", type: 7, zone: 3 },
    { date: "2026-11-04", type: 7, zone: 4 },
    { date: "2026-11-09", type: 2, zone: 1 },
    { date: "2026-11-10", type: 2, zone: 2 },
    { date: "2026-11-10", type: 2, zone: 3 },
    { date: "2026-11-10", type: 2, zone: 4 },
    { date: "2026-11-16", type: 1, zone: 1 },
    { date: "2026-11-16", type: 3, zone: 1 },
    { date: "2026-11-16", type: 1, zone: 2 },
    { date: "2026-11-16", type: 1, zone: 3 },
    { date: "2026-11-16", type: 1, zone: 4 },
    { date: "2026-11-17", type: 3, zone: 2 },
    { date: "2026-11-17", type: 3, zone: 3 },
    { date: "2026-11-17", type: 3, zone: 4 },
    { date: "2026-11-23", type: 2, zone: 1 },
    { date: "2026-11-23", type: 4, zone: 1 },
    { date: "2026-11-24", type: 2, zone: 2 },
    { date: "2026-11-24", type: 4, zone: 2 },
    { date: "2026-11-24", type: 2, zone: 3 },
    { date: "2026-11-24", type: 4, zone: 3 },
    { date: "2026-11-24", type: 2, zone: 4 },
    { date: "2026-11-24", type: 4, zone: 4 },
    { date: "2026-11-30", type: 1, zone: 1 },
    { date: "2026-11-30", type: 1, zone: 2 },
    { date: "2026-11-30", type: 1, zone: 3 },
    { date: "2026-11-30", type: 1, zone: 4 },
    { date: "2026-12-07", type: 2, zone: 1 },
    { date: "2026-12-07", type: 3, zone: 1 },
    { date: "2026-12-08", type: 2, zone: 2 },
    { date: "2026-12-08", type: 3, zone: 2 },
    { date: "2026-12-08", type: 2, zone: 3 },
    { date: "2026-12-08", type: 3, zone: 3 },
    { date: "2026-12-08", type: 2, zone: 4 },
    { date: "2026-12-08", type: 3, zone: 4 },
    { date: "2026-12-12", type: 8, zone: 2 },
    { date: "2026-12-14", type: 1, zone: 1 },
    { date: "2026-12-14", type: 1, zone: 2 },
    { date: "2026-12-14", type: 1, zone: 3 },
    { date: "2026-12-14", type: 1, zone: 4 },
    { date: "2026-12-19", type: 2, zone: 1 },
    { date: "2026-12-19", type: 4, zone: 1 },
    { date: "2026-12-21", type: 2, zone: 2 },
    { date: "2026-12-21", type: 4, zone: 2 },
    { date: "2026-12-21", type: 2, zone: 3 },
    { date: "2026-12-21", type: 4, zone: 3 },
    { date: "2026-12-21", type: 2, zone: 4 },
    { date: "2026-12-21", type: 4, zone: 4 },
    { date: "2026-12-28", type: 1, zone: 1 },
    { date: "2026-12-28", type: 3, zone: 1 },
    { date: "2026-12-28", type: 1, zone: 2 },
    { date: "2026-12-28", type: 1, zone: 3 },
    { date: "2026-12-28", type: 1, zone: 4 },
    { date: "2026-12-29", type: 3, zone: 2 },
    { date: "2026-12-29", type: 3, zone: 3 },
    { date: "2026-12-29", type: 3, zone: 4 },
  ],
  guide: [
    { item: "Joghurtbecher",      type: 3, tip: "Ausspülen nicht nötig, aber empfohlen" },
    { item: "Konservendosen",     type: 3, tip: "Leere Dosen, leicht gespült" },
    { item: "Getränkekartons",    type: 3, tip: "Tetrapaks und Milchkartons" },
    { item: "Milchbeutel",        type: 3, tip: "Kunststoffverpackung" },
    { item: "Shampooflaschen",    type: 3, tip: "Kunststoff-Verpackungen" },
    { item: "Spraydosen",         type: 3, tip: "Leere Spraydosen (nicht gefährlich)" },
    { item: "Styroporverpackung", type: 3, tip: "Nur Verpackungsstyropor" },
    { item: "Alufolie",           type: 3, tip: "Zusammenknüllen für besseres Recycling" },
    { item: "Bananenschale",      type: 2, tip: "Alle Obst- und Gemüseabfälle" },
    { item: "Kaffeesatz",         type: 2, tip: "Mit Papierfilter in die Biotonne" },
    { item: "Essensreste",        type: 2, tip: "Gut einpacken, keine Flüssigkeiten" },
    { item: "Kaffeefilter",       type: 2, tip: "Mit Inhalt in die Biotonne" },
    { item: "Gartenabfälle",      type: 2, tip: "Rasenschnitt, Laub, Zweige" },
    { item: "Teebeutel",          type: 2, tip: "Ohne Metallklammer" },
    { item: "Zeitung",            type: 4, tip: "Zeitungen und Zeitschriften bündeln" },
    { item: "Kartons",            type: 4, tip: "Zusammenfalten und klein machen" },
    { item: "Pappe",              type: 4, tip: "Nicht nass oder fettig" },
    { item: "Bücher",             type: 4, tip: "Ohne Plastikeinband" },
    { item: "Windeln",            type: 1, tip: "Hygieneartikel in den Restmüll" },
    { item: "Keramik",            type: 1, tip: "Nicht ins Altglas!" },
    { item: "Zigarettenkippen",   type: 1, tip: "Ausgedrückt in den Restmüll" },
    { item: "Katzenstreu",        type: 1, tip: "In Plastikbeutel verpackt" },
    { item: "Glühbirnen",         type: 1, tip: "Nicht ins Altglas!" },
    { item: "Spiegel",            type: 1, tip: "Kein Altglas – Restmüll!" },
    { item: "Medikamente",        type: 7, tip: "Schadstoffmobil oder Apotheke" },
    { item: "Batterien",          type: 7, tip: "Sammelbox im Supermarkt" },
    { item: "Farbreste",          type: 7, tip: "Schadstoffmobil – nicht ausgießen!" },
    { item: "Energiesparlampe",   type: 7, tip: "Schadstoffmobil oder RAZ Breisgau" },
    { item: "Sperrige Möbel",      type: 6, tip: "Sperrmüll online anmelden unter breisgau-hochschwarzwald.de/sperrmuell" },
    { item: "Zeitungen (Bündel)", type: 8, tip: "Gebündelt an die Straße legen – Vereinssammlung" },
    { item: "Kartonagen (Bündel)",type: 8, tip: "Flach zusammengelegt und gebündelt – Vereinssammlung" },
  ],
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const getType = (id) => DB.waste_types.find(t => t.id === id);
const getZone = (id) => DB.zones.find(z => z.id === id);

// Echtes heutiges Datum
const TODAY = (() => { const d = new Date(); d.setHours(0,0,0,0); return d; })();

function parseDate(s) {
  const d = new Date(s + "T00:00:00"); d.setHours(0,0,0,0); return d;
}
function daysFrom(d) { return Math.round((d - TODAY) / 86400000); }
function dayLabel(diff) {
  if (diff === 0) return "Heute";
  if (diff === 1) return "Morgen";
  if (diff === 2) return "Übermorgen";
  if (diff > 0)  return `In ${diff} Tagen`;
  return `Vor ${Math.abs(diff)} Tagen`;
}
function fmtLong(d) { return d.toLocaleDateString("de-DE", { weekday:"long", day:"numeric", month:"long" }); }
function fmtShort(d) { return d.toLocaleDateString("de-DE", { day:"numeric", month:"short" }); }

function checkWasteReminder(zoneId) {
  const tmr = new Date(TODAY); tmr.setDate(tmr.getDate() + 1);
  const tStr = tmr.toISOString().split("T")[0];
  return DB.collections
    .filter(c => c.date === tStr && c.zone === zoneId)
    .map(c => `Morgen wird die ${getType(c.type)?.name} abgeholt. Bitte bis 06:00 Uhr bereitstellen!`);
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab]     = useState("home");
  const [zone, setZone]   = useState(1);
  const [dark, setDark]   = useState(true);
  const [notifOn, setNotifOn]     = useState(true);
  const [notifTime, setNotifTime] = useState("06:00");
  const [showSettings, setShowSettings] = useState(false);
  const [toast, setToast] = useState(null);

  const C = {
    bg:     dark ? "#0D0D0F" : "#F2F3F7",
    card:   dark ? "#1C1C1E" : "#FFFFFF",
    card2:  dark ? "#2C2C2E" : "#F0F1F5",
    text:   dark ? "#F5F5F7" : "#111111",
    sub:    dark ? "#8E8E93" : "#6B7280",
    border: dark ? "#2C2C2E" : "#E4E5E9",
    gold:   "#C89B00",
  };

  useEffect(() => {
    if (!notifOn) return;
    const msgs = checkWasteReminder(zone);
    if (!msgs.length) return;
    const t = setTimeout(() => {
      setToast(msgs[0]);
      setTimeout(() => setToast(null), 6000);
    }, 1200);
    return () => clearTimeout(t);
  }, [zone, notifOn]);

  const zoneEvents = useMemo(() =>
    DB.collections
      .filter(c => c.zone === zone)
      .map(c => ({ ...c, d: parseDate(c.date) }))
      .sort((a, b) => a.d - b.d),
  [zone]);

  // Group by date, slice to 14 unique upcoming dates
  const upcomingGroups = useMemo(() => {
    const map = {};
    zoneEvents.filter(c => daysFrom(c.d) >= 0).forEach(c => {
      if (!map[c.date]) map[c.date] = { d: c.d, date: c.date, types: [] };
      if (!map[c.date].types.includes(c.type)) map[c.date].types.push(c.type);
    });
    return Object.values(map).sort((a, b) => a.d - b.d).slice(0, 14);
  }, [zoneEvents]);

  const next = upcomingGroups[0] || null;

  return (
    <div style={{ fontFamily:"'IBM Plex Sans',system-ui,sans-serif", background:C.bg, color:C.text, minHeight:"100vh", maxWidth:430, margin:"0 auto", position:"relative" }}>
      <style>{`
        * { box-sizing:border-box; margin:0; padding:0; -webkit-tap-highlight-color:transparent; }
        ::-webkit-scrollbar { display:none; }
        @keyframes slideDown { from{opacity:0;transform:translateX(-50%) translateY(-16px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        button { font-family:inherit; }
        input  { font-family:inherit; }
      `}</style>

      {/* Toast */}
      {toast && (
        <div style={{
          position:"fixed", top:16, left:"50%", transform:"translateX(-50%)",
          zIndex:999, width:380, maxWidth:"92vw",
          background:"#1C1C1E", borderRadius:16, padding:"14px 18px 14px 14px",
          boxShadow:"0 8px 40px rgba(0,0,0,0.5)", borderLeft:"4px solid #C89B00",
          animation:"slideDown 0.35s ease", display:"flex", gap:12, alignItems:"flex-start",
        }}>
          <span style={{ fontSize:22, flexShrink:0 }}>🔔</span>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:10, color:"#C89B00", fontWeight:700, letterSpacing:1, marginBottom:3 }}>ABHOLUNG MORGEN</div>
            <div style={{ fontSize:13, color:"#E5E5EA", lineHeight:1.5 }}>{toast}</div>
          </div>
          <button onClick={() => setToast(null)} style={{ background:"none", border:"none", color:"#666", cursor:"pointer", fontSize:16, flexShrink:0 }}>✕</button>
        </div>
      )}

      {/* Header */}
      <div style={{ background: dark ? "#111" : "#1A1A1A", padding:"44px 20px 18px", position:"sticky", top:0, zIndex:40 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontSize:10, color:C.gold, fontWeight:700, letterSpacing:2.5, textTransform:"uppercase", marginBottom:3 }}>
              Abfall · Neuenburg am Rhein
            </div>
            <div style={{ fontSize:20, fontWeight:700, color:"#fff", display:"flex", alignItems:"center", gap:8 }}>
              {getZone(zone)?.name}
              <span style={{ fontSize:12, color:"rgba(255,255,255,0.35)", fontWeight:400 }}>{getZone(zone)?.subtitle}</span>
            </div>
          </div>
          <button onClick={() => setShowSettings(true)} style={{
            background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.1)",
            borderRadius:12, padding:"9px 12px", cursor:"pointer", fontSize:17, color:"#fff",
          }}>⚙️</button>
        </div>
      </div>

      {/* Screens */}
      <div style={{ paddingBottom:86 }}>
        {tab === "home"     && <HomeScreen     upcomingGroups={upcomingGroups} next={next} zone={zone} C={C} dark={dark} />}
        {tab === "calendar" && <CalendarScreen events={zoneEvents} C={C} dark={dark} />}
        {tab === "guide"    && <GuideScreen    C={C} />}
        {tab === "info"     && <InfoScreen     C={C} dark={dark} />}
      </div>

      {/* Bottom Nav */}
      <nav style={{
        position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)",
        width:"100%", maxWidth:430,
        background: dark ? "#1C1C1E" : "#fff",
        borderTop:`1px solid ${C.border}`,
        display:"flex", padding:"10px 0 24px", zIndex:50,
      }}>
        {[["home","🏠","Start"],["calendar","📅","Kalender"],["guide","🔍","Trennen"],["info","ℹ️","Info"]].map(([id,icon,label]) => (
          <button key={id} onClick={() => setTab(id)} style={{
            flex:1, background:"none", border:"none", cursor:"pointer",
            display:"flex", flexDirection:"column", alignItems:"center", gap:3,
            opacity: tab===id ? 1 : 0.38, transition:"opacity 0.18s",
          }}>
            <span style={{ fontSize:22 }}>{icon}</span>
            <span style={{ fontSize:10, fontWeight:tab===id?700:400, color:tab===id?C.gold:C.text }}>{label}</span>
          </button>
        ))}
      </nav>

      {/* Settings Sheet */}
      {showSettings && (
        <div style={{ position:"fixed", inset:0, zIndex:200, background:"rgba(0,0,0,0.65)", display:"flex", alignItems:"flex-end", justifyContent:"center" }}
          onClick={() => setShowSettings(false)}>
          <div onClick={e => e.stopPropagation()} style={{
            background:C.card, width:"100%", maxWidth:430,
            borderRadius:"24px 24px 0 0", padding:"20px 20px 44px",
            maxHeight:"85vh", overflowY:"auto",
          }}>
            <div style={{ width:40, height:4, background:C.border, borderRadius:2, margin:"0 auto 22px" }} />
            <div style={{ fontSize:17, fontWeight:700, color:C.text, marginBottom:20 }}>Einstellungen</div>

            <SLabel text="Mein Ortsteil" C={C} />
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:22 }}>
              {DB.zones.map(z => (
                <button key={z.id} onClick={() => setZone(z.id)} style={{
                  background: zone===z.id ? C.gold : C.card2,
                  border:`1px solid ${zone===z.id ? C.gold : C.border}`,
                  borderRadius:14, padding:"13px", cursor:"pointer", textAlign:"left",
                }}>
                  <div style={{ fontSize:16, marginBottom:3 }}>📍</div>
                  <div style={{ fontSize:13, fontWeight:700, color: zone===z.id ? "#111" : C.text }}>{z.name}</div>
                  <div style={{ fontSize:10, color: zone===z.id ? "rgba(0,0,0,0.5)" : C.sub }}>{z.subtitle}</div>
                </button>
              ))}
            </div>

            <SLabel text="Darstellung" C={C} />
            <SRow label="Dark Mode" C={C}>
              <Toggle val={dark} onChange={() => setDark(!dark)} gold={C.gold} />
            </SRow>

            <SLabel text="Benachrichtigungen" C={C} />
            <SRow label="Erinnerungen aktiv" C={C}>
              <Toggle val={notifOn} onChange={() => setNotifOn(!notifOn)} gold={C.gold} />
            </SRow>
            {notifOn && (
              <SRow label="Uhrzeit (Abholtag)" C={C}>
                <input type="time" value={notifTime} onChange={e => setNotifTime(e.target.value)}
                  style={{ background:C.card2, border:`1px solid ${C.border}`, borderRadius:10, padding:"5px 12px", color:C.text, fontSize:14, outline:"none" }} />
              </SRow>
            )}

            <button onClick={() => setShowSettings(false)} style={{
              width:"100%", marginTop:22, padding:"14px",
              background:C.gold, border:"none", borderRadius:14,
              fontWeight:700, fontSize:15, color:"#111", cursor:"pointer",
            }}>Fertig</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── HOME ─────────────────────────────────────────────────────────────────────
function HomeScreen({ upcomingGroups, next, zone, C, dark }) {
  const diff = next ? daysFrom(next.d) : null;
  const nextTypes = next ? next.types.map(getType).filter(Boolean) : [];
  const wt = nextTypes[0] || null;
  const urgent = diff !== null && diff <= 1;

  const grouped = upcomingGroups;

  return (
    <div style={{ padding:"18px 16px" }}>

      {/* Hero Card */}
      {next && wt ? (
        <div style={{
          background: urgent
            ? `linear-gradient(140deg, ${wt.color} 0%, ${shiftColor(wt.color,-40)} 100%)`
            : dark ? "linear-gradient(140deg,#1C1C1E,#2A2A2C)" : "linear-gradient(140deg,#1A1A1A,#2D2D2D)",
          borderRadius:22, padding:"24px 22px", marginBottom:18,
          position:"relative", overflow:"hidden",
          boxShadow: urgent ? `0 12px 40px ${wt.color}55` : "0 4px 24px rgba(0,0,0,0.25)",
          animation:"fadeUp 0.35s ease",
        }}>
          <div style={{ position:"absolute", top:-30, right:-30, width:150, height:150, borderRadius:"50%", background:"rgba(255,255,255,0.04)" }} />
          <div style={{ fontSize:11, color: urgent?"rgba(255,255,255,0.65)":"#C89B00", fontWeight:700, letterSpacing:2, textTransform:"uppercase", marginBottom:14 }}>
            Nächste Abholung
          </div>
          <div style={{ marginBottom:16 }}>
            <div style={{ display:"flex", flexWrap:"wrap", gap:10, marginBottom:10 }}>
              {nextTypes.map(t => (
                <div key={t.id} style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:52, height:52, borderRadius:16, background:"rgba(255,255,255,0.13)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, flexShrink:0 }}>
                    {t.emoji}
                  </div>
                  <div style={{ fontSize:18, fontWeight:700, color:"#fff" }}>{t.name}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.55)" }}>{fmtLong(next.d)}</div>
          </div>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(255,255,255,0.14)", borderRadius:30, padding:"6px 16px" }}>
            {urgent && <span style={{ width:7, height:7, borderRadius:"50%", background:"#fff", display:"inline-block" }} />}
            <span style={{ color:"#fff", fontWeight:700, fontSize:14 }}>{dayLabel(diff)}</span>
          </div>
          {urgent && (
            <div style={{ marginTop:12, fontSize:12, color:"rgba(255,255,255,0.65)", borderTop:"1px solid rgba(255,255,255,0.1)", paddingTop:10, lineHeight:1.5 }}>
              🔔 Tonne bis 06:00 Uhr morgens bereitstellen!
            </div>
          )}
        </div>
      ) : (
        <div style={{ background:C.card, borderRadius:22, padding:"24px", textAlign:"center", marginBottom:18, color:C.sub }}>
          Keine bevorstehenden Termine
        </div>
      )}

      {/* Tonnen-Grid */}
      <SLabel text="Alle Tonnen" C={C} />
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:9, marginBottom:22 }}>
        {DB.waste_types.map(wt => {
          const nxt = DB.collections
            .filter(c => c.zone===zone && c.type===wt.id)
            .map(c => ({ ...c, d:parseDate(c.date) }))
            .filter(c => daysFrom(c.d)>=0)
            .sort((a,b) => a.d-b.d)[0];
          const d = nxt ? daysFrom(nxt.d) : null;
          const soon = d !== null && d <= 1;
          return (
            <div key={wt.id} style={{
              background:C.card, borderRadius:15, padding:"14px",
              border:`1px solid ${C.border}`, borderLeft:`3px solid ${wt.color}`,
            }}>
              <div style={{ fontSize:26, marginBottom:8 }}>{wt.emoji}</div>
              <div style={{ fontSize:12, fontWeight:600, color:C.text, marginBottom:3 }}>{wt.name}</div>
              <div style={{ fontSize:11, color: soon?wt.color:C.sub, fontWeight: soon?700:400 }}>
                {nxt ? (d===0?"⚡ Heute" : d===1?"⚡ Morgen" : `📅 ${fmtShort(nxt.d)}`) : "–"}
              </div>
            </div>
          );
        })}
      </div>

      {/* Upcoming list */}
      <SLabel text="Bevorstehende Abholungen" C={C} />
      {grouped.map((g, i) => {
        const diff = daysFrom(g.d);
        const urg  = diff <= 1;
        return (
          <div key={i} style={{
            background: urg ? (dark?"#1A1508":"#FFFBEB") : C.card,
            border:`1px solid ${urg?"#C89B00":C.border}`,
            borderRadius:14, padding:"13px 14px", marginBottom:8,
            display:"flex", alignItems:"center", gap:12,
            animation:`fadeUp ${0.3+i*0.04}s ease`,
          }}>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:1, width:38, flexShrink:0 }}>
              <div style={{ fontSize:10, color:C.sub, fontWeight:600 }}>
                {g.d.toLocaleDateString("de-DE",{weekday:"short"}).replace(".","").toUpperCase()}
              </div>
              <div style={{ fontSize:20, fontWeight:800, color:C.text, lineHeight:1 }}>{g.d.getDate()}</div>
              <div style={{ fontSize:10, color:C.sub }}>{g.d.toLocaleDateString("de-DE",{month:"short"})}</div>
            </div>
            <div style={{ flex:1, display:"flex", flexWrap:"wrap", gap:5 }}>
              {g.types.map(tid => {
                const wt = getType(tid);
                return (
                  <span key={tid} style={{ display:"flex", alignItems:"center", gap:4, padding:"4px 10px", borderRadius:20, background:wt.bg, color:wt.color, fontSize:12, fontWeight:600, border:`1px solid ${wt.color}22` }}>
                    {wt.emoji} {wt.name}
                  </span>
                );
              })}
            </div>
            <div style={{ background:urg?"#C89B00":C.card2, borderRadius:20, padding:"3px 10px", border:urg?"none":`1px solid ${C.border}`, flexShrink:0 }}>
              <span style={{ fontSize:10, fontWeight:700, color:urg?"#111":C.sub }}>{dayLabel(diff)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── KALENDER ─────────────────────────────────────────────────────────────────
function CalendarScreen({ events, C, dark }) {
  const MONTHS = ["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];
  const SHORT  = ["Jan","Feb","Mär","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"];
  const DAYS   = ["Mo","Di","Mi","Do","Fr","Sa","So"];
  const [month, setMonth] = useState(TODAY.getMonth());
  const year = 2026;

  const byDate = useMemo(() => {
    const map = {};
    events.forEach(c => {
      if (!map[c.date]) map[c.date] = [];
      if (!map[c.date].includes(c.type)) map[c.date].push(c.type);
    });
    return map;
  }, [events]);

  const firstDow = new Date(year, month, 1).getDay();
  const offset   = firstDow === 0 ? 6 : firstDow - 1;
  const daysIn   = new Date(year, month+1, 0).getDate();
  const cells    = Array.from({ length: offset + daysIn });

  const monthList = useMemo(() =>
    Object.entries(byDate)
      .filter(([d]) => new Date(d+"T00:00:00").getMonth() === month)
      .sort(),
  [byDate, month]);

  const isThisMonth = TODAY.getFullYear()===year && TODAY.getMonth()===month;

  return (
    <div style={{ padding:"18px 16px" }}>
      {/* Month scroller */}
      <div style={{ display:"flex", gap:7, overflowX:"auto", marginBottom:18, paddingBottom:4 }}>
        {SHORT.map((m,i) => (
          <button key={i} onClick={() => setMonth(i)} style={{
            flexShrink:0, padding:"5px 14px", borderRadius:20,
            border:`1px solid ${month===i?"#C89B00":C.border}`,
            background: month===i?"#C89B00":C.card,
            color: month===i?"#111":C.sub,
            fontWeight: month===i?700:400,
            fontSize:12, cursor:"pointer",
          }}>{m}</button>
        ))}
      </div>

      <div style={{ fontSize:18, fontWeight:700, color:C.text, marginBottom:14 }}>
        {MONTHS[month]} <span style={{ color:C.sub, fontWeight:400, fontSize:14 }}>{year}</span>
      </div>

      {/* Grid */}
      <div style={{ background:C.card, borderRadius:18, border:`1px solid ${C.border}`, overflow:"hidden", marginBottom:18 }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", background:C.card2 }}>
          {DAYS.map(d => (
            <div key={d} style={{ textAlign:"center", padding:"9px 0", fontSize:10, fontWeight:700, color:C.sub }}>{d}</div>
          ))}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)" }}>
          {cells.map((_,i) => {
            const day = i - offset + 1;
            if (day < 1 || day > daysIn) return <div key={i} style={{ padding:"8px 2px", borderBottom:`1px solid ${C.border}` }} />;
            const ds    = `${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
            const types = byDate[ds] || [];
            const isToday = isThisMonth && TODAY.getDate()===day;
            return (
              <div key={i} style={{ padding:"5px 2px", textAlign:"center", borderBottom:`1px solid ${C.border}`, background:isToday?(dark?"#1A1508":"#FFFBEB"):"transparent" }}>
                <div style={{ width:24, height:24, borderRadius:"50%", margin:"0 auto 3px", display:"flex", alignItems:"center", justifyContent:"center", background:isToday?"#C89B00":"transparent", fontSize:11, fontWeight:isToday?800:400, color:isToday?"#111":C.text }}>
                  {day}
                </div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:2, justifyContent:"center" }}>
                  {types.map(tid => (
                    <div key={tid} style={{ width:6, height:6, borderRadius:"50%", background:getType(tid)?.color }} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legende */}
      <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:18 }}>
        {DB.waste_types.map(wt => (
          <div key={wt.id} style={{ display:"flex", alignItems:"center", gap:5 }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:wt.color }} />
            <span style={{ fontSize:10, color:C.sub }}>{wt.name}</span>
          </div>
        ))}
      </div>

      {/* Month list */}
      <SLabel text={`Termine im ${MONTHS[month]}`} C={C} />
      {monthList.length === 0 && (
        <div style={{ textAlign:"center", padding:"30px 0", color:C.sub }}>Keine Abholungen</div>
      )}
      {monthList.map(([date, types]) => {
        const d    = parseDate(date);
        const diff = daysFrom(d);
        return (
          <div key={date} style={{ display:"flex", alignItems:"center", gap:12, padding:"11px 0", borderBottom:`1px solid ${C.border}` }}>
            <div style={{ width:42, textAlign:"center", flexShrink:0 }}>
              <div style={{ fontSize:9, color:C.sub, fontWeight:700 }}>{d.toLocaleDateString("de-DE",{weekday:"short"}).toUpperCase()}</div>
              <div style={{ fontSize:19, fontWeight:800, color:C.text }}>{d.getDate()}</div>
              <div style={{ fontSize:9, color:C.sub }}>{d.toLocaleDateString("de-DE",{month:"short"})}</div>
            </div>
            <div style={{ flex:1, display:"flex", flexWrap:"wrap", gap:5 }}>
              {types.map(tid => {
                const wt = getType(tid);
                return (
                  <span key={tid} style={{ padding:"3px 10px", borderRadius:20, background:wt.bg, color:wt.color, fontSize:11, fontWeight:600 }}>
                    {wt.emoji} {wt.name}
                  </span>
                );
              })}
            </div>
            {diff >= 0 && <span style={{ fontSize:10, color:diff<=1?"#C89B00":C.sub, fontWeight:diff<=1?700:400, flexShrink:0 }}>{dayLabel(diff)}</span>}
          </div>
        );
      })}
    </div>
  );
}

// ─── TRENNEN ──────────────────────────────────────────────────────────────────
function GuideScreen({ C }) {
  const [q, setQ]       = useState("");
  const [open, setOpen] = useState(null);

  const results = useMemo(() => {
    if (!q) return DB.guide;
    return DB.guide.filter(g => g.item.toLowerCase().includes(q.toLowerCase()));
  }, [q]);

  return (
    <div style={{ padding:"18px 16px" }}>
      <div style={{ fontSize:20, fontWeight:700, color:C.text, marginBottom:3 }}>Abfalltrennung</div>
      <div style={{ fontSize:13, color:C.sub, marginBottom:16 }}>Was gehört wohin?</div>

      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:"11px 16px", display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
        <span style={{ fontSize:16, opacity:0.4 }}>🔍</span>
        <input value={q} onChange={e => setQ(e.target.value)}
          placeholder="Artikel eingeben… z.B. Joghurtbecher"
          style={{ background:"none", border:"none", outline:"none", flex:1, fontSize:14, color:C.text }} />
        {q && <button onClick={() => setQ("")} style={{ background:"none", border:"none", cursor:"pointer", color:C.sub, fontSize:15 }}>✕</button>}
      </div>

      {!q && (
        <div style={{ display:"flex", gap:7, overflowX:"auto", marginBottom:16, paddingBottom:4 }}>
          {DB.waste_types.map(wt => (
            <button key={wt.id} onClick={() => setQ(wt.name)} style={{
              flexShrink:0, padding:"5px 13px", borderRadius:20,
              border:`1px solid ${wt.color}33`, background:wt.bg,
              color:wt.color, fontSize:11, fontWeight:700, cursor:"pointer",
            }}>{wt.emoji} {wt.name}</button>
          ))}
        </div>
      )}

      {results.length === 0 ? (
        <div style={{ textAlign:"center", padding:"50px 20px", color:C.sub }}>
          <div style={{ fontSize:38, marginBottom:10 }}>🤷</div>
          <div style={{ fontSize:15, fontWeight:600, marginBottom:5 }}>Kein Treffer</div>
          <div style={{ fontSize:12 }}>Tipp: ALB Beratung 0761 2187-9707</div>
        </div>
      ) : results.map((g, i) => {
        const wt = getType(g.type);
        return (
          <div key={i} onClick={() => setOpen(open===i?null:i)} style={{
            background:C.card, borderRadius:13,
            border:`1px solid ${C.border}`, borderLeft:`3px solid ${wt.color}`,
            marginBottom:7, cursor:"pointer",
          }}>
            <div style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 14px" }}>
              <span style={{ fontSize:20 }}>{wt.emoji}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600, fontSize:13, color:C.text }}>{g.item}</div>
                {open===i && <div style={{ fontSize:11, color:C.sub, marginTop:3, lineHeight:1.5 }}>💡 {g.tip}</div>}
              </div>
              <span style={{ padding:"3px 11px", borderRadius:20, background:wt.bg, color:wt.color, fontSize:11, fontWeight:700, flexShrink:0 }}>
                {wt.name}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── INFO ─────────────────────────────────────────────────────────────────────
function InfoAccordion({ title, icon, color, children, C, defaultOpen }) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, marginBottom:10, overflow:"hidden" }}>
      <div onClick={() => setOpen(!open)} style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 16px", cursor:"pointer" }}>
        <span style={{ fontSize:20, flexShrink:0 }}>{icon}</span>
        <div style={{ flex:1, fontSize:14, fontWeight:700, color:C.text }}>{title}</div>
        <span style={{ color:C.sub, fontSize:16, transition:"transform 0.2s", display:"inline-block", transform:open?"rotate(180deg)":"none" }}>▾</span>
      </div>
      {open && (
        <div style={{ padding:"0 16px 16px", borderTop:`1px solid ${C.border}` }}>
          {children}
        </div>
      )}
    </div>
  );
}

function InfoScreen({ C, dark }) {
  return (
    <div style={{ padding:"18px 16px" }}>
      <div style={{ fontSize:20, fontWeight:700, color:C.text, marginBottom:4 }}>Info</div>
      <div style={{ fontSize:13, color:C.sub, marginBottom:18 }}>Abfuhrregeln, Standorte & Kontakt</div>

      {/* Schadstoffsammlung */}
      <InfoAccordion title="Schadstoffsammlung 2026" icon="☣️" C={C} defaultOpen>
        <div style={{ fontSize:12, color:C.sub, lineHeight:1.7, marginTop:12, marginBottom:12 }}>
          📍 P Atomics ggü. Nepomuks Kinderwelt, Rheinwaldstr.
        </div>
        {[["31.01.","Sa","13:00–16:00 Uhr"],["10.03.","Di","15:30–18:00 Uhr"],["18.07.","Sa","09:00–12:00 Uhr"],["04.11.","Mi","15:00–18:00 Uhr"]].map(([d,wd,t],i,a) => (
          <div key={d} style={{ display:"flex", alignItems:"center", gap:14, padding:"10px 0", borderTop:`1px solid ${C.border}` }}>
            <div style={{ width:46, textAlign:"center", flexShrink:0 }}>
              <div style={{ fontSize:9, color:"#DC2626", fontWeight:700 }}>{wd}</div>
              <div style={{ fontSize:15, fontWeight:800, color:C.text }}>{d}</div>
            </div>
            <div style={{ fontSize:12, color:C.sub }}>{t}</div>
          </div>
        ))}
        <div style={{ fontSize:11, color:C.sub, lineHeight:1.6, marginTop:12, padding:"10px 0", borderTop:`1px solid ${C.border}` }}>
          Sie können auch die Sammeltermine in anderen Gemeinden nutzen. Alle Termine stehen auf unserer Internetseite.
        </div>
      </InfoAccordion>

      {/* Sperrmüll */}
      <InfoAccordion title="Sperrmüll" icon="🛋️" C={C}>
        <div style={{ fontSize:12, color:C.sub, lineHeight:1.8, marginTop:12 }}>
          Zur Abfuhrbestellung die Sperrmüllkarte an die ALB schicken oder online anmelden unter{" "}
          <span style={{ color:"#1D4ED8" }}>www.breisgau-hochschwarzwald.de/sperrmuell</span>.
          {" "}Der Abholtermin wird innerhalb von 5 Wochen mitgeteilt.
        </div>
        <div style={{ fontSize:12, color:C.sub, lineHeight:1.8, marginTop:10 }}>
          Selbstanlieferung mit Sperrmüllkarte bei:
        </div>
        {["RAZ Breisgau", "Remondis, Liebigstraße, Freiburg (Mo und Do 13:00–17:00 Uhr)"].map((s,i) => (
          <div key={i} style={{ fontSize:12, color:C.text, padding:"6px 0 6px 12px", borderLeft:`2px solid ${C.border}`, marginTop:6 }}>· {s}</div>
        ))}
        <div style={{ fontSize:12, color:C.sub, lineHeight:1.7, marginTop:10, padding:"10px 0", borderTop:`1px solid ${C.border}` }}>
          💡 Noch brauchbare Gegenstände holt evtl. der Verein <strong style={{color:C.text}}>Secondo</strong> ab. Tel. 07665 947430
        </div>
      </InfoAccordion>

      {/* Abfuhrregeln */}
      <InfoAccordion title="Abfuhrregeln" icon="ℹ️" C={C}>
        <div style={{ fontSize:12, color:C.sub, lineHeight:1.8, marginTop:12 }}>
          🕕 Die Tonnen müssen ab <strong style={{color:C.text}}>6:00 Uhr morgens</strong> bereitstehen.
        </div>
        <div style={{ fontSize:12, color:C.sub, lineHeight:1.8, marginTop:12, padding:"12px 0", borderTop:`1px solid ${C.border}` }}>
          ❄️ <strong style={{color:C.text}}>Abfuhrregelung im Winter:</strong> Konnten Straßen witterungsbedingt nicht angefahren werden, die Müllgefäße erstmal stehen lassen. Es wird versucht, innerhalb der folgenden 2 Werktage zu leeren. Ist das nicht möglich, erhalten Sie bei der Gemeindeverwaltung gebührenfreie <strong style={{color:C.text}}>Notfallsäcke für Restmüll (orange)</strong>.
        </div>
      </InfoAccordion>

      {/* RAZ Breisgau */}
      <InfoAccordion title="RAZ Breisgau" icon="🏭" C={C}>
        <div style={{ fontSize:12, color:C.sub, lineHeight:1.8, marginTop:12 }}>
          📍 Ehrenkirchener Straße 3, 79427 Eschbach
        </div>
        {[["Mo, Di, Do, Fr","09:00–15:00 Uhr"],["Di zusätzlich","12:00–18:00 Uhr"],["Samstag","08:00–12:00 Uhr"]].map(([d,t],i) => (
          <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0", borderTop:`1px solid ${C.border}`, marginTop:6 }}>
            <span style={{ fontSize:12, color:C.sub }}>{d}</span>
            <span style={{ fontSize:12, fontWeight:600, color:C.text }}>{t}</span>
          </div>
        ))}
        <div style={{ fontSize:11, color:C.sub, marginTop:8 }}>Letzter Einlass 15 Minuten vor Betriebsende.</div>
        <div style={{ fontSize:11, color:C.sub, marginTop:6, lineHeight:1.6 }}>Papier, Kartonage, Metall, Elektrogeräte, CDs, Flaschenglas, gebührenpflichtige Abfälle, Grünschnitt</div>
      </InfoAccordion>

      {/* Recyclinghof Müllheim */}
      <InfoAccordion title="Recyclinghof Müllheim" icon="♻️" C={C}>
        <div style={{ fontSize:12, color:C.sub, lineHeight:1.8, marginTop:12 }}>
          📍 Renkenrunsstraße 8b, 79379 Müllheim
        </div>
        {[["Mittwoch","14:00–17:00 Uhr"],["Samstag","10:00–14:00 Uhr"]].map(([d,t],i) => (
          <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0", borderTop:`1px solid ${C.border}`, marginTop:6 }}>
            <span style={{ fontSize:12, color:C.sub }}>{d}</span>
            <span style={{ fontSize:12, fontWeight:600, color:C.text }}>{t}</span>
          </div>
        ))}
        <div style={{ fontSize:11, color:C.sub, marginTop:8, lineHeight:1.6 }}>Papier, Kartonagen, Metall, Flaschenglas/-kork, Elektrogeräte, CDs.</div>
      </InfoAccordion>

      {/* Breisgau Kompost */}
      <InfoAccordion title="Breisgau Kompost GmbH" icon="🌱" C={C}>
        <div style={{ fontSize:12, color:C.sub, lineHeight:1.8, marginTop:12 }}>
          📍 Renkenrunsstraße 8, 79379 Müllheim · T.: 07631 172323
        </div>
        {[["Mo–Do","07:30–16:30 Uhr"],["Freitag","07:30–18:00 Uhr"],["Samstag","08:00–13:00 Uhr"]].map(([d,t],i) => (
          <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0", borderTop:`1px solid ${C.border}`, marginTop:6 }}>
            <span style={{ fontSize:12, color:C.sub }}>{d}</span>
            <span style={{ fontSize:12, fontWeight:600, color:C.text }}>{t}</span>
          </div>
        ))}
        <div style={{ fontSize:12, color:C.sub, marginTop:10, padding:"10px 0", borderTop:`1px solid ${C.border}`, lineHeight:1.7 }}>
          🗓️ <strong style={{color:C.text}}>Dezember bis Februar:</strong> Mo–Fr 08:00–16:00 Uhr · Sa 08:00–13:00 Uhr
        </div>
      </InfoAccordion>

      {/* Kontakt */}
      <InfoAccordion title="Kontakt" icon="📞" C={C}>
        <div style={{ marginTop:12, display:"flex", flexDirection:"column", gap:8 }}>
          {[
            ["Reklamationen (Restmüll, Bio, Papier)", "REMONDIS", "0761 2187-9707","reklamation.alb@lkbh.de"],
            ["Gelbe Tonne", "REMONDIS", "0761 51509-95","lkbh@remondis.de"],
            ["Abfallberatung", "ALB", "0761 2187-9707","alb@lkbh.de"],
            ["Gebühren / Behälter", "ALB", "0761 2187-8844","gebuehreneinzug@lkbh.de"],
            ["Sperrmüllservice", "ALB", "0761 2187-8844","sperrmuell@lkbh.de"],
          ].map(([label,org,tel,email],i) => (
            <div key={i} style={{ background:C.card2 || (dark?"#2C2C2E":"#F4F4F5"), borderRadius:12, padding:"11px 13px" }}>
              <div style={{ fontSize:10, color:C.sub, marginBottom:3 }}>{label}</div>
              <div style={{ fontSize:12, fontWeight:700, color:C.text, marginBottom:4 }}>{org}</div>
              <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                <span style={{ fontSize:11, color:"#1D4ED8" }}>📞 {tel}</span>
                <span style={{ fontSize:11, color:"#1D4ED8" }}>✉️ {email}</span>
              </div>
            </div>
          ))}
          <div style={{ fontSize:11, color:C.sub, textAlign:"center", paddingTop:4 }}>
            🌐 www.breisgau-hochschwarzwald.de/alb
          </div>
        </div>
      </InfoAccordion>

      {/* Benachrichtigungen */}
      <InfoAccordion title="Benachrichtigungen" icon="🔔" C={C}>
        <div style={{ marginTop:12 }}>
          <NotifInfoPanel C={C} dark={dark} />
        </div>
      </InfoAccordion>

      <div style={{ textAlign:"center", color:C.sub, fontSize:11, padding:"16px 0" }}>
        Daten: ALB Breisgau-Hochschwarzwald · 2026
      </div>
    </div>
  );
}

// ─── NOTIFICATION INFO PANEL ──────────────────────────────────────────────────
function NotifInfoPanel({ C, dark }) {
  const steps = [
    { icon:"🌆", time:"18:00 Uhr", title:"Abend-Erinnerung",  color:"#6B3A1F", bg:"#FDF3EB",
      desc:"Am Vorabend erhältst du eine Benachrichtigung, damit du die Tonne rechtzeitig rausstellen kannst.",
      example:"Morgen wird die Biotonne abgeholt. Jetzt bereitstellen!" },
    { icon:"🌅", time:"06:00 Uhr", title:"Morgen-Erinnerung", color:"#B8860B", bg:"#FFFBEB",
      desc:"Am Abholtag selbst erinnert dich die App am Morgen. Die Uhrzeit kannst du in den Einstellungen anpassen.",
      example:"Heute wird die Gelbe Tonne abgeholt!" },
  ];
  return (
    <div style={{ marginBottom:20 }}>
      {steps.map((s,i) => (
        <div key={i} style={{ background:C.card, border:`1px solid ${C.border}`, borderLeft:`3px solid ${s.color}`, borderRadius:14, padding:"16px", marginBottom:10 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
            <div style={{ width:44, height:44, borderRadius:12, background:s.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>
              {s.icon}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, fontWeight:700, color:C.text }}>{s.title}</div>
              <div style={{ fontSize:11, color:s.color, fontWeight:600, marginTop:1 }}>🕐 {s.time}</div>
            </div>
            <div style={{ background:s.bg, border:`1px solid ${s.color}33`, borderRadius:20, padding:"3px 10px" }}>
              <span style={{ fontSize:10, fontWeight:700, color:s.color }}>AKTIV</span>
            </div>
          </div>
          <div style={{ fontSize:12, color:C.sub, lineHeight:1.6, marginBottom:10 }}>{s.desc}</div>
          <div style={{ background:dark?"#2C2C2E":"#F0F1F5", borderRadius:12, padding:"10px 14px", display:"flex", alignItems:"flex-start", gap:10 }}>
            <div style={{ width:32, height:32, borderRadius:8, background:s.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>🗑️</div>
            <div>
              <div style={{ fontSize:10, fontWeight:700, color:C.sub, marginBottom:2 }}>ABFALL NEUENBURG</div>
              <div style={{ fontSize:12, color:C.text, lineHeight:1.5 }}>{s.example}</div>
            </div>
          </div>
        </div>
      ))}
      <div style={{ background:dark?"#1A1508":"#FFFBEB", border:"1px solid #C89B0033", borderRadius:12, padding:"12px 14px", display:"flex", gap:10 }}>
        <span style={{ fontSize:16, flexShrink:0 }}>💡</span>
        <div style={{ fontSize:12, color:C.sub, lineHeight:1.6 }}>
          Benachrichtigungen kannst du in den <strong style={{ color:C.text }}>Einstellungen</strong> an‑ oder ausschalten und die Uhrzeit anpassen.
        </div>
      </div>
    </div>
  );
}

// ─── SHARED ───────────────────────────────────────────────────────────────────
function SLabel({ text, C }) {
  return <div style={{ fontSize:10, fontWeight:700, color:C.sub, letterSpacing:1.8, textTransform:"uppercase", marginBottom:9, marginTop:4 }}>{text}</div>;
}
function SRow({ label, children, C }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"13px 0", borderBottom:`1px solid ${C.border}` }}>
      <span style={{ fontSize:14, color:C.text }}>{label}</span>
      {children}
    </div>
  );
}
function Toggle({ val, onChange, gold }) {
  return (
    <div onClick={onChange} style={{ width:46, height:26, borderRadius:13, background:val?gold:"#444", position:"relative", cursor:"pointer", transition:"background 0.2s", flexShrink:0 }}>
      <div style={{ position:"absolute", top:3, left:val?23:3, width:20, height:20, borderRadius:"50%", background:"#fff", transition:"left 0.2s", boxShadow:"0 1px 4px rgba(0,0,0,0.35)" }} />
    </div>
  );
}
function shiftColor(hex, amt) {
  const n = parseInt(hex.replace("#",""),16);
  const c = v => Math.max(0,Math.min(255,v));
  const r = c((n>>16)+amt), g = c(((n>>8)&0xff)+amt), b = c((n&0xff)+amt);
  return "#"+((r<<16)|(g<<8)|b).toString(16).padStart(6,"0");
}
