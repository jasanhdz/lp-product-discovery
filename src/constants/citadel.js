export const DIMENSIONS = [
  'Dimension C-137',
  'Dimension C-500A',
  'Dimension D-99',
  'Dimension J19ζ7',
  'Cronenberg Dimension',
  'Replacement Dimension',
  'Giant Telepathic Spider Dimension',
  'Fascist Dimension',
  'Blender Dimension',
  'Pizza Dimension'
]

export const SPECIES_LIST = [
  'Human',
  'Alien',
  'Humanoid',
  'Robot',
  'Mythological Creature',
  'Poopybutthole',
  'Cronenberg',
  'Unknown'
]

export const FALLBACK_FORM_SCHEMA = [
  {
    id: 'mission_name',
    type: 'text',
    name: 'missionName',
    label: 'Mission Codename',
    placeholder: 'e.g. Operation Phoenix',
    isMandatory: true
  },
  {
    id: 'target_dimension',
    type: 'select',
    name: 'dimension',
    label: 'Target Dimension',
    options: ['C-137', 'Cronenberg', 'Blender Dimension', 'Fascist Dimension', 'Pizza Dimension'],
    isMandatory: true
  },
  {
    id: 'crew_size',
    type: 'number',
    name: 'crewSize',
    label: 'Required Crew Members',
    placeholder: '3',
    isMandatory: false
  },
  {
    id: 'portal_gun',
    type: 'checkbox',
    name: 'bringPortalGun',
    label: 'Require Portal Gun Access?',
    isMandatory: false
  }
]
