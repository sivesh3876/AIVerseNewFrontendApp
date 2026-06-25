import hubspotLogo from "../assets/images/client_logo2.svg";
import quadientLogo from "../assets/images/client_logo4.svg";
import outsystemsLogo from "../assets/logo/mobile-logo 1.svg";
import { resolveLogoEntry } from "../utils/logoResolver";

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
  { id: "sitecore", name: "Sitecore", logoKeywords: ["sitecore"] },
  { id: "microsoft", name: "Microsoft", logoKeywords: ["microsoft"] },
  { id: "uipath", name: "UiPath", logoKeywords: ["uipath"] },
  { id: "opentext", name: "OpenText", logoKeywords: ["opentext"], initials: "OT" },
  { id: "searchstax", name: "Searchstax", logoKeywords: ["searchstax"] },
  { id: "wso2", name: "WSO2", logoKeywords: ["wso2"], initials: "WS" },
  { id: "salesforce", name: "Salesforce", logoKeywords: ["salesforce"] },
  { id: "contentful", name: "Contentful", logoKeywords: ["contentful"] },
  { id: "aws", name: "AWS", logoKeywords: ["aws"], initials: "AWS" },
  { id: "ellucian", name: "Ellucian", logoKeywords: ["ellucian"] },
  { id: "messagepoint", name: "Messagepoint", logoKeywords: ["messagepoint"] },
  { id: "quadient", name: "Quadient", logo: quadientLogo },
  { id: "outsystems", name: "Outsystems", logo: outsystemsLogo },
  {
    id: "contentstack",
    name: "Contentstack",
    logoKeywords: ["contentstack"],
    initials: "CS",
  },
  { id: "dvelop", name: "d.velop", logoKeywords: ["dvelop", "velop"], initials: "DV" },
  { id: "umbraco", name: "Umbraco", logoKeywords: ["umbraco"], initials: "UM" },
  { id: "hubspot", name: "HubSpot", logo: hubspotLogo },
  { id: "databricks", name: "Databricks", logoKeywords: ["databricks"] },
  { id: "unily", name: "Unily", logoKeywords: ["unily"] },
];

const mapLogoEntries = (entries) =>
  entries.map((entry) => ({
    ...entry,
    logo: resolveLogoEntry(entry),
  }));

export const homePageClients = mapLogoEntries(homePageClientEntries);
export const homePagePartners = mapLogoEntries(homePagePartnerEntries);
