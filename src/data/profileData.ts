import { ProfileData } from '../types/profile';

export const sampleProfileData: ProfileData = {
  id: '1',
  name: 'Alex Morgan',
  tagline: 'Creative Designer & Digital Strategist',
  bio: 'Passionate about creating beautiful digital experiences that connect brands with their audiences. Specializing in UI/UX design, branding, and digital marketing strategies.',
  profileImage: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400',
  coverImage: 'https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  location: {
    address: '123 Creative Street, Suite 456',
    city: 'San Francisco',
    country: 'USA'
  },
  socialLinks: [
    { platform: 'instagram', url: 'https://instagram.com/alexmorgan', username: '@alexmorgan' },
    { platform: 'linkedin', url: 'https://linkedin.com/in/alexmorgan', username: 'Alex Morgan' },
    { platform: 'email', url: 'mailto:alex@example.com', username: 'alex@example.com' },
    { platform: 'twitter', url: 'https://twitter.com/alexmorgan', username: '@alexmorgan' },
    { platform: 'whatsapp', url: 'https://wa.me/1234567890', username: '+1 (234) 567-890' }
  ],
  services: [
    {
      name: 'UI/UX Design',
      description: 'Complete user interface and experience design for web and mobile applications',
      price: 'From $2,500'
    },
    {
      name: 'Brand Identity',
      description: 'Logo design, brand guidelines, and complete visual identity packages',
      price: 'From $1,500'
    },
    {
      name: 'Digital Strategy',
      description: 'Comprehensive digital marketing and growth strategy consultation',
      price: 'From $500/hour'
    },
    {
      name: 'Web Development',
      description: 'Full-stack web development with modern frameworks and technologies'
    }
  ],
  businessHours: [
    { day: 'Monday', hours: '9:00 AM - 6:00 PM', isOpen: true },
    { day: 'Tuesday', hours: '9:00 AM - 6:00 PM', isOpen: true },
    { day: 'Wednesday', hours: '9:00 AM - 6:00 PM', isOpen: true },
    { day: 'Thursday', hours: '9:00 AM - 6:00 PM', isOpen: true },
    { day: 'Friday', hours: '9:00 AM - 5:00 PM', isOpen: true },
    { day: 'Saturday', hours: 'By Appointment', isOpen: false },
    { day: 'Sunday', hours: 'Closed', isOpen: false }
  ],
  gallery: [
    'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/3183153/pexels-photo-3183153.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/3182825/pexels-photo-3182825.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/196643/pexels-photo-196643.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=400'
  ]
};