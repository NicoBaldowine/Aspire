// Categories with their colors and icons
const categories = {
  Health: {
    color: '#4B7BF5',
    icon: 'snow',
  },
  Education: {
    color: '#EA4C89',
    icon: 'book',
  },
  Nutrition: {
    color: '#FF4B4B',
    icon: 'fast-food',
  },
  Language: {
    color: '#FFD60A',
    icon: 'language',
  },
  Sleep: {
    color: '#50E3C2',
    icon: 'moon',
  },
  Digital: {
    color: '#FF7A00',
    icon: 'phone-portrait',
  },
};

export const challengeSuggestions = [
  {
    id: '1',
    title: 'Cold shower',
    description: 'Take a cold shower every day to boost immunity and mental strength',
    category: 'Health',
    categoryColor: categories.Health.color,
    categoryIcon: categories.Health.icon,
  },
  {
    id: '2',
    title: 'Read a book',
    description: 'Read 20 pages every day to expand knowledge and improve focus',
    category: 'Education',
    categoryColor: categories.Education.color,
    categoryIcon: categories.Education.icon,
  },
  {
    id: '3',
    title: 'No junk food',
    description: 'Avoid processed foods for 21 days to improve health and energy levels',
    category: 'Nutrition',
    categoryColor: categories.Nutrition.color,
    categoryIcon: categories.Nutrition.icon,
  },
  {
    id: '4',
    title: 'Learn a new language',
    description: 'Practice a new language for 15 minutes daily to build fluency',
    category: 'Language',
    categoryColor: categories.Language.color,
    categoryIcon: categories.Language.icon,
  },
  {
    id: '5',
    title: 'Sleep improvement',
    description: 'Maintain a consistent sleep schedule for better rest and productivity',
    category: 'Sleep',
    categoryColor: categories.Sleep.color,
    categoryIcon: categories.Sleep.icon,
  },
  {
    id: '6',
    title: 'No Social Media',
    description: 'Stay off social media to reduce distractions and improve focus',
    category: 'Digital',
    categoryColor: categories.Digital.color,
    categoryIcon: categories.Digital.icon,
  },
]; 