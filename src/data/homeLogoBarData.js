import awsLogo from "../assets/logo/aws 1.svg";
import quadientLogo from "../assets/images/client_logo4.svg";
import unilyLogo from "../assets/logo/UNILY LOGO@3x 1.svg";
import {
  isIconOnlyLogo,
  resolveLogoEntry,
} from "../utils/logoResolver";

const homePageClientEntries = [
  {
    id: "hh-global",
    name: "HH Global",
    logoKeywords: ["hhglobal", "hglobal"],
    initials: "HH",
  },
  {
    id: "the-dispute-service",
    name: "The Dispute Service Limited",
    logoKeywords: ["tds"],
    initials: "TDS",
  },
  {
    id: "canopius",
    name: "Vave MGA (Canopius Insurance Services)",
    logoKeywords: ["canopius"],
    initials: "VM",
  },
  {
    id: "culina",
    name: "Cullina",
    logoKeywords: ["culina"],
    initials: "CU",
  },
  {
    id: "inspereX",
    name: "InspereX",
    logoKeywords: ["inspere", "inspereX"],
    initials: "IX",
  },
  {
    id: "publicis-groupe",
    name: "Publicis Groupe",
    logoKeywords: ["publicis"],
    initials: "PG",
  },
];

const homePagePartnerEntries = [
  { id: "microsoft", name: "Microsoft", logoKeywords: ["microsoft"] },
  { id: "aws", name: "AWS", logo: awsLogo },
  { id: "uipath", name: "UiPath", logoKeywords: ["uipath"] },
  { id: "contentful", name: "Contentful", logoKeywords: ["contentful"] },
  { id: "ellucian", name: "Ellucian", logoKeywords: ["ellucian"] },
  { id: "messagepoint", name: "Messagepoint", logoKeywords: ["messagepoint"] },
  {
    id: "quadient",
    name: "Quadient",
    logo: quadientLogo,
    logoOnDarkSurface: true,
  },
  { id: "hubspot", name: "HubSpot", logoKeywords: ["hotsport", "hubspot"] },
  { id: "databricks", name: "Databricks", logoKeywords: ["databricks"] },
  { id: "unily", name: "Unily", logo: unilyLogo },
];

const mapLogoEntries = (entries) =>
  entries.map((entry) => ({
    ...entry,
    logo: resolveLogoEntry(entry),
  }));

const mapPartnerEntries = (entries) =>
  mapLogoEntries(entries).filter(
    (entry) => entry.logo && !isIconOnlyLogo(entry.logo),
  );

export const homePageClients = mapLogoEntries(homePageClientEntries);
export const homePagePartners = mapPartnerEntries(homePagePartnerEntries);
