export const contactOffices = [
  {
    id: "new-jersey",
    region: "New Jersey, North America",
    company: "Espire Technologies, Inc.",
    addressLines: [
      "2500 Plaza 5, 25th Floor, Harborside Financial Center",
      "Jersey City, NJ 07311",
    ],
  },
  {
    id: "vancouver",
    region: "British Columbia, Canada",
    company: "Espire Infolabs Inc.",
    addressLines: [
      "210 - 1080 Mainland Street",
      "Vancouver, British Columbia, V6B 2T4, Canada",
    ],
  },
  {
    id: "london",
    region: "London, UK",
    company: "Espire Infolabs Ltd.",
    addressLines: ["Level 23, 1 Leadenhall Street", "London, EC3V 1AB"],
  },
  {
    id: "dublin",
    region: "Dublin, Ireland",
    company: "Espire Infolabs",
    addressLines: [
      "77 Sir John Rogersons Quay, Block C,",
      "Grand Canal Docklands,",
      "Dublin 2, D02 VK60,",
      "Ireland",
    ],
    phones: ["+353 (0)1 553 0231"],
    email: "sales.ir@espire.com",
  },
  {
    id: "sydney",
    region: "Sydney, Australia",
    company: "Espire Infolabs Pty. Ltd.",
    addressLines: [
      "Suite 902, Level 9, 132 Arthur Street",
      "North Sydney, NSW 2060",
    ],
    phones: ["+61 (2) 9004-8880", "+61 (2) 9004-8881"],
    email: "sales.au@espire.com",
  },
  {
    id: "melbourne",
    region: "Melbourne, Australia",
    company: "Espire Infolabs Pty. Ltd.",
    addressLines: [
      "Exchange Tower",
      "Level 1, 530 Little Collins Street",
      "Melbourne, VIC 3000",
    ],
    phones: ["+61 (3) 9909-7377", "+61 (2) 9004-8881"],
    email: "sales.au@espire.com",
  },
  {
    id: "auckland",
    region: "Auckland, New Zealand",
    company: "Espire Infolabs Ltd.",
    addressLines: [
      "5 Willowbank Close",
      "East Tamaki Heights",
      "Auckland, 2016",
    ],
    phones: ["+64 (21) 298-7593"],
    email: "sales.nz@espire.com",
  },
  {
    id: "amsterdam",
    region: "Amsterdam, Netherlands",
    company: "Espire Infolabs B.V.",
    addressLines: ["Gustav Mahlerplein 2, 1082 MA Amsterdam, The Netherlands"],
    email: "sales.nl@espire.com",
  },
  {
    id: "singapore",
    region: "Singapore",
    company: "Espire Infolabs (Singapore) Pte. Ltd.",
    addressLines: [
      "331, North Bridge Road, Odeon Towers, #22-01/06",
      "Singapore, 188720",
    ],
    phones: ["+65 9105-1061", "+65 6225-0418"],
    email: "sales.sg@espire.com",
  },
  {
    id: "kuala-lumpur",
    region: "Kuala Lumpur, Malaysia",
    company: "Espire Infolabs SDN. BHD.",
    addressLines: [
      "No. 7-1, Jalan 109F, Plaza Danau 2, Taman Danau Desa",
      "W.P. Kuala Lumpur, Malaysia - 58100",
    ],
    phones: ["+65 9105-1061", "+65 6225-0418"],
    email: "sales.my@espire.com",
  },
  {
    id: "makati",
    region: "Makati, Philippines",
    company: "Espire Infolabs Inc.",
    addressLines: [
      "Tower 6789, Level 16, Ayala Avenue",
      "Makati, 1206 Metro Manila, Philippines",
    ],
    phones: ["+632 8863 6859"],
    email: "sales.php@espire.com",
  },
  {
    id: "gurgaon",
    region: "Gurgaon, India",
    company: "Espire Infolabs Pvt. Ltd.",
    addressLines: [
      "486 & 487, Udyog Vihar Phase-III",
      "Gurgaon - 122016",
    ],
    phones: ["+91 (124) 717-3000", "+91 (124) 717-3001"],
    email: "enquiries@espire.com",
  },
  {
    id: "delhi",
    region: "Delhi, India",
    company: "Espire Infolabs Pvt. Ltd.",
    addressLines: [
      "A-41, Mohan Co-op Industrial Estate,",
      "Mathura Road, New Delhi - 110 044",
    ],
    phones: ["+91 (11) 7154-6500"],
    email: "enquiries@espire.com",
  },
];

export const contactDetails = {
  email: "enquiries@espire.com",
  indiaPhone: "+91 (124) 717-3000",
  usPhone: "+1 (201) 633-4723",
};

export const contactReasons = [
  "AI Strategy & Roadmap",
  "Solution Demo",
  "Partnership Inquiry",
  "Support",
  "General Inquiry",
];

const normalizePhoneHref = (phone) =>
  phone.replace(/[^\d+]/g, "").replace(/^\+0/, "+");

export const getOfficePhoneHref = (phone) => `tel:${normalizePhoneHref(phone)}`;
