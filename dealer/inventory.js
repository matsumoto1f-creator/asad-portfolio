/* Halcyon Chevrolet demo inventory. One source of truth for the SRP, the VDP, the specials page
   ("View Inventory (n)") and the homepage search. Every advertised price is computed from its lines,
   so a stack can never fail to add up. All vehicles, stock numbers and prices are fictional. */
window.DEALER = {
  name: 'Halcyon Chevrolet', short: 'Halcyon', city: 'Somerset, NJ', street: '1 Halcyon Way, Somerset, NJ 08873',
  sales: '(555) 010-0199', service: '(555) 010-0142', docFee: 549, expires: '11/02/2026', expiresISO: '2026-11-02',
  lender: 'GM Financial'
};
window.INVENTORY = [
  { stock: 'HC26-1142', cond: 'New', year: 2026, make: 'Chevrolet', model: 'Silverado 1500', trim: 'LT Trail Boss Crew Cab 4WD', body: 'Truck', ext: ['Black', '#111'], int: 'Jet Black', engine: '5.3L V8', trans: '10-speed automatic', drive: '4WD', mpg: '16/20', miles: 0,
    msrp: 63995, discount: 3200, rebate: { name: 'Customer Cash', amt: 1500 }, badges: ['Truck Month'], imgs: ['silverado'], code: 'CK10543',
    feats: ['2" factory lift', 'Z71 off-road suspension', '13.4" touchscreen', 'Trailering package', 'Rocko skid plates', 'LED headlamps'] },
  { stock: 'HC26-1188', cond: 'New', year: 2026, make: 'Chevrolet', model: 'Tahoe', trim: 'High Country 4WD', body: 'SUV', ext: ['Summit White', '#f4f4f2'], int: 'Jet Black', engine: '6.2L V8', trans: '10-speed automatic', drive: '4WD', mpg: '14/18', miles: 0,
    msrp: 84890, discount: 3500, rebate: null, badges: ['In Transit'], imgs: ['tahoe-hc'], code: 'CK10706',
    feats: ['Super Cruise ready', 'Air Ride adaptive suspension', 'Panoramic sunroof', 'Bose Performance audio', 'Power-release 2nd row', 'Heated & ventilated seats'] },
  { stock: 'HC25-0931', cond: 'New', year: 2025, make: 'Chevrolet', model: 'Tahoe', trim: 'Z71 4WD', body: 'SUV', ext: ['Sterling Gray', '#6b6e70'], int: 'Jet Black', engine: '5.3L V8', trans: '10-speed automatic', drive: '4WD', mpg: '15/19', miles: 0,
    msrp: 74395, discount: 4100, rebate: { name: 'Model Year-End Cash', amt: 2000 }, badges: ['Price Drop'], imgs: ['tahoe-z71'], code: 'CK10706',
    feats: ['Magnetic Ride Control', '2-speed transfer case', 'Skid plates', 'Hill descent control', '3rd-row seating', 'Wireless CarPlay'] },
  { stock: 'HC26-1203', cond: 'New', year: 2026, make: 'Chevrolet', model: 'Equinox', trim: 'LT FWD', body: 'SUV', ext: ['Radiant Red', '#a3101c'], int: 'Jet Black', engine: '1.5L Turbo', trans: 'CVT', drive: 'FWD', mpg: '26/31', miles: 0,
    msrp: 32595, discount: 900, rebate: { name: 'Customer Cash', amt: 750 }, badges: [], imgs: ['equinox'], code: '1PS26',
    feats: ['11.3" touchscreen', 'Chevy Safety Assist', 'Remote start', 'Heated front seats', 'Wireless phone charging', 'LED lighting'] },
  { stock: 'HC26-1077', cond: 'New', year: 2026, make: 'Chevrolet', model: 'Traverse', trim: 'RS AWD', body: 'SUV', ext: ['Sterling Gray', '#7d8084'], int: 'Jet Black', engine: '2.5L Turbo', trans: '8-speed automatic', drive: 'AWD', mpg: '18/24', miles: 0,
    msrp: 57495, discount: 1800, rebate: { name: 'Customer Cash', amt: 1000 }, badges: [], imgs: ['traverse'], code: '1NV56',
    feats: ['22" black wheels', '17.7" touchscreen', 'Super Cruise ready', 'Ventilated front seats', '3rd-row seating', 'Bose audio'] },
  { stock: 'HC26-1121', cond: 'New', year: 2026, make: 'Chevrolet', model: 'Colorado', trim: 'Z71 Crew Cab 4WD', body: 'Truck', ext: ['Sterling Gray', '#5f6366'], int: 'Jet Black', engine: '2.7L Turbo', trans: '8-speed automatic', drive: '4WD', mpg: '17/20', miles: 0,
    msrp: 45195, discount: 1400, rebate: { name: 'Customer Cash', amt: 500 }, badges: [], imgs: ['colorado'], code: '14T43',
    feats: ['Z71 off-road package', 'Locking rear differential', 'Skid plates', '11.3" touchscreen', 'Bed-mounted 120V outlet', 'Trailering package'] },
  { stock: 'HC26-0702', cond: 'New', year: 2026, make: 'Chevrolet', model: 'Corvette', trim: 'Stingray 2LT Coupe', body: 'Coupe', ext: ['Rapid Blue', '#1a74c9'], int: 'Jet Black', engine: '6.2L V8', trans: '8-speed dual-clutch', drive: 'RWD', mpg: '16/24', miles: 0,
    msrp: 79995, discount: 0, rebate: null, badges: ['Just Arrived'], imgs: ['corvette-blue'], code: '1YC07',
    feats: ['Z51 performance package', 'Front lift with memory', 'Performance Data Recorder', 'Removable roof panel', 'Bose 14-speaker audio', 'Head-up display'] },
  { stock: 'HC26-0718', cond: 'New', year: 2026, make: 'Chevrolet', model: 'Corvette', trim: 'Stingray 3LT Convertible', body: 'Convertible', ext: ['Torch Red', '#c21420'], int: 'Natural', engine: '6.2L V8', trans: '8-speed dual-clutch', drive: 'RWD', mpg: '16/24', miles: 0,
    msrp: 94850, discount: 0, rebate: null, badges: [], imgs: ['corvette-red'], code: '1YC67',
    feats: ['Power-retractable hardtop', 'GT2 seats', 'Magnetic Ride Control', 'Front lift with memory', 'Carbon interior trim', 'Head-up display'] },
  { stock: 'HC26-1310', cond: 'New', year: 2026, make: 'Chevrolet', model: 'Blazer EV', trim: '2LT AWD', body: 'SUV', ext: ['Summit White', '#f4f4f2'], int: 'Jet Black', engine: 'Dual motor electric', trans: 'Single-speed', drive: 'AWD', mpg: '–', miles: 0,
    msrp: 51995, discount: 2000, rebate: { name: 'EV Customer Cash', amt: 3000 }, badges: ['Electric'], imgs: ['blazer-ev'], code: '1MB26',
    feats: ['Up to 279 mi est. range', 'DC fast charging', '17.7" touchscreen', 'One-pedal driving', 'Heat pump', 'Super Cruise ready'] },
  { stock: 'HC26-1355', cond: 'New', year: 2026, make: 'Chevrolet', model: 'Trax', trim: '1RS FWD', body: 'SUV', ext: ['Crimson Metallic', '#8e1520'], int: 'Jet Black', engine: '1.2L Turbo', trans: '6-speed automatic', drive: 'FWD', mpg: '28/32', miles: 0,
    msrp: 24595, discount: 500, rebate: null, badges: [], imgs: ['trax'], code: '1TU56',
    feats: ['11" touchscreen', 'Wireless CarPlay', 'RS black trim', 'Chevy Safety Assist', 'Heated front seats', 'Remote start'] },
  { stock: 'H24-0650', cond: 'Certified', year: 2022, make: 'Chevrolet', model: 'Camaro', trim: 'ZL1 Coupe', body: 'Coupe', ext: ['Summit White', '#f4f4f2'], int: 'Jet Black', engine: '6.2L Supercharged V8', trans: '10-speed automatic', drive: 'RWD', mpg: '13/21', miles: 8412,
    retail: 68995, discount: 2000, conditional: [{ name: 'Military / first responder', amt: 500 }], badges: ['One Owner'], imgs: ['../cars/zl1-34', '../cars/zl1-front', '../cars/zl1-rear', '../cars/zl1-wheel', '../cars/zl1-engine'], code: '1AH37',
    feats: ['Magnetic Ride Control', 'Brembo 6-piston fronts', 'Recaro seats', 'Head-up display', 'Performance Data Recorder', 'Launch control'], landing: '../zl1/' },
  { stock: 'H24-0612', cond: 'Used', year: 2018, make: 'Chevrolet', model: 'Camaro', trim: 'ZL1 1LE Coupe', body: 'Coupe', ext: ['Red Hot', '#c4161c'], int: 'Jet Black', engine: '6.2L Supercharged V8', trans: '6-speed manual', drive: 'RWD', mpg: '14/20', miles: 21304,
    retail: 56900, discount: 1000, conditional: [], badges: ['Manual'], imgs: ['../cars/zl1-red'], code: '1AH37',
    feats: ['1LE track package', 'Multimatic DSSV dampers', 'Carbon rear wing', 'Goodyear Supercar 3R tires', 'Recaro seats', 'Rev matching'] },
  { stock: 'C23-0503', cond: 'Used', year: 2023, make: 'BMW', model: 'M4', trim: 'Competition xDrive Coupe', body: 'Coupe', ext: ['Isle of Man Green', '#1f5a46'], int: 'Black', engine: '3.0L Twin-Turbo I6', trans: '8-speed automatic', drive: 'AWD', mpg: '16/22', miles: 12840,
    retail: 72900, discount: 1000, conditional: [], badges: [], imgs: ['../cars/m4-dc2', '../cars/m4-dc', '../cars/m4-adelaide'], code: '43AZ',
    feats: ['M xDrive with 2WD mode', 'Carbon-fibre roof', 'M Compound brakes', 'Harman Kardon audio', 'Head-up display', 'Adaptive M suspension'], landing: '../m4/' }
];
/* price lines → { lines, price, savings }. New: MSRP + doc − discount − rebate. Used: retail + doc − discount. */
window.priceOf = function (v) {
  var D = window.DEALER, lines = [], base = v.cond === 'New' ? v.msrp : v.retail;
  lines.push({ k: v.cond === 'New' ? 'MSRP' : 'Retail Price', v: base, d: v.cond === 'New' ? 'Manufacturer’s suggested retail price for this vehicle as equipped, from the window sticker.' : 'Halcyon retail price based on a market comparison of similar vehicles.' });
  lines.push({ k: 'Documentation Fee', v: D.docFee, d: 'Dealer documentary service fee for processing paperwork. Included in the advertised price.' });
  if (v.discount) lines.push({ k: D.short + ' Discount', v: -v.discount, d: 'Dealer discount applies to every buyer. See dealer for complete details.', s: 1 });
  if (v.rebate) lines.push({ k: v.rebate.name, v: -v.rebate.amt, d: 'Manufacturer incentive. Must take new retail delivery from dealer stock by ' + D.expires + '. Not available with some special financing or lease offers.', s: 1 });
  var price = lines.reduce(function (a, l) { return a + l.v; }, 0);
  var savings = (v.discount || 0) + (v.rebate ? v.rebate.amt : 0);
  return { lines: lines, price: price, savings: savings };
};
window.money = function (n) { return (n < 0 ? '−$' : '$') + Math.abs(Math.round(n)).toLocaleString('en-US'); };
window.titleOf = function (v) { return v.year + ' ' + v.make + ' ' + v.model + ' ' + v.trim; };
window.imgSrc = function (name) { return (name.indexOf('../') === 0 ? '../img/inv/' + name : '../img/inv/' + name) + '.webp'; };
window.PHOTO_CREDITS = [
  ['silverado', 'TaurusEmerald', 'CC BY-SA 4.0', '2024 Chevrolet Silverado 1500 LT Trail Boss Las Vegas Fall 2026.jpg'],
  ['tahoe-hc', 'Kevauto', 'CC BY-SA 4.0', '2021 Chevrolet Tahoe High Country, front 12.24.20.jpg'],
  ['tahoe-z71', 'Lambodriver2', 'CC BY-SA 4.0', '2021 Chevrolet Tahoe Z71.jpg'],
  ['equinox', 'HJUdall', 'CC0', '25 Chevrolet Equinox LT.jpg'],
  ['traverse', 'Kevauto', 'CC BY-SA 4.0', '2024 Chevrolet Traverse RS AWD, front 10.16.24.jpg'],
  ['colorado', 'Bull-Doser', 'Public domain', '2023 Chevrolet Colorado Z71 Crew Cab.jpg'],
  ['corvette-blue', 'Oleg Yunakov', 'CC BY-SA 4.0', '2020s Rapid Blue Chevrolet Corvette C8 Stingray.jpg'],
  ['corvette-red', 'Calreyn88', 'CC BY-SA 4.0', '2023 Chevrolet Corvette C8 Stingray Auto gfos25.jpg'],
  ['blazer-ev', 'Elise240SX', 'CC BY-SA 4.0', '2024 Chevrolet Blazer EV RS AWD in Summit White, front left, 2024-03-31.jpg'],
  ['trax', 'MercurySable99', 'CC BY-SA 4.0', '2024 Chevrolet Trax 1RS, front right, 05-18-2023.jpg'],
  ['zl1', 'Carsfera / Nicholas Good / squeuei / Mustang Joe', 'CC BY 2.0 / CC0', 'see /zl1/ page credits'],
  ['m4', 'OWS Photography / Pangalau', 'CC BY 4.0 / CC BY-SA 4.0', 'see /m4/ page credits']
];
