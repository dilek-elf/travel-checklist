import type { ItemCategory, TripPreferences } from './api/checklistApi'

export type PackingSuggestion = { text: string; category: ItemCategory }
const item = (text: string, category: ItemCategory): PackingSuggestion => ({ text, category })

export function generatePackingList(preferences: TripPreferences) {
  const { tripType, season, durationDays, travelGroup, hasPet, petType, transport,
    travelScope, accommodation, adultCount, babyCount, toddlerCount, childCount,
    teenCount, activities, luggage, hasLaundry, personalNeeds } = preferences
  const clothingDays = Math.min(durationDays, hasLaundry ? 5 : 10)
  const people = Math.max(1, adultCount + babyCount + toddlerCount + childCount + teenCount)
  const suggestions: PackingSuggestion[] = [
    item('Passport or ID', 'Documents'), item('Wallet and payment cards', 'Documents'),
    item('Booking confirmations', 'Documents'), item('Emergency contact details', 'Documents'),
    item(`Underwear × ${clothingDays}`, 'Clothes'), item(`Pairs of socks × ${clothingDays}`, 'Clothes'),
    item(`Tops × ${Math.min(clothingDays, 7)}`, 'Clothes'), item(`Bottoms × ${Math.max(1, Math.ceil(clothingDays / 3))}`, 'Clothes'),
    item('Pajamas', 'Clothes'), item('Comfortable shoes', 'Clothes'),
    item('Toothbrush and toothpaste', 'Toiletries'), item('Deodorant', 'Toiletries'),
    item('Shampoo and shower essentials', 'Toiletries'), item('Phone and charger', 'Electronics'),
    item('Power bank', 'Electronics'), item(`Reusable water bottles × ${people}`, 'Travel gear'),
  ]

  const typeItems: Record<string, PackingSuggestion[]> = {
    Weekend: [item('Small day bag', 'Travel gear'), item('One smart-casual outfit', 'Clothes')],
    Business: [item('Business outfits', 'Clothes'), item('Smart shoes', 'Clothes'), item('Laptop and charger', 'Electronics'), item('Notebook and pen', 'Other')],
    'Family vacation': [item('Family travel documents', 'Documents'), item('First-aid kit', 'Health'), item('Family snacks', 'Travel gear'), item('Travel games', 'Travel gear')],
    'Spring break': [item('Swimwear', 'Clothes'), item('Sunglasses', 'Travel gear'), item('Sun hat', 'Clothes'), item('Sunscreen', 'Toiletries')],
    'Tech work': [item('Laptop and charger', 'Electronics'), item('Headphones', 'Electronics'), item('Portable mouse', 'Electronics'), item('USB hub or adapters', 'Electronics'), item('Backup drive', 'Electronics')],
    Camping: [item('Tent and pegs', 'Travel gear'), item('Sleeping bag', 'Travel gear'), item('Sleeping mat', 'Travel gear'), item('Torch or headlamp', 'Travel gear'), item('Camping stove and fuel', 'Travel gear')],
    'Road trip': [item('Offline maps', 'Travel gear'), item('Roadside emergency kit', 'Travel gear'), item('Car snacks', 'Travel gear'), item('Car charger', 'Electronics')],
  }
  const seasonItems: Record<string, PackingSuggestion[]> = {
    Spring: [item('Light jacket', 'Clothes'), item('Compact umbrella', 'Travel gear')],
    Summer: [item('Swimwear', 'Clothes'), item('Sunscreen', 'Toiletries'), item('Sunglasses', 'Travel gear'), item('Sun hat', 'Clothes')],
    Autumn: [item('Warm layers', 'Clothes'), item('Waterproof jacket', 'Clothes'), item('Compact umbrella', 'Travel gear')],
    Winter: [item('Winter coat', 'Clothes'), item('Thermal layers', 'Clothes'), item('Gloves, scarf and warm hat', 'Clothes'), item('Weatherproof boots', 'Clothes')],
    'All seasons': [item('Light jacket', 'Clothes'), item('Warm sweater', 'Clothes'), item('Compact umbrella', 'Travel gear')],
  }
  const transportItems: Record<string, PackingSuggestion[]> = {
    Car: [item('Driving licence', 'Documents'), item('Vehicle documents', 'Documents'), item('Roadside emergency kit', 'Travel gear'), item('Phone mount and car charger', 'Electronics')],
    Motorcycle: [item('Motorcycle licence and documents', 'Documents'), item('Helmet and protective clothing', 'Travel gear'), item('Waterproof riding gear', 'Travel gear'), item('Motorcycle repair kit', 'Travel gear')],
    'Camper van/RV': [item('Driving licence and vehicle documents', 'Documents'), item('Campsite bookings', 'Documents'), item('Fresh-water hose and power cable', 'Travel gear'), item('Levelling blocks', 'Travel gear')],
    Bus: [item('Bus ticket', 'Documents'), item('Neck pillow', 'Travel gear'), item('Journey snacks', 'Travel gear')],
    Train: [item('Train ticket', 'Documents'), item('Headphones', 'Electronics'), item('Journey snacks', 'Travel gear')],
    Plane: [item('Boarding pass', 'Documents'), item('Carry-on liquids bag', 'Travel gear'), item('Neck pillow', 'Travel gear'), item('Travel adapter', 'Electronics')],
    'Cruise ship': [item('Cruise documents', 'Documents'), item('Seasickness medication', 'Health'), item('Swimwear', 'Clothes'), item('Formal evening outfit', 'Clothes')],
  }
  const accommodationItems: Record<string, PackingSuggestion[]> = {
    Hotel: [item('Hotel confirmation', 'Documents')],
    'Holiday apartment': [item('Apartment check-in details', 'Documents'), item('Basic groceries', 'Other')],
    'Family/friends': [item('Host gift', 'Other')],
    Camping: [item('Tent and pegs', 'Travel gear'), item('Sleeping bag', 'Travel gear'), item('Torch or headlamp', 'Travel gear')],
    'Camper van': [item('Campsite bookings', 'Documents'), item('Bedding for the camper', 'Travel gear'), item('Cooking supplies', 'Travel gear')],
  }
  suggestions.push(...typeItems[tripType], ...seasonItems[season], ...transportItems[transport], ...accommodationItems[accommodation])

  if (travelScope === 'International') suggestions.push(item('Visa or entry documents (if required)', 'Documents'), item('Travel insurance details', 'Documents'), item('Foreign currency or travel card', 'Documents'), item('Travel adapter', 'Electronics'))
  if (travelGroup === 'Couple') suggestions.push(item('Shared booking documents', 'Documents'))
  if (babyCount) suggestions.push(item(`Nappies and wipes for ${babyCount} baby/babies`, 'Travel gear'), item('Baby food, formula and bottles', 'Travel gear'), item('Stroller or baby carrier', 'Travel gear'), item('Baby medication', 'Health'))
  if (toddlerCount) suggestions.push(item(`Toddler outfits × ${toddlerCount}`, 'Clothes'), item('Toddler snacks and comfort toy', 'Travel gear'), item('Child car seat (if needed)', 'Travel gear'))
  if (childCount) suggestions.push(item(`Children’s outfits × ${childCount}`, 'Clothes'), item('Children’s medication', 'Health'), item('Games and activities', 'Travel gear'))
  if (teenCount) suggestions.push(item(`Teen clothing sets × ${teenCount}`, 'Clothes'), item('Teen chargers and headphones', 'Electronics'))

  if (hasPet) {
    suggestions.push(item('Pet travel documents', 'Documents'), item('Pet food', 'Pet'), item('Food and water bowls', 'Pet'), item('Waste bags', 'Pet'))
    if (petType === 'Dog') suggestions.push(item('Lead and harness', 'Pet'))
    if (petType === 'Cat') suggestions.push(item('Cat carrier and portable litter tray', 'Pet'))
    if (petType === 'Other') suggestions.push(item('Safe pet carrier', 'Pet'))
  }

  const activityItems: Record<string, PackingSuggestion[]> = {
    'Beach/swimming': [item('Swimwear', 'Clothes'), item('Beach towel', 'Travel gear'), item('Sunscreen', 'Toiletries')],
    Hiking: [item('Hiking boots', 'Clothes'), item('Day backpack', 'Travel gear'), item('Trail map', 'Travel gear')],
    Skiing: [item('Ski clothing', 'Clothes'), item('Ski goggles and gloves', 'Travel gear'), item('High-SPF sunscreen', 'Toiletries')],
    'Formal event': [item('Formal outfit', 'Clothes'), item('Formal shoes', 'Clothes')],
    'Sports/gym': [item('Sports clothing', 'Clothes'), item('Training shoes', 'Clothes')],
    'Remote work': [item('Laptop and charger', 'Electronics'), item('Headphones', 'Electronics'), item('Portable mouse', 'Electronics')],
    Photography: [item('Camera and charger', 'Electronics'), item('Memory cards', 'Electronics'), item('Camera bag', 'Travel gear')],
  }
  activities.forEach((activity) => suggestions.push(...activityItems[activity]))

  if (luggage === 'Backpack only') suggestions.push(item('Packing cubes', 'Travel gear'), item('Travel-size toiletries', 'Toiletries'))
  if (luggage === 'Carry-on') suggestions.push(item('Carry-on liquids bag', 'Travel gear'))
  if (luggage === 'Checked suitcase') suggestions.push(item('Luggage tag', 'Travel gear'), item('Suitcase lock', 'Travel gear'))
  if (luggage === 'Car luggage') suggestions.push(item('Car boot organiser', 'Travel gear'))
  if (hasLaundry) suggestions.push(item('Small laundry detergent', 'Toiletries'), item('Laundry bag', 'Travel gear'))
  if (durationDays > 14) suggestions.push(item('Extra medication supply', 'Health'), item('Nail care kit', 'Toiletries'), item('Second pair of shoes', 'Clothes'))

  const needItems: Record<string, PackingSuggestion[]> = {
    Medication: [item('Daily medication', 'Health'), item('Prescription copy', 'Documents')],
    'Accessibility equipment': [item('Accessibility equipment and chargers', 'Health')],
    'Glasses/contact lenses': [item('Glasses or contact lenses', 'Health'), item('Spare glasses and lens solution', 'Health')],
    'Menstrual products': [item('Menstrual products', 'Toiletries')],
    'Pregnancy essentials': [item('Pregnancy health documents', 'Documents'), item('Pregnancy comfort essentials', 'Health')],
    Makeup: [item('Makeup and remover', 'Toiletries')],
    'Shaving/grooming': [item('Shaving and grooming kit', 'Toiletries')],
    Haircare: [item('Haircare products and tools', 'Toiletries')],
  }
  personalNeeds.forEach((need) => suggestions.push(...needItems[need]))

  const lastMinuteItems: PackingSuggestion[] = [
    item('Put phone, wallet and keys in your day bag', 'Last minute'),
    item('Check the departure time and route', 'Last minute'),
    item('Charge phone and power bank', 'Last minute'),
    item('Download tickets, bookings and offline maps', 'Last minute'),
    item('Check the weather one last time', 'Last minute'),
    item('Empty the rubbish and remove food that may spoil', 'Last minute'),
    item('Turn off unnecessary appliances', 'Last minute'),
    item('Close windows and lock the door', 'Last minute'),
  ]

  if (travelScope === 'International') {
    lastMinuteItems.push(
      item('Check passport, visa and travel insurance are easy to reach', 'Last minute'),
    )
  } else {
    lastMinuteItems.push(item('Put ID and travel documents in your day bag', 'Last minute'))
  }

  const transportChecks: Partial<Record<typeof transport, PackingSuggestion[]>> = {
    Plane: [
      item('Check in online and save the boarding pass', 'Last minute'),
      item('Check terminal, gate and baggage limits', 'Last minute'),
    ],
    Train: [item('Check the platform and any service changes', 'Last minute')],
    Bus: [item('Check the bus stop and boarding time', 'Last minute')],
    Car: [item('Check fuel or charging level and tyre pressure', 'Last minute')],
    Motorcycle: [item('Check fuel, tyres and protective gear', 'Last minute')],
    'Camper van/RV': [item('Secure loose items and check fuel, water and power', 'Last minute')],
    'Cruise ship': [item('Check port, boarding time and cruise documents', 'Last minute')],
  }
  lastMinuteItems.push(...(transportChecks[transport] ?? []))

  if (personalNeeds.includes('Medication')) {
    lastMinuteItems.push(item('Put medication in your hand luggage', 'Last minute'))
  }
  if (hasPet) {
    lastMinuteItems.push(item('Give your pet food and water before departure', 'Last minute'))
  }
  if (babyCount || toddlerCount) {
    lastMinuteItems.push(item('Pack the final nappies, snacks and comfort item', 'Last minute'))
  }

  suggestions.unshift(...lastMinuteItems)

  return Array.from(new Map(suggestions.map((suggestion) => [`${suggestion.category}:${suggestion.text.toLowerCase()}`, suggestion])).values())
}
