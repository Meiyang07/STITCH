export const collectionFilters = ['All', 'Business', 'Wedding', 'Formal', 'Traditional', 'Accessories', 'Ready-Made'];
export const genderFilters = ['All', 'Men', 'Women'];

export const collections = [
  {
    id: 1,
    slug: 'midnight-bespoke-suit',
    name: 'Midnight Bespoke Suit',
    shortName: 'Bespoke Suits',
    category: 'Business',
    type: 'Suits',
    gender: 'Men',
    price: 24500,
    image: '/images/collections/midnight-bespoke-suit.jpg',
    gallery: [
      '/images/collections/midnight-bespoke-suit.jpg',
      '/images/collections/product-details/midnight-bespoke-suit-1.jpg',
      '/images/collections/product-details/midnight-bespoke-suit-2.jpg'
    ],
    description: 'A clean two-piece silhouette tailored around posture and daily movement.',
    fabrics: ['Super 120s Wool', 'Wool–Cashmere', 'Tropical Wool'],
    colors: ['Midnight', 'Charcoal', 'Deep Navy'],
    features: ['Personal paper pattern', 'Half or full canvas', 'Hand-finished details', 'Two fitting stages'],
    completion: '4–6 weeks'
  },
  {
    id: 2,
    slug: 'ivory-wedding-three-piece',
    name: 'Ivory Wedding Three-Piece',
    shortName: 'Wedding',
    category: 'Wedding',
    type: 'Wedding',
    gender: 'Men',
    price: 32000,
    image: '/images/collections/ivory-wedding-three-piece.jpg',
    gallery: [
      '/images/collections/ivory-wedding-three-piece.jpg',
      '/images/collections/product-details/ivory-wedding-three-piece-1.jpg',
      '/images/collections/product-details/ivory-wedding-three-piece-2.jpg'
    ],
    description: 'A refined wedding composition designed for ceremony, photography and comfort.',
    fabrics: ['Merino Wool', 'Silk Blend', 'Textured Wool'],
    colors: ['Ivory', 'Stone', 'Champagne'],
    features: ['Wedding styling consultation', 'Custom waistcoat', 'Personal monogram', 'Final-week fitting'],
    completion: '6–8 weeks'
  },
  {
    id: 3,
    slug: 'black-tie-tuxedo',
    name: 'Black Tie Tuxedo',
    shortName: 'Tuxedos',
    category: 'Formal',
    type: 'Tuxedos',
    gender: 'Men',
    price: 29500,
    image: 'https://m.media-amazon.com/images/I/311yVyTUJUL._SL500_.jpg',
    gallery: ['https://m.media-amazon.com/images/I/311yVyTUJUL._SL500_.jpg'],
    description: 'Classic black-tie tailoring with satin facings and precise evening proportions.',
    fabrics: ['Barathea Wool', 'Mohair Blend'],
    colors: ['Black', 'Midnight Blue'],
    features: ['Peak or shawl lapel', 'Satin detailing', 'Trouser side braid', 'Hand-finished buttonholes'],
    completion: '4–6 weeks'
  },
  {
    id: 4,
    slug: 'soft-shoulder-blazer',
    name: 'Soft Shoulder Blazer',
    shortName: 'Blazers',
    category: 'Business',
    type: 'Blazers',
    gender: 'Men',
    price: 18500,
    image: 'https://thernlunds.se/cdn/shop/files/3_41aef6d9-a27e-4fc3-b874-7944acacc87c.png?v=1722859471&width=2048',
    gallery: ['https://thernlunds.se/cdn/shop/files/3_41aef6d9-a27e-4fc3-b874-7944acacc87c.png?v=1722859471&width=2048'],
    description: 'Relaxed tailoring for smart everyday dressing. Lighter internal construction.',
    fabrics: ['Hopsack Wool', 'Linen Blend', 'Cotton Twill'],
    colors: ['Navy', 'Olive', 'Camel'],
    features: ['Soft shoulder', 'Patch pocket option', 'Quarter lining', 'Natural drape'],
    completion: '3–5 weeks'
  },
  {
    id: 5,
    slug: 'signature-white-shirt',
    name: 'Signature White Shirt',
    shortName: 'Shirts',
    category: 'Formal',
    type: 'Shirts',
    gender: 'Men',
    price: 6500,
    image: 'https://cdn.vipavenue.ru/products/610001_615000/611881/compress/04934793ccac105a6dd25ddfe5547616.webp',
    gallery: ['https://cdn.vipavenue.ru/products/610001_615000/611881/compress/04934793ccac105a6dd25ddfe5547616.webp'],
    description: 'A crisp custom shirt built from individual collar, cuff and body measurements.',
    fabrics: ['Egyptian Cotton', 'Oxford Cotton', 'Poplin'],
    colors: ['White', 'Sky', 'Ecru'],
    features: ['Collar customization', 'Cuff customization', 'Monogram option', 'Split yoke'],
    completion: '2–3 weeks'
  },
  {
    id: 6,
    slug: 'heritage-daura-suruwal',
    name: 'Heritage Daura Suruwal',
    shortName: 'Traditional',
    category: 'Traditional',
    type: 'Traditional Wear',
    gender: 'Men',
    price: 22000,
    image: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/National_dress%2C_Nepalese_%28AM_2015.99.1-5%29.jpg',
    gallery: ['https://upload.wikimedia.org/wikipedia/commons/6/6a/National_dress%2C_Nepalese_%28AM_2015.99.1-5%29.jpg'],
    description: 'A respectful contemporary interpretation of Nepalese formalwear, cut to the client’s proportions.',
    fabrics: ['Fine Cotton', 'Wool Blend', 'Textured Weave'],
    colors: ['Cream', 'Black', 'Maroon'],
    features: ['Custom proportions', 'Waistcoat styling', 'Traditional detailing', 'Ceremonial consultation'],
    completion: '4–6 weeks'
  },
  {
    id: 7,
    slug: 'city-trouser',
    name: 'City Trouser',
    shortName: 'Trousers',
    category: 'Business',
    type: 'Trousers',
    gender: 'Men',
    price: 8500,
    image: 'https://images.squarespace-cdn.com/content/v1/57baef93cd0f68daca6084ae/c2efa3e1-44ab-4445-ae72-b2db0904d864/charcoal-wool-trousers.png',
    gallery: ['https://images.squarespace-cdn.com/content/v1/57baef93cd0f68daca6084ae/c2efa3e1-44ab-4445-ae72-b2db0904d864/charcoal-wool-trousers.png'],
    description: 'Balanced rise, clean line and individually tuned leg shape for daily wear.',
    fabrics: ['Worsted Wool', 'Cotton', 'Linen Blend'],
    colors: ['Charcoal', 'Navy', 'Stone'],
    features: ['Side adjusters option', 'Pleat options', 'Cuff options', 'Hand-finished waistband'],
    completion: '2–4 weeks'
  },
  {
    id: 8,
    slug: 'ceremony-waistcoat',
    name: 'Ceremony Waistcoat',
    shortName: 'Waistcoats',
    category: 'Wedding',
    type: 'Waistcoats',
    gender: 'Men',
    price: 9500,
    image: 'https://image.hm.com/assets/hm/de/3f/de3f7352170b4217ed1bc835f4c8713ae5a2bbeb.jpg?imwidth=2160',
    gallery: ['https://image.hm.com/assets/hm/de/3f/de3f7352170b4217ed1bc835f4c8713ae5a2bbeb.jpg?imwidth=2160'],
    description: 'A tailored layer for weddings and formal occasions, designed to work under or without a jacket.',
    fabrics: ['Wool', 'Silk Blend', 'Jacquard'],
    colors: ['Stone', 'Wine', 'Navy'],
    features: ['Single or double breasted', 'Custom back fabric', 'Contrast buttons', 'Personal fitting'],
    completion: '2–4 weeks'
  },
  {
    id: 9,
    slug: 'womens-bespoke-suit',
    name: 'Women’s Bespoke Suit',
    shortName: 'Women’s Suits',
    category: 'Business',
    type: 'Suits',
    gender: 'Women',
    price: 24500,
    image: 'https://cdn.vipavenue.ru/products/1505001_1510000/1508948/3wVQ17RNoe5vAXNI84QeCrS8oJMRZzeNBvxlETXR.jpg',
    gallery: ['https://cdn.vipavenue.ru/products/1505001_1510000/1508948/3wVQ17RNoe5vAXNI84QeCrS8oJMRZzeNBvxlETXR.jpg'],
    description: 'A made-to-order women’s suit shaped around posture, proportion and preferred silhouette.',
    fabrics: ['Worsted Wool', 'Wool–Cashmere', 'Linen Blend'],
    colors: ['Navy', 'Charcoal', 'Black'],
    features: ['Personal measurements', 'Custom jacket length', 'Trouser or skirt option', 'Fitting refinement'],
    completion: '4–6 weeks'
  },
  {
    id: 10,
    slug: 'womens-tailored-blazer',
    name: 'Women’s Tailored Blazer',
    shortName: 'Women’s Blazers',
    category: 'Business',
    type: 'Blazers',
    gender: 'Women',
    price: 18500,
    image: 'https://cdn.aboutstatic.com/file/images/77dbe6883d2cbac5a4d45fb40e83989e.jpg?brightness=0.96&expand=1&height=630&quality=75&trim=1&width=1200',
    gallery: ['https://cdn.aboutstatic.com/file/images/77dbe6883d2cbac5a4d45fb40e83989e.jpg?brightness=0.96&expand=1&height=630&quality=75&trim=1&width=1200'],
    description: 'A custom blazer with individually adjusted shoulder, waist and length proportions.',
    fabrics: ['Wool Blend', 'Linen', 'Cotton Twill'],
    colors: ['Black', 'Navy', 'Stone'],
    features: ['Custom silhouette', 'Lapel choice', 'Pocket options', 'Personal fitting'],
    completion: '3–5 weeks'
  },
  {
    id: 11,
    slug: 'womens-formal-trouser',
    name: 'Women’s Formal Trouser',
    shortName: 'Women’s Trousers',
    category: 'Formal',
    type: 'Trousers',
    gender: 'Women',
    price: 8500,
    image: 'https://image.hm.com/assets/hm/72/cb/72cb90d203d1d240c84d8bc5b7be6ec80ffb1c74.jpg?imwidth=2160',
    gallery: ['https://image.hm.com/assets/hm/72/cb/72cb90d203d1d240c84d8bc5b7be6ec80ffb1c74.jpg?imwidth=2160'],
    description: 'Custom trousers balanced around waist, hip, rise and preferred leg shape.',
    fabrics: ['Worsted Wool', 'Cotton', 'Linen Blend'],
    colors: ['Charcoal', 'Black', 'Stone'],
    features: ['Rise adjustment', 'Pleat options', 'Leg-shape choice', 'Personal fitting'],
    completion: '2–4 weeks'
  },
  {
    id: 12,
    slug: 'womens-wedding-tailoring',
    name: 'Women’s Wedding Tailoring',
    shortName: 'Women’s Wedding',
    category: 'Wedding',
    type: 'Wedding',
    gender: 'Women',
    price: 28000,
    image: 'https://i5.walmartimages.com/asr/15bdb6ef-64ee-4c57-b36e-df77414a9447.45b0706ff63b638113c024addad0d674.jpeg',
    gallery: ['https://i5.walmartimages.com/asr/15bdb6ef-64ee-4c57-b36e-df77414a9447.45b0706ff63b638113c024addad0d674.jpeg'],
    description: 'Made-to-order formal tailoring for wedding, reception and ceremony dressing.',
    fabrics: ['Wool', 'Silk Blend', 'Textured Suiting'],
    colors: ['Ivory', 'Black', 'Navy'],
    features: ['Occasion consultation', 'Custom measurements', 'Detail selection', 'Final fitting'],
    completion: '5–7 weeks'
  },
  {
    id: 13,
    slug: 'womens-custom-shirt',
    name: 'Women’s Custom Shirt',
    shortName: 'Women’s Shirts',
    category: 'Formal',
    type: 'Shirts',
    gender: 'Women',
    price: 6800,
    image: 'https://turnbullandasser.com/cdn/shop/files/1c7f6a09-e77d-4a9f-bfbb-12556adbbcf5.jpg?v=1723117083',
    gallery: ['https://turnbullandasser.com/cdn/shop/files/1c7f6a09-e77d-4a9f-bfbb-12556adbbcf5.jpg?v=1723117083'],
    description: 'A made-to-order women’s shirt adjusted through the shoulder, bust, waist, sleeve and preferred length.',
    fabrics: ['Cotton Poplin', 'Oxford Cotton', 'Silk-Cotton Blend'],
    colors: ['Ivory', 'White', 'Sky'],
    features: ['Collar choice', 'Cuff choice', 'Length adjustment', 'Personal fitting'],
    completion: '2–3 weeks'
  },

  {
    id: 14, slug: 'groom-reception-three-piece', name: 'Groom Reception Three-Piece', shortName: 'Reception Suit', category: 'Wedding', type: 'Wedding', gender: 'Men', price: 30000,
    image: 'https://images.hugoboss.com/is/image/boss/hbna50551771_001_170?qlt=80&resMode=sharp2&wid=1980', gallery: ['https://images.hugoboss.com/is/image/boss/hbna50551771_001_170?qlt=80&resMode=sharp2&wid=1980'],
    description: 'A clean three-piece reference for reception dressing, individually tailored after consultation.', fabrics: ['Worsted Wool','Wool Blend'], colors: ['Black','Navy','Charcoal'], features: ['Personal measurements','Waistcoat option','Lapel choice','Final fitting'], completion: '5–7 weeks'
  },
  {
    id: 15, slug: 'womens-ivory-waistcoat-ceremony-set', name: 'Women’s Ivory Waistcoat Ceremony Set', shortName: 'Ivory Ceremony Set', category: 'Wedding', type: 'Wedding', gender: 'Women', price: 29000,
    image: 'https://i5.walmartimages.com/asr/15bdb6ef-64ee-4c57-b36e-df77414a9447.45b0706ff63b638113c024addad0d674.jpeg', gallery: ['https://i5.walmartimages.com/asr/15bdb6ef-64ee-4c57-b36e-df77414a9447.45b0706ff63b638113c024addad0d674.jpeg'],
    description: 'An ivory waistcoat-and-trouser ceremony set used as a styling reference before a personal fitting.', fabrics: ['Wool Blend','Linen Blend','Textured Suiting'], colors: ['Ivory','Cream','Stone'], features: ['Custom silhouette','Trouser option','Button choice','Final fitting'], completion: '5–7 weeks'
  },
  {
    id: 16, slug: 'midnight-dinner-jacket', name: 'Midnight Dinner Jacket', shortName: 'Dinner Jacket', category: 'Formal', type: 'Tuxedos', gender: 'Men', price: 26000,
    image: 'https://image.hm.com/assets/hm/85/ef/85efb51494cf0b9c02225e373f2c669f2d031956.jpg', gallery: ['https://image.hm.com/assets/hm/85/ef/85efb51494cf0b9c02225e373f2c669f2d031956.jpg'],
    description: 'An evening jacket reference with restrained proportions and formal detailing.', fabrics: ['Barathea Wool','Wool Blend'], colors: ['Black','Midnight'], features: ['Shawl or peak lapel','Satin facing option','Personal measurements','Fitting refinement'], completion: '4–6 weeks'
  },
  {
    id: 17, slug: 'newari-haku-patasi', name: 'Newari Haku Patasi', shortName: 'Haku Patasi', category: 'Traditional', type: 'Traditional Wear', gender: 'Women', price: 18000,
    image: 'https://assets.zyrosite.com/cdn-cgi/image/format%3Dauto%2Cw%3D1440%2Ch%3D1440%2Cfit%3Dcrop/A0xl1DKv6EHrgvr8/newarisaree-mP4OlbQ1pKInybDb.png', gallery: ['https://assets.zyrosite.com/cdn-cgi/image/format%3Dauto%2Cw%3D1440%2Ch%3D1440%2Cfit%3Dcrop/A0xl1DKv6EHrgvr8/newarisaree-mP4OlbQ1pKInybDb.png'],
    description: 'A Newari Haku Patasi reference presented as the garment itself, with fitting and detailing confirmed in consultation.', fabrics: ['Cotton','Traditional Weave'], colors: ['Black','Red'], features: ['Personal sizing','Traditional border detailing','Blouse consultation','Ceremonial fitting'], completion: '4–6 weeks'
  },
  {
    id: 18, slug: 'tamang-womens-cultural-set', name: 'Tamang Women’s Cultural Set', shortName: 'Tamang Dress', category: 'Traditional', type: 'Traditional Wear', gender: 'Women', price: 19500,
    image: 'https://folkbazar.com/cdn/shop/products/Ladies_Tamang_Dress_480x480.jpg?v=1666534171', gallery: ['https://folkbazar.com/cdn/shop/products/Ladies_Tamang_Dress_480x480.jpg?v=1666534171'],
    description: 'A Tamang cultural outfit reference shown without a model; final materials and details are confirmed during consultation.', fabrics: ['Silk Blend','Cotton'], colors: ['Pink','Maroon','Black'], features: ['Custom sizing','Traditional detailing','Colour consultation','Fitting'], completion: '4–6 weeks'
  },
  {
    id: 19, slug: 'magar-gurung-traditional-lungi', name: 'Magar / Gurung Traditional Lungi', shortName: 'Traditional Lungi', category: 'Traditional', type: 'Traditional Wear', gender: 'Women', price: 8500,
    image: 'https://folkbazar.com/cdn/shop/files/Lungi_for_Magar_Gurung.webp?v=1781417131&width=370', gallery: ['https://folkbazar.com/cdn/shop/files/Lungi_for_Magar_Gurung.webp?v=1781417131&width=370'],
    description: 'A traditional Magar/Gurung lungi reference focused on the textile and border rather than a model.', fabrics: ['Cotton','Traditional Weave'], colors: ['Black','Red','Gold'], features: ['Length adjustment','Waist adjustment','Border selection','Traditional styling'], completion: '2–4 weeks'
  },
  {
    id: 20, slug: 'natural-daura-suruwal-set', name: 'Natural Daura Suruwal Set', shortName: 'Daura Suruwal Set', category: 'Traditional', type: 'Traditional Wear', gender: 'Men', price: 19500,
    image: 'https://houseofnepal.com.au/cdn/shop/files/brown-daurasuruwal_3db79691-aac7-4ecc-a331-0056fd071e61.jpg?v=1736132865&width=640', gallery: ['https://houseofnepal.com.au/cdn/shop/files/brown-daurasuruwal_3db79691-aac7-4ecc-a331-0056fd071e61.jpg?v=1736132865&width=640'],
    description: 'A natural-tone Daura Suruwal reference shown as the complete garment set, tailored to individual proportions after consultation.', fabrics: ['Cotton','Linen Blend'], colors: ['Natural','Cream','Stone'], features: ['Custom proportions','Waist adjustment','Traditional detailing','Personal fitting'], completion: '4–6 weeks'
  },

];

export const editorialCategories = [
  { 
    name: 'Bespoke Suits', 
    path: '/collections/suits', 
    image: collections[0].image, 
    description: 'Cut around posture and proportion.' 
  },
  { 
    name: 'Wedding', 
    path: '/wedding', 
    image: collections[1].image, 
    description: 'Tailoring for the day that matters.' 
  },
  { 
    name: 'Tuxedos', 
    path: '/collections/tuxedos', 
    image: collections[2].image, 
    description: 'Black tie with measured restraint.' 
  },
  { 
    name: 'Shirts', 
    path: '/collections/shirts', 
    image: collections[4].image, 
    description: 'Built from collar to cuff around you.' 
  },
  { 
    name: 'Traditional', 
    path: '/collections?filter=Traditional', 
    image: collections[5].image, 
    description: 'Nepalese formalwear, precisely tailored.' 
  },
  { 
    name: 'Blazers', 
    path: '/collections?type=Blazers', 
    image: collections[3].image, 
    description: 'Relaxed structure. Refined finish.' 
  },


];
