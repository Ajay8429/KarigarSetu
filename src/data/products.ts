import { Product } from '../types';

export const products: Product[] = [
  {
    id: 'wood-frame',
    name: 'Carved Photo Frame',
    category: 'Home Decor',
    price: 799,
    image: '/src/assets/images/product_carved_frame_1792925323111.jpg',
    desc: 'Hand-carved solid Sheesham wooden frame with traditional floral vine motifs for treasured family memories.',
    artisan: 'Master Mohammad Rashid',
    artisanVillage: 'Mohalla Saraian, Saharanpur',
    woodType: 'Seasoned Indian Rosewood (Sheesham)',
    dimensions: '10" x 8" (Holds 5" x 7" Photo)',
    finish: 'Warm Honey Wax Polish',
    weight: '620 grams',
    inStock: true,
    leadTime: '3 - 5 business days',
    features: [
      'Hand-carved floral border with deep relief',
      'Solid Sheesham wood backing with brass stand',
      'Treated against termites and seasoned for long life'
    ]
  },
  {
    id: 'jewel-box',
    name: 'Wooden Jewellery Box',
    category: 'Gifts',
    price: 1199,
    image: '/src/assets/images/product_jewellery_box_1792925323651.jpg',
    desc: 'Ornate handcrafted keepsake box adorned with delicate hand-beaten brass wire inlay and emerald velvet lining.',
    artisan: 'Ustad Irfan Ansari',
    artisanVillage: 'Qutub Sher, Saharanpur',
    woodType: 'Sheesham Wood with Brass Tarkashi Inlay',
    dimensions: '8" L x 5" W x 3.5" H',
    finish: 'Dark Walnut Semi-Gloss Polish',
    weight: '850 grams',
    inStock: true,
    leadTime: '4 - 6 business days',
    features: [
      'Authentic Tarkashi (fine brass wire hammering)',
      'Plush green emerald velvet compartment lining',
      'Solid antique-finish brass latch and corner accents'
    ]
  },
  {
    id: 'wall-panel',
    name: 'Decorative Wall Panel',
    category: 'Home Decor',
    price: 2499,
    image: '/src/assets/images/product_wall_panel_1792925323990.jpg',
    desc: 'Traditional pierced Jali lattice carved panel featuring geometric star mandalas for living rooms and prayer alcoves.',
    artisan: 'Master Abdul Sattar',
    artisanVillage: 'Chilkana Road, Saharanpur',
    woodType: 'Hard Teak & Seasoned Mango Wood',
    dimensions: '24" H x 14" W x 1.25" Depth',
    finish: 'Natural Matte Teak Wax',
    weight: '1.9 kg',
    inStock: true,
    leadTime: '5 - 7 business days',
    features: [
      'Intricate openwork Jali carving creates dramatic light play',
      'Reinforced frame joints with pre-installed heavy-duty hangers',
      'Sustainably harvested wood with zero chemical bleaching'
    ]
  },
  {
    id: 'side-table',
    name: 'Handcrafted Side Table',
    category: 'Furniture',
    price: 3499,
    image: '/src/assets/images/product_side_table_1792925324555.jpg',
    desc: 'Sturdy Sheesham wood accent table featuring hand-carved floral rosette tabletop and graceful cabriole legs.',
    artisan: 'Rameshwar Sharma & Sons',
    artisanVillage: 'Pansari Bazar, Saharanpur',
    woodType: 'Pure Sheesham (Dalbergia sissoo)',
    dimensions: '18" Diameter x 21" Height',
    finish: 'Warm Amber Hand-Rubbed Lacquer',
    weight: '4.8 kg',
    inStock: true,
    leadTime: '7 - 10 business days',
    features: [
      'Full circular rosette medallion hand-chiseled on top',
      'Tool-free threaded leg assembly (easy setup)',
      'Supports up to 45 kg weight capacity'
    ]
  },
  {
    id: 'table-lamp',
    name: 'Wooden Table Lamp',
    category: 'Lighting',
    price: 1899,
    image: '/src/assets/images/product_wooden_lamp_1792925325796.jpg',
    desc: 'Turned wooden baluster lamp base paired with textured natural oatmeal linen drum shade for soothing illumination.',
    artisan: 'Farhan Qureshi',
    artisanVillage: 'Nakur, Saharanpur',
    woodType: 'Turned Seasoned Mango Wood',
    dimensions: '7" Base Dia x 19" Total Height',
    finish: 'Rustic Natural Woodgrain Polish',
    weight: '1.4 kg',
    inStock: true,
    leadTime: '3 - 5 business days',
    features: [
      'Standard Indian B22/E27 brass bulb socket with braided cord',
      'Weighted base prevents tipping',
      'Includes premium handloom oatmeal linen lampshade'
    ]
  },
  {
    id: 'keepsake-box',
    name: 'Carved Keepsake Box',
    category: 'Gifts',
    price: 999,
    image: '/src/assets/images/product_keepsake_box_1792925325625.jpg',
    desc: 'Arch-lid heirloom chest with embossed brass clasp and hand-chiseled mandala medallion on the cover.',
    artisan: 'Master Mohammad Rashid',
    artisanVillage: 'Mohalla Saraian, Saharanpur',
    woodType: 'Solid Sheesham Hardwood',
    dimensions: '7.5" L x 4.5" W x 4.2" H',
    finish: 'Antique Rosewood Satin Polish',
    weight: '720 grams',
    inStock: true,
    leadTime: '3 - 5 business days',
    features: [
      'Dome-shaped hinged chest lid with brass lock latch',
      'Ideal for letters, keepsakes, watches, and heirloom treasures',
      'Hand-buffed edges with natural beeswax coating'
    ]
  },
  {
    id: 'white-vintage-wardrobe',
    name: 'Classic Two-Door Wooden Armoire',
    category: 'Furniture',
    price: 28999,
    image: '/assets/aistudio/images__6__c948c683.jpg',
    desc: 'Tall solid hardwood two-door wardrobe finished in satin ivory white with fluted pilasters, crown moulding, and twin bottom drawers.',
    artisan: 'Rameshwar Sharma & Sons',
    artisanVillage: 'Pansari Bazar, Saharanpur',
    woodType: 'Kiln-Dried Mango & Sheesham Hardwood',
    dimensions: '78" H x 42" W x 22" D',
    finish: 'Satin Ivory Matte Enamel',
    weight: '68 kg',
    inStock: true,
    leadTime: '12 - 15 business days',
    features: [
      'Full-length hanging section with adjustable interior shelving',
      'Two deep lower storage drawers with solid brass knobs',
      'Traditional mortise-and-tenon frame with turned bun feet'
    ]
  },
  {
    id: 'sheesham-kitchen-utensils',
    name: 'Sheesham Kitchen Utensil Set',
    category: 'Kitchen & Dining',
    price: 699,
    image: '/assets/aistudio/images__2__a73d32c1.jpg',
    desc: 'Four-piece hand-carved cooking spoon and spatula set including ladle, slotted turner, perforated skimmer, and flat spatula.',
    artisan: 'Farhan Qureshi',
    artisanVillage: 'Nakur, Saharanpur',
    woodType: 'Food-Safe Seasoned Sheesham Wood',
    dimensions: '12" - 14" Length Each (Set of 4)',
    finish: 'Food-Grade Cold-Pressed Mustard & Beeswax Oil',
    weight: '420 grams',
    inStock: true,
    leadTime: '2 - 4 business days',
    features: [
      'Safe for non-stick, cast iron, and stainless cookware',
      'Zero chemical lacquer or synthetic varnish',
      'Pre-drilled hanging holes on ergonomic long handles'
    ]
  },
  {
    id: 'three-door-mirror-wardrobe',
    name: 'Three-Door Mirror Wardrobe',
    category: 'Furniture',
    price: 32499,
    image: '/assets/aistudio/images__7__ba3e76dc.jpg',
    desc: 'Spacious dark walnut grain three-door almirah featuring a full-length dressing mirror, upper loft storage, and lockable drawer.',
    artisan: 'Rameshwar Sharma & Sons',
    artisanVillage: 'Pansari Bazar, Saharanpur',
    woodType: 'Seasoned Hardwood & Walnut Veneer',
    dimensions: '84" H x 54" W x 21" D',
    finish: 'Rich Dark Walnut Woodgrain',
    weight: '85 kg',
    inStock: true,
    leadTime: '14 - 18 business days',
    features: [
      'Integrated full-height beveled dressing mirror on right door',
      'Dedicated upper loft compartment for seasonal bedding',
      'Brushed steel handles with individual key locks'
    ]
  },
  {
    id: 'cane-rocking-chair',
    name: 'Cane-Back Wooden Rocking Chair',
    category: 'Furniture',
    price: 14999,
    image: '/assets/aistudio/images__8__5bf4dd0a.jpg',
    desc: 'Heirloom teak rocking chair featuring hand-woven cane backrest, vertical spindle slats, and upholstered seat & bolster cushions.',
    artisan: 'Rameshwar Sharma & Sons',
    artisanVillage: 'Pansari Bazar, Saharanpur',
    woodType: 'Solid Seasoned Teak & Natural Rattan Cane',
    dimensions: '41" H x 26" W x 34" D',
    finish: 'Warm Chestnut Satin Polish',
    weight: '16.5 kg',
    inStock: true,
    leadTime: '10 - 12 business days',
    features: [
      'Breathable hand-plaited natural rattan cane headrest panel',
      'Smoothly curved rocker runners balanced for effortless motion',
      'Includes removable cotton-linen seat and striped lumbar pillow'
    ]
  },
  {
    id: 'carved-mandala-door',
    name: 'Carved Mandala Wooden Door',
    category: 'Doors & Timber',
    price: 22999,
    image: '/assets/aistudio/images__23__38123214.jpg',
    desc: 'Architectural solid teak entrance door carved with flowing sculptural relief waves and intricate central circular mandala rosettes.',
    artisan: 'Master Abdul Sattar',
    artisanVillage: 'Chilkana Road, Saharanpur',
    woodType: 'Seasoned Burma & Sagwan Teak',
    dimensions: '81" H x 36" W x 1.75" Thickness',
    finish: 'Natural Honey Teak Oil Finish',
    weight: '42 kg',
    inStock: true,
    leadTime: '14 - 20 business days',
    features: [
      'Deep 3D hand-chiseled radial rosette medallions',
      'Double-rail mortise joinery built for exterior entrances',
      'Custom sizing available on booking confirmation'
    ]
  },
  {
    id: 'spindle-dining-chair',
    name: 'Spindle-Back Wooden Chair',
    category: 'Furniture',
    price: 5499,
    image: '/assets/aistudio/images__11__6f207eab.jpg',
    desc: 'Timeless Windsor-inspired solid wood dining chair with turned spindle backrest, contoured saddle seat, and splayed legs.',
    artisan: 'Farhan Qureshi',
    artisanVillage: 'Nakur, Saharanpur',
    woodType: 'Solid Seasoned Sheesham Wood',
    dimensions: '35" H x 18.5" W x 19" D (18" Seat Height)',
    finish: 'Clear Natural Satin Wood Seal',
    weight: '6.8 kg',
    inStock: true,
    leadTime: '6 - 8 business days',
    features: [
      'Ergonomically curved crest rail and scooped solid seat',
      'H-stretcher underframe for lifelong structural rigidity',
      'Ideal for dining tables, reading nooks, and study desks'
    ]
  },
  {
    id: 'sheesham-square-stool',
    name: 'Solid Sheesham Square Stool',
    category: 'Furniture',
    price: 1699,
    image: '/assets/aistudio/images__16__0c604872.jpg',
    desc: 'Compact heavy-duty multipurpose wooden stool with planked solid Sheesham top and reinforced cross-stretcher legs.',
    artisan: 'Rameshwar Sharma & Sons',
    artisanVillage: 'Pansari Bazar, Saharanpur',
    woodType: '100% Solid Sheesham (Indian Rosewood)',
    dimensions: '14" L x 14" W x 18" H',
    finish: 'Deep Mahogany Wax Polish',
    weight: '4.5 kg',
    inStock: true,
    leadTime: '3 - 5 business days',
    features: [
      'Thick 1.25-inch solid wood seat showcases natural grain',
      'Lower perimeter stretchers double as comfortable footrests',
      'Supports up to 120 kg load capacity'
    ]
  },
  {
    id: 'oak-wooden-barrel',
    name: 'Handcrafted Oak Wooden Barrel',
    category: 'Home Decor',
    price: 7499,
    image: '/assets/aistudio/images__21__edd29dfc.jpg',
    desc: 'Traditional coopered hardwood barrel bound with heavy galvanized steel hoops and wooden bung, suited for aging or rustic decor.',
    artisan: 'Ustad Irfan Ansari',
    artisanVillage: 'Qutub Sher, Saharanpur',
    woodType: 'Seasoned Hardwood Staves & Steel Hoops',
    dimensions: '28" Length x 20" Belly Diameter',
    finish: 'Raw Toasted Wood & Brushed Steel',
    weight: '22 kg',
    inStock: true,
    leadTime: '7 - 10 business days',
    features: [
      'Precision-fitted beveled staves with six riveted iron hoops',
      'Suitable for beverage aging, cellar display, or bistro table base',
      'Includes solid wooden bung stopper'
    ]
  },
  {
    id: 'hardwood-timber-panels',
    name: 'Seasoned Hardwood Boards & Panels',
    category: 'Doors & Timber',
    price: 2199,
    image: '/assets/aistudio/images__24__281c8be2.jpg',
    desc: 'Precision-planed veneered hardwood boards and craft timber sheets in walnut, teak, and rosewood grains for cabinetry and decor.',
    artisan: 'Master Abdul Sattar',
    artisanVillage: 'Chilkana Road, Saharanpur',
    woodType: 'Assorted Teak, Walnut & Sheesham Ply/Timber',
    dimensions: '48" x 24" x 0.75" (19mm) Standard Sheet',
    finish: 'Sanded Raw Ready-to-Polish Surface',
    weight: '9.2 kg',
    inStock: true,
    leadTime: '4 - 6 business days',
    features: [
      'Kiln-seasoned to resist moisture bending and borer attack',
      'Smooth calibrated thickness for furniture makers and DIY carpentry',
      'Available in multi-grain walnut, ebony, and honey teak tones'
    ]
  },
  {
    id: 'carved-lotus-teak-door',
    name: 'Carved Lotus Teak Wood Door',
    category: 'Doors & Timber',
    price: 26499,
    image: '/assets/aistudio/images__26__aa6b310a.jpg',
    desc: 'Grand solid teak main door hand-carved with an ascending lotus blossom, curling botanical vines, and beaded floral medallions.',
    artisan: 'Master Mohammad Rashid',
    artisanVillage: 'Mohalla Saraian, Saharanpur',
    woodType: 'Grade-A Seasoned Sagwan Teak Wood',
    dimensions: '84" H x 38" W x 1.75" Thickness',
    finish: 'Hand-Rubbed Golden Teak Lacquer',
    weight: '46 kg',
    inStock: true,
    leadTime: '15 - 21 business days',
    features: [
      'Full-height auspicious lotus and vine relief carving',
      'Weather-resistant outdoor sealant for main entrance durability',
      'Hand-chiseled textured backdrop with raised molded frame'
    ]
  }
];

export const formatINR = (val: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(val);
};
