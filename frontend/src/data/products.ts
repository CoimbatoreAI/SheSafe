import pepper from "@/assets/pepper-spray.jpg";
import alarm from "@/assets/safety-alarm.jpg";
import pen from "@/assets/tactical-pen.jpg";
import vest from "@/assets/safety-vest.jpg";
import awareness from "@/assets/awareness.jpg";
import type { Product } from "@/components/ProductCard";

export const safetyProducts: Product[] = [
  { 
    id: "pepper-spray", 
    title: "Shesafein Pepper Spray", 
    price: 499, 
    image: pepper, 
    rating: 4.8, 
    reviews: 214, 
    badge: "Bestseller", 
    description: "Compact, powerful and discreet — engineered for instant deployment. The flagship Shesafein protector trusted by thousands of women across India. Features a quick-release keychain and UV marking dye for suspect identification.",
    questions: [
      { q: "Is this legal to carry?", a: "Yes, pepper spray is legal for self-defense in India." },
      { q: "What is the range?", a: "It sprays up to 12 feet, keeping you at a safe distance from attackers." }
    ]
  },
  { 
    id: "safety-alarm", 
    title: "Personal Safety Alarm 130dB", 
    price: 699, 
    image: alarm, 
    rating: 4.7, 
    reviews: 132, 
    description: "A loud 130dB siren designed to draw immediate attention and deter threats. Simply pull the pin to activate.",
    questions: [
      { q: "How loud is 130dB?", a: "130dB is equivalent to a military jet aircraft take-off from 100 ft away. It is extremely loud and disorienting." }
    ]
  },
  { 
    id: "tactical-pen", 
    title: "Self-Defense Tactical Pen", 
    price: 899, 
    image: pen, 
    rating: 4.6, 
    reviews: 88, 
    description: "A multi-functional survival tool crafted from aerospace-grade aluminum. Functions as a premium writing instrument and features a glass breaker tip.",
    questions: [
      { q: "Can I take this on a plane?", a: "TSA guidelines vary, but generally tactical pens are not allowed in carry-on luggage." }
    ]
  }
];

export const referralProducts: Product[] = [
  { 
    id: "door-wedge", 
    title: "Portable Door Wedge Alarm", 
    price: 349, 
    image: vest, 
    rating: 4.5, 
    reviews: 54, 
    badge: "Amazon",
    affiliateUrl: "https://amazon.in",
    description: "Slip this under your hotel room door. If someone tries to open the door, it acts as a wedge and triggers a 120dB alarm.",
    questions: [
      { q: "Does it work on carpet?", a: "It works best on hard floors, but includes a non-slip pad that grips most tight carpets." }
    ]
  },
  { 
    id: "anti-theft-bag", 
    title: "Anti-Theft Crossbody Bag", 
    price: 2499, 
    image: vest, 
    rating: 4.9, 
    reviews: 312, 
    badge: "Flipkart",
    affiliateUrl: "https://flipkart.com",
    description: "Features hidden zippers, slash-proof fabric, and RFID blocking pockets to keep your valuables safe while commuting.",
    questions: [
      { q: "Is it waterproof?", a: "Yes, the exterior is made of highly water-resistant material." }
    ]
  },
  { 
    id: "gps-tracker", 
    title: "Smart SOS GPS Button", 
    price: 1299, 
    image: alarm, 
    rating: 4.4, 
    reviews: 95, 
    badge: "Meesho",
    affiliateUrl: "https://meesho.com",
    description: "A tiny, discreet button that connects to your phone via Bluetooth to instantly share your live location with 5 emergency contacts.",
    questions: [
      { q: "Does it require a subscription?", a: "No, the companion app is free to use forever." }
    ]
  }
];

export const awarenessSessions: Product[] = [
  { 
    id: "posh-corporate", 
    title: "Corporate POSH Training", 
    price: 15000, 
    image: awareness, 
    rating: 5.0, 
    reviews: 12, 
    badge: "Virtual/Offline",
    description: "Comprehensive Prevention of Sexual Harassment (POSH) awareness sessions tailored for corporate employees and management.",
    questions: [
      { q: "Is this certified?", a: "Yes, attendees receive a certificate of completion." },
      { q: "Can you conduct this offline?", a: "Yes, we offer both virtual and in-person sessions across major cities." }
    ]
  },
  { 
    id: "self-defense-workshop", 
    title: "Women's Self-Defense Workshop", 
    price: 2500, 
    image: awareness, 
    rating: 4.9, 
    reviews: 45, 
    badge: "Offline",
    description: "A 4-hour intensive hands-on workshop teaching fundamental self-defense techniques, situational awareness, and de-escalation.",
    questions: [
      { q: "Do I need prior martial arts experience?", a: "Not at least! This is designed for absolute beginners of all fitness levels." }
    ]
  },
  { 
    id: "school-awareness", 
    title: "School Safety & Awareness Seminar", 
    price: 8000, 
    image: awareness, 
    rating: 4.8, 
    reviews: 28, 
    badge: "Virtual/Offline",
    description: "Engaging seminars designed for high school and college students focusing on digital safety, consent, and personal boundaries.",
    questions: [
      { q: "What age group is this for?", a: "We tailor the content for groups aged 14-18 and 18-22." }
    ]
  }
];

// Helper to easily get all products or find by ID
export const allProducts = [...safetyProducts, ...referralProducts, ...awarenessSessions];
