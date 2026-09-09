// Faceless tailoring photography used across STITCH.
// These images intentionally focus on mannequins, garments, hands, tools,
// fabric and atelier details so the website stays elegant without visible faces.

const pexels = (id, width = 1800) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${width}`;

// Wide, balanced atelier image used as a dependable fallback.
export const fallbackImage = '/images/fallback-tailoring.svg';

// Core faceless images
const heroMannequins = pexels(6766385);        // three complete mannequins in atelier
const bespokeMannequin = pexels(6764954);     // complete black suit on tailor dummy
const bespokeFitting = pexels(6766284);       // tailor measuring a suit lapel on mannequin
const measuringMannequin = pexels(6765655);   // tailor working on mannequin
const cuttingHands = pexels(6461097);         // hands cutting black fabric
const sewingHands = pexels(5830689);          // hands sewing on machine
const handFinishing = pexels(8483980);         // hands marking / finishing garment
const fabricAtelier = pexels(3965543);         // fabric rolls and patterns, no people
const pressingHands = pexels(10558201);        // hands steaming / pressing shirt
const weddingHangingSuit = pexels(31517344);   // wedding suit hanging outdoors, no people
const weddingNavyDetail = pexels(9965914);     // navy wedding jacket / boutonniere, no face
const weddingTuxedo = pexels(16213982);        // tuxedo on mannequin
const beigeWeddingSuit = pexels(34457990);     // beige wedding suit hanging, no people
const whiteFormalSuit = pexels(13077053);      // white suit hanging, no people
const whiteShirt = pexels(9889565);            // white shirt hanging, no people

const heritageDaura =
  'https://upload.wikimedia.org/wikipedia/commons/6/6a/National_dress%2C_Nepalese_%28AM_2015.99.1-5%29.jpg';

export const images = {
  // Homepage hero — wide landscape composition so the full tailoring scene reads better.
  hero: heroMannequins,
  heroAlt: 'Three tailored garments displayed on mannequins inside a bespoke tailoring studio',

  // Bespoke / general tailoring
  consultation: fabricAtelier,
  consultationAlt: 'Fabric rolls, patterns and tailoring materials inside an atelier',

  fitting: bespokeMannequin,
  fittingAlt: 'Complete bespoke suit displayed on a tailor mannequin',

  measuring: measuringMannequin,
  measuringAlt: 'Tailor adjusting and measuring a suit on a mannequin',

  handwork: handFinishing,
  handworkAlt: 'Close-up of hands marking and finishing fabric',

  cutting: cuttingHands,
  cuttingAlt: 'Close-up of hands cutting black tailoring fabric with scissors',

  fabric_detail: fabricAtelier,
  fabricDetailAlt: 'Fabric rolls and sewing patterns in a tailoring studio',

  pattern: handFinishing,
  patternAlt: 'Hands preparing and marking a tailoring pattern',

  buttons: weddingNavyDetail,
  buttonsAlt: 'Close-up of tailored jacket lapel and boutonniere detail',

  // Wedding — all faceless / garment-only
  wedding_hero: weddingHangingSuit,
  weddingHeroAlt: 'Elegant wedding suit hanging outdoors with no person visible',

  wedding_detail: weddingNavyDetail,
  weddingDetailAlt: 'Navy tailored wedding jacket with boutonniere detail',

  // Story / atelier
  studio: fabricAtelier,
  studioAlt: 'Tailoring atelier filled with fabric rolls and patterns',

  atelier: fabricAtelier,
  atelierAlt: 'Quiet tailoring atelier with fabrics and work materials',

  workspace: cuttingHands,
  workspaceAlt: 'Tailoring workbench with hands cutting fabric',

  wool_texture: fabricAtelier,
  woolTextureAlt: 'Selection of tailoring fabrics in an atelier',

  linen: fabricAtelier,
  linenAlt: 'Natural fabrics stored in a tailoring atelier',

  fabric_rolls: fabricAtelier,
  fabricRollsAlt: 'Fabric rolls inside a tailoring studio',

  // Formal garments used in cards
  navy_suit: weddingNavyDetail,
  navySuitAlt: 'Navy formal wedding suit detail without a visible face',

  grey_suit: heroMannequins,
  greySuitAlt: 'Tailored suits displayed on mannequins',

  tuxedo: weddingTuxedo,
  tuxedoAlt: 'Wedding tuxedo displayed on a mannequin',

  blazer: beigeWeddingSuit,
  blazerAlt: 'Elegant beige tailored suit hanging in an atrium',

  shirt_detail: whiteShirt,
  shirtDetailAlt: 'White tailored shirt hanging neatly',

  consultation_room: fabricAtelier,
  consultationRoomAlt: 'Tailoring atelier prepared for a fabric consultation',

  measuring_tape: measuringMannequin,
  measuringTapeAlt: 'Tailor measuring a garment on a mannequin',

  pressing: pressingHands,
  pressingAlt: 'Hands steaming and pressing a white shirt',

  heritage: heritageDaura,
  heritageAlt: 'Museum display of a complete Nepali Daura Suruwal set',

  team: sewingHands,
  teamAlt: 'Close-up of hands sewing fabric in a tailoring workshop',

  white_formal: whiteFormalSuit,
  whiteFormalAlt: 'White formal wedding suit hanging with no person visible',

  story_feature: heroMannequins,
  storyFeatureAlt: 'Tailored garments displayed on mannequins in an atelier',

  bespoke_feature: bespokeFitting,
  bespokeFeatureAlt: 'Tailor measuring the lapel of a bespoke suit on a mannequin during a fitting',

  craft_feature: cuttingHands,
  craftFeatureAlt: 'Hands cutting tailoring fabric with precision',

};

export const galleries = {
  atelier: [
    { src: cuttingHands, alt: 'Hands cutting tailoring fabric', label: 'Cutting' },
    { src: bespokeMannequin, alt: 'Complete suit on a tailor mannequin', label: 'Fitting' },
    { src: fabricAtelier, alt: 'Fabric rolls inside the atelier', label: 'Fabrics' },
    { src: heroMannequins, alt: 'Tailored garments displayed on mannequins', label: 'Suits' },
    { src: sewingHands, alt: 'Hands sewing a garment on a machine', label: 'Stitching' },
    { src: fabricAtelier, alt: 'Tailoring studio with fabrics and patterns', label: 'Studio' },
  ],

  craftsmanship: [
    { src: handFinishing, alt: 'Hands marking and finishing a garment', label: 'Hand Finishing' },
    { src: weddingNavyDetail, alt: 'Tailored jacket detail', label: 'Button Details' },
    { src: cuttingHands, alt: 'Hands cutting fabric with scissors', label: 'Pattern Cutting' },
    { src: pressingHands, alt: 'Hands steaming and pressing a shirt', label: 'Pressing' },
  ],
};
