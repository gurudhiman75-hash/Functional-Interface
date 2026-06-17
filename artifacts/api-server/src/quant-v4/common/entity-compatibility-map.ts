export const EntityCompatibilityMap = {
  scenarioToGroups: {
    'school': ['students', 'boys', 'girls', 'teachers', 'staff', 'candidates'],
    'hospital': ['patients', 'doctors', 'nurses', 'staff', 'ward_boys'],
    'bank': ['customers', 'staff', 'clerks', 'managers', 'account_holders'],
    'office': ['employees', 'managers', 'staff', 'executives', 'workers'],
    'market': ['shopkeepers', 'customers', 'traders', 'vendors', 'buyers', 'sellers'],
    'family': ['family_members', 'siblings', 'relatives', 'children', 'elders'],
    'sports': ['players', 'athletes', 'teams', 'spectators', 'coaches'],
    'transport': ['passengers', 'drivers', 'conductors', 'commuters'],
    'agriculture': ['farmers', 'labourers', 'workers'],
    'village': ['villagers', 'farmers', 'panchayat_members'],
    'factory': ['workers', 'labourers', 'supervisors', 'engineers']
  },
  
  scenarioToProfessions: {
    'school': ['teacher', 'principal', 'librarian', 'clerk', 'peon', 'professor'],
    'hospital': ['doctor', 'nurse', 'surgeon', 'pharmacist', 'radiologist'],
    'bank': ['manager', 'cashier', 'clerk', 'accountant', 'security_guard'],
    'office': ['manager', 'developer', 'accountant', 'secretary', 'clerk'],
    'market': ['merchant', 'trader', 'shopkeeper', 'vendor', 'retailer'],
    'sports': ['coach', 'referee', 'captain', 'player', 'umpire'],
    'transport': ['driver', 'pilot', 'captain', 'conductor', 'mechanic'],
    'agriculture': ['farmer', 'gardener', 'landlord', 'worker'],
    'village': ['farmer', 'potter', 'blacksmith', 'carpenter', 'sarpanch'],
    'factory': ['worker', 'engineer', 'supervisor', 'manager', 'mechanic']
  },

  liquidCategoryMixtures: {
    'beverage': ['beverage'],
    'fuel': ['fuel'],
    'chemical': ['chemical'],
    'oil': ['oil'],
    'medicine': ['medicine', 'beverage'] // Some medicines can be mixed with water/juice
  },

  placeToProfessions: {
    'classroom': ['teacher', 'student'],
    'ward': ['doctor', 'nurse', 'patient'],
    'vault': ['manager', 'cashier'],
    'assembly_line': ['worker', 'supervisor'],
    'field': ['farmer', 'labourer']
  },

  frequencyModel: {
    'common': 0.80,
    'uncommon': 0.18,
    'rare': 0.02
  }
};
