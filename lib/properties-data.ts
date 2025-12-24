export interface Property {
  id: number
  name: string
  slug: string
  location: string
  size: string
  status: string
  minerals: string[]
  description: string
  overview: string
  geology: {
    summary: string
    mineralization: string[]
    alteration: string[]
    structures: string[]
  }
  highlights: {
    title: string
    description: string
    icon?: string
  }[]
  exploration: {
    history: string
    recent: string
    potential: string
  }
  images: {
    hero: string
    gallery: string[]
  }
  coordinates: [number, number]
}

export const properties: Property[] = [
  {
    id: 1,
    name: 'Gold Mountain',
    slug: 'gold-mountain',
    location: 'Red Mountain District, BC',
    size: 'Adjacent to Red Mountain deposit',
    status: 'High-Grade Discovery',
    minerals: ['Gold'],
    description: 'Quartz calcite veinlets occurring over a 200 by 300m area carry gold values from a few ppb to 0.632oz/ton.  The property adjoins Ascot Resources\' Red Mountain property to the southeast where gold and gold tellurides are found in various deposits such as the Marc zone (average grade 11.5 g/t gold).',
    overview: 'The Gold Mountain property represents a significant exploration opportunity in the Red Mountain district with historic sampling returning exceptional gold values up to 0.632 oz/t Au.',
    geology: {
      summary: 'Located within the Iskut River volcanic belt, characterized by Jurassic volcanic and sedimentary rocks with extensive hydrothermal alteration.',
      mineralization: [
        'Epithermal gold system',
        'Quartz vein hosted mineralization',
        'High-grade gold values up to 0.632 oz/t',
        'Multiple target zones identified',
      ],
      alteration: [
        'Silicification',
        'Sericite alteration',
        'Clay alteration zones',
      ],
      structures: [
        'Northwest trending structures',
        'Fault-controlled mineralization',
        'Multiple vein sets',
      ],
    },
    highlights: [
      {
        title: 'High-Grade Gold',
        description: 'Surface samples up to 0.632 oz/t Au',
      },
      {
        title: 'Strategic Location',
        description: 'Adjacent to Ascot Resources Red Mountain deposits',
      },
      {
        title: 'Multiple Targets',
        description: 'Several untested high-priority targets',
      },
    ],
    exploration: {
      history: 'Historic exploration has identified multiple gold-bearing zones with limited drilling.',
      recent: 'Recent work has focused on surface sampling and geological mapping.',
      potential: 'Significant potential for discovery of additional high-grade gold zones.',
    },
    images: {
      hero: '/images/properties/gold-mountain-hero.jpg',
      gallery: [
        '/images/properties/gold-mountain-1.jpg',
        '/images/properties/gold-mountain-2.jpg',
        '/images/properties/gold-mountain-3.jpg',
      ],
    },
    coordinates: [-130.15, 56.45] as [number, number],
  },
  {
    id: 2,
    name: 'Fiji',
    slug: 'fiji',
    location: 'Kitsault Valley Trend, BC',
    size: '1,250 hectares',
    status: 'High-Grade Gold Discovery',
    minerals: ['Gold', 'Silver'],
    description: 'Prospecting by Silver Grail-Teuton personnel in 2006 on the Fiji  identified two promising zones of high-grade, gold-bearing mineralization in an area lying just west, along regional trend,  of the common border with Dolly Varden Silver\'s Homestake Ridge property.',
    overview: 'High gold values have been found on surface in the northern part of the Fiji property within the northwest-trending Kitsault Valley Trend (as defined by Dolly Varden Silver, owner of the major property adjoining to the east). Five out of sixteen samples returned gold values higher than 11 g/t, ranging from 11.21 to 47.1 g/t gold. The Kitsault Valley trend begins in the Dolly Varden silver-bearing deposits to the south (Torbrit, Dolly Varden, Wolf, Moose, etc.) and continues northwest into and past the Homestake Ridge gold-silver deposit. Anomalous gold and silver soil and rock geochemistry has been found by Dolly Varden stretching northwest from the Homestake Ridge deposit to the common border between the Fiji property and the Homestake Ridge property. The high gold values found on the Fiji are just east of this common border on Fiji ground. Continuation of this trend is down a steep cliff to the north which remains to be sampled by mountaineering geologists. Further to the northwest, still in the Kitsault Valley Trend, ablation of snow and ice in recent years has exposed a strong, quartz-carbonate structure. This structure has the potential to carry silver-bearing shoots as found by recent drilling on Dolly Varden\'s Wolf vein. It has not yet been drill-tested.',
    geology: {
      summary: 'The Fiji property is situated within the northwest-trending Kitsault Valley Trend, a prolific mineralized corridor extending from the historic Dolly Varden silver deposits through to the Homestake Ridge gold-silver deposit. The property hosts high-grade gold mineralization discovered at surface, with recent glacial retreat exposing new targets.',
      mineralization: [
        'Five of sixteen samples returned >11 g/t Au (11.21 to 47.1 g/t)',
        'High-grade gold zone near Homestake Ridge property border',
        'Newly exposed quartz-carbonate structure from glacial retreat',
        'Potential for silver-bearing shoots similar to Wolf vein',
        'Anomalous gold-silver soil geochemistry across property',
      ],
      alteration: [
        'Quartz-carbonate veining',
        'Silicification associated with gold mineralization',
        'Alteration patterns consistent with Kitsault Valley Trend',
        'Fresh exposures from recent ice ablation',
      ],
      structures: [
        'Northwest-trending Kitsault Valley Trend',
        'Strong quartz-carbonate structure (recently exposed)',
        'Steep cliff face to north (unsampled)',
        'Structural continuity with Homestake Ridge deposit',
      ],
    },
    highlights: [
      {
        title: 'Exceptional Surface Grades',
        description: 'Five samples >11 g/t Au, including 47.1 g/t Au',
      },
      {
        title: 'Kitsault Valley Trend',
        description: 'Within prolific trend hosting Dolly Varden and Homestake Ridge deposits',
      },
      {
        title: 'New Discovery Potential',
        description: 'Recently exposed quartz-carbonate structure from glacial retreat',
      },
      {
        title: 'Strategic Location',
        description: 'Adjacent to Homestake Ridge property with anomalous geochemistry',
      },
      {
        title: 'Untested Targets',
        description: 'Steep cliff exposures require mountaineering access for sampling',
      },
      {
        title: 'Drill-Ready Structure',
        description: 'Exposed vein system has not yet been drill-tested',
      },
    ],
    exploration: {
      history: 'Surface sampling program identified exceptional high-grade gold values, with five of sixteen samples returning greater than 11 g/t gold. The property benefits from its position within the established Kitsault Valley Trend.',
      recent: 'Ablation of snow and ice in recent years has exposed a strong, quartz-carbonate structure with potential to carry silver-bearing shoots as found in nearby drilling on Dolly Varden\'s Wolf vein. This newly exposed structure has not yet been drill-tested.',
      potential: 'The property offers immediate drill targets at the recently exposed quartz-carbonate structure, plus additional potential along the continuation of high-grade mineralization down steep cliff faces to the north. The geological setting within the Kitsault Valley Trend and proximity to known deposits suggests excellent discovery potential.',
    },
    images: {
      hero: '/images/properties/fiji-hero.jpg',
      gallery: [
        '/images/properties/fiji-1.jpg',
        '/images/properties/fiji-2.jpg',
        '/images/properties/fiji-3.jpg',
      ],
    },
    coordinates: [-130.22, 56.35] as [number, number],
  },
  {
    id: 3,
    name: 'Midas',
    slug: 'midas',
    location: 'Stewart Mining Camp, BC',
    size: '950 hectares',
    status: 'VTEM Anomaly Target',
    minerals: ['Gold', 'Silver', 'Copper'],
    description: 'The Midas property lies along a favourable contact zone, south of the Del Norte property of Teuton Resources which hosts the high-grade gold and silver bearing "LG" vein along the same horizon.  Two prominent airborne VTEM anomalies remain to be tested on this property.',
    overview: 'The Midas property features two prominent airborne VTEM anomalies that remain untested. Located along a favorable contact zone south of Teuton\'s Del Norte property, which hosts the high-grade LG vein.',
    geology: {
      summary: 'The property covers a critical geological contact between Hazelton Group volcanics and Bowser Lake Group sediments, a setting known to host significant mineralization in the region.',
      mineralization: [
        'VTEM conductors indicate potential massive sulfide',
        'Contact-related mineralization potential',
        'Similar geological setting to LG vein',
        'Multiple untested geophysical targets',
      ],
      alteration: [
        'Regional propylitic alteration',
        'Contact metamorphism',
        'Hydrothermal alteration zones',
      ],
      structures: [
        'Major geological contact zone',
        'Cross-cutting structures',
        'Favorable structural preparation for mineralization',
      ],
    },
    highlights: [
      {
        title: 'Untested VTEM Anomalies',
        description: 'Two prominent conductors identified by airborne survey',
      },
      {
        title: 'Strategic Location',
        description: 'Adjacent to high-grade LG vein discovery',
      },
      {
        title: 'Favorable Geology',
        description: 'Located along critical geological contact',
      },
    ],
    exploration: {
      history: 'Limited historical work with recent airborne geophysics identifying key targets.',
      recent: 'VTEM survey has identified high-priority drill targets.',
      potential: 'Excellent potential for discovery with first-pass drilling of geophysical anomalies.',
    },
    images: {
      hero: '/images/properties/midas-hero.jpg',
      gallery: [
        '/images/properties/midas-1.jpg',
        '/images/properties/midas-2.jpg',
        '/images/properties/midas-3.jpg',
      ],
    },
    coordinates: [-130.12, 56.38] as [number, number],
  },
  {
    id: 4,
    name: 'Konkin Silver',
    slug: 'konkin-silver',
    location: 'Golden Triangle, BC',
    size: '2,150 hectares',
    status: 'Active Exploration',
    minerals: ['Silver', 'Gold', 'Copper', 'Barite'],
    description: 'Ross Sherlock, Ph.D. geologist,  reported that the Konkin Silver showing, with high grade silver in massive baritic zones, had similar geology to the Eskay Creek precious metal rich VMS deposit.',
    overview: 'The Konkin Silver property features extensive silver mineralization with at least five structures tested by trenching showing exceptional grades up to 36.27 oz/ton silver over 16.4 feet. A 2018 Geotech ZTEM survey identified two large anomalies (A-9 and A-10) in the eastern portion and a porphyry copper-gold target (P-3) in the west. The property shows geological similarities to the high-grade silver zones at the former Eskay Creek mine.',
    geology: {
      summary: 'The property hosts multiple silver-bearing structures within Hazelton Group volcanics, with mineralization controlled by NNW-striking faults. A network of barite veins exposed by recent glacial retreat suggests a possible white smoker environment similar to Eskay Creek. The ZTEM anomalies form a northerly-trending chain along a volcanic-sediment contact.',
      mineralization: [
        'High-grade silver in multiple structures (2.53 to 36.27 oz/ton)',
        'Barite-silver mineralization resembling white smoker deposits',
        'Structurally controlled veins over widths of 5.7 to 29.5 feet',
        'Associated gold and copper mineralization',
        'Five documented mineralized structures with consistent grades',
      ],
      alteration: [
        'Extensive barite veining exposed by glacial retreat',
        'Silicification associated with silver mineralization',
        'Propylitic alteration in volcanic host rocks',
        'Clay alteration along structural zones',
      ],
      structures: [
        'NNW-striking fault control on mineralization',
        'Multiple parallel vein systems',
        'ZTEM anomalies along volcanic-sediment contacts',
        'Structural continuity with LG Vein to the north',
      ],
    },
    highlights: [
      {
        title: 'Exceptional Silver Grades',
        description: 'Multiple structures with silver grades ranging from 2.53 to 36.27 oz/ton over significant widths',
      },
      {
        title: 'Large ZTEM Anomalies',
        description: 'Two major conductive anomalies (A-9 and A-10) extending over 2km, indicating deep mineralization potential',
      },
      {
        title: 'Eskay Creek Similarities',
        description: 'White smoker-style mineralization comparable to high-grade zones at the former Eskay Creek mine',
      },
      {
        title: 'Porphyry Target P-3',
        description: 'Western portion hosts identified porphyry copper-gold target from ZTEM survey',
      },
      {
        title: 'Glacial Retreat Opportunities',
        description: 'Newly exposed barite vein network below main showing presents untested targets',
      },
    ],
    exploration: {
      history: 'Historical trenching programs have tested five structures, with one short drill program completed. The 2018 Geotech ZTEM survey provided deep targeting information and identified multiple anomalies.',
      recent: 'Recent glacial retreat has exposed a previously hidden network of barite veins below the main Konkin Silver showing. These newly exposed veins remain unsampled and present immediate exploration targets.',
      potential: 'Significant potential exists for both high-grade silver vein expansion and discovery of deeper porphyry mineralization indicated by ZTEM anomalies. The structural continuity with the high-grade LG Vein to the north suggests a larger mineralized system.',
    },
    images: {
      hero: '/images/properties/konkin-silver-hero.jpg',
      gallery: [
        '/images/properties/konkin-silver-1.jpg',
        '/images/properties/konkin-silver-2.jpg',
        '/images/properties/konkin-silver-3.jpg',
      ],
    },
    coordinates: [-130.25, 56.42] as [number, number],
  },
  {
    id: 5,
    name: 'Clone',
    slug: 'clone',
    location: 'Golden Triangle, BC - 16km NW of Surebet',
    size: '1,875 hectares',
    status: 'Advanced Exploration',
    minerals: ['Gold', 'Cobalt', 'Copper', 'Silver'],
    description: 'Two zones of interest occur on the property.  The first, the Main zone, features of a number of very high-grade gold and gold-cobalt bearing shear zones (100 tons grading 4.0 oz/ton gold was bulk sampled here).  In recent years focus has changed to a southwest zone which appears to lie above a reduced porphyry system, the upper portions of which are anomalous in copper, molybdenum, tungsten, bismuth and gold.  This latter area is transected by Kyba\'s "Red Line".',
    overview: 'The Clone property is situated 16km northwest of Goliath Resources\' Surebet discovery, with mineralization occurring near Kyba\'s "Red Line" - a critical marker for large-scale deposits in the Golden Triangle. High-grade gold-bearing shear zones discovered in 1995 triggered a staking rush and ultimately attracted $2.6 million investment from Prime Resources-Homestake Canada. The Main Zone has yielded exceptional bulk sample grades including 137.1 g/t gold (4.0 oz/ton) from a 102-ton sample in 2011.',
    geology: {
      summary: 'High-grade gold and gold-cobalt mineralization occurs within a series of sub-parallel shears exposed over 500m strike length and 130m vertical range. The property hosts both high-grade vein systems and potential porphyry mineralization at depth, with the Main Zone situated at the southeastern end of a 3km long package of volcanic and sedimentary rocks.',
      mineralization: [
        'High-grade gold in shear zones up to 3.59 oz/ton over 5.5m',
        'Gold-cobalt association in southeast portion (1.53 oz/ton Au, 0.33% Co)',
        'H-1 structure with consistent high-grade shoots',
        'Bulk sample grades of 68.65 g/t to 137.1 g/t gold',
        'Copper mineralization near Red Line indicating possible porphyry at depth',
        'Cross-cutting structures with gold values to 63 g/t',
      ],
      alteration: [
        'Silicification in shear zones',
        'Sericite alteration envelopes',
        'Chlorite-carbonate alteration in volcanic hosts',
        'Potassic alteration associated with felsic dykes',
      ],
      structures: [
        'Multiple sub-parallel shear zones over 500m strike',
        'H-1 structure - primary high-grade host',
        'S-2A structure with gold-cobalt mineralization',
        'Proximity to regional Red Line marker horizon',
        'Cross-cutting structures with high-grade gold',
      ],
    },
    highlights: [
      {
        title: 'Exceptional Bulk Sample Grades',
        description: '102-ton bulk sample graded 137.1 g/t gold (4.0 oz/ton) in 2011',
      },
      {
        title: '$7 Million Historic Investment',
        description: 'Significant exploration investment including drilling and bulk sampling programs',
      },
      {
        title: 'Red Line Proximity',
        description: 'Located along Kyba\'s Red Line, a critical marker for major Golden Triangle deposits',
      },
      {
        title: 'Multiple High-Grade Zones',
        description: 'H-1 zone with 32.9 feet @ 1.28 oz/ton gold; S-2A with 19.7 feet @ 1.53 oz/ton gold',
      },
      {
        title: 'Porphyry Potential',
        description: 'New copper-gold-molybdenum zone 500m southwest suggests porphyry system at depth',
      },
      {
        title: 'Strategic Location',
        description: '16km from Goliath\'s Surebet discovery in active exploration district',
      },
    ],
    exploration: {
      history: 'Discovered in 1995, the property attracted immediate attention with $2.6 million investment from Prime Resources-Homestake Canada. Drilling from 1995-97 defined several high-grade gold shoots, followed by successful bulk sampling programs in 2010-2011. Approximately $7 million has been invested to date.',
      recent: 'Recent work (2003-2004) identified a new copper-gold zone 500m southwest of the Main Zone, interpreted as the distal expression of a possible porphyry system. Anomalous molybdenum, bismuth, and tungsten values support this interpretation.',
      potential: 'An IP survey scheduled for September 2025 will test for deeper porphyry mineralization. Significant potential remains for expanding known high-grade zones and discovering the interpreted porphyry source. The property\'s position along the Red Line and proximity to recent discoveries enhances its prospectivity.',
    },
    images: {
      hero: '/images/properties/clone-hero.jpg',
      gallery: [
        '/images/properties/clone-1.jpg',
        '/images/properties/clone-2.jpg',
        '/images/properties/clone-3.jpg',
      ],
    },
    coordinates: [-130.31, 56.48] as [number, number],
  },
  {
    id: 6,
    name: 'Tonga',
    slug: 'tonga',
    location: 'Golden Triangle, BC',
    size: '800 hectares',
    status: 'Early Stage Exploration',
    minerals: ['Silver', 'Gold'],
    description: 'Staked in the 1980\'s because of highly anomalous silver stream geochemistry.  High-grade silver and gold bearing float discovered in streams.  Situated between Dolly Varden Silver\'s Kombi gold-silver target and Goliath Resources\' Gold Swarm showing.',
    overview: 'Staked in the 1980\'s because of highly anomalous silver stream geochemistry.  High-grade silver and gold bearing float discovered in streams.  Situated between Dolly Varden Silver\'s Kombi gold-silver target and Goliath Resources\' Gold Swarm showing.',
    geology: {
      summary: 'The Tonga property was staked based on highly anomalous silver stream geochemistry discovered in the 1980s. The property is strategically positioned between two significant discoveries - Dolly Varden Silver\'s Kombi gold-silver target and Goliath Resources\' Gold Swarm showing.',
      mineralization: [
        'Highly anomalous silver in stream sediments',
        'High-grade silver and gold bearing float in streams',
        'Strategic position between known mineralized zones',
        'Untested source of stream anomalies',
      ],
      alteration: [
        'Stream geochemistry indicates upstream source',
        'Float samples suggest proximal mineralization',
        'Alteration patterns to be determined',
      ],
      structures: [
        'Located between Kombi and Gold Swarm targets',
        'Regional structural trends favorable',
        'Source structures remain to be identified',
      ],
    },
    highlights: [
      {
        title: 'Stream Anomalies',
        description: 'Highly anomalous silver stream geochemistry',
      },
      {
        title: 'High-Grade Float',
        description: 'Silver and gold bearing float discovered in streams',
      },
      {
        title: 'Strategic Location',
        description: 'Between Dolly Varden\'s Kombi and Goliath\'s Gold Swarm',
      },
      {
        title: 'Untested Potential',
        description: 'Source of stream anomalies remains to be discovered',
      },
    ],
    exploration: {
      history: 'Property was staked in the 1980s following the discovery of highly anomalous silver stream geochemistry. High-grade silver and gold bearing float has been discovered in streams, indicating a nearby source.',
      recent: 'The property remains at an early exploration stage with the source of the stream anomalies yet to be discovered.',
      potential: 'Excellent potential exists for discovering the bedrock source of the high-grade float and stream anomalies. The property\'s position between the Kombi gold-silver target and Gold Swarm showing enhances its prospectivity.',
    },
    images: {
      hero: '/images/properties/tonga-hero.jpg',
      gallery: [
        '/images/properties/tonga-1.jpg',
        '/images/properties/tonga-2.jpg',
        '/images/properties/tonga-3.jpg',
      ],
    },
    coordinates: [-130.28, 56.40] as [number, number],
  },
]