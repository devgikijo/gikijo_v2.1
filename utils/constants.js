export const PAGES = {
  home: {
    key: 'home',
    name: 'Home',
    directory: '/',
    description: '',
    isAuth: false,
  },
  login: {
    key: 'login',
    name: 'Login',
    directory: '/login',
    description: '',
    isAuth: false,
  },
  signup: {
    key: 'signup',
    name: 'Sign up',
    directory: '/signup',
    description: '',
    isAuth: false,
  },
  onboard: {
    key: 'onboard',
    name: 'Onboard',
    directory: '/onboard',
    description: '',
    isAuth: true,
  },
  postJob: {
    key: 'postJob',
    name: 'Post Job',
    directory: '/postJob',
    description: '',
    isAuth: false,
  },
  jobs: {
    key: 'job',
    name: 'Find Job',
    directory: '/jobs',
    description: 'Create and publish your job oppurtunities here.',
    isAuth: false,
  },
  viewJob: {
    key: 'viewJob',
    name: 'View Job',
    directory: '/viewJob',
    description: '',
    isAuth: false,
  },
  dashboard: {
    key: 'dashboard',
    name: 'Dashboard',
    directory: '/dashboard',
    description: `Welcome to your dashboard.`,
    isAuth: true,
  },
  job_post: {
    key: 'job_post',
    name: 'Job Post',
    directory: '/jobPost',
    description: 'Create and publish your job oppurtunities here.',
    isAuth: true,
  },
  applicants: {
    key: 'applicants',
    name: 'Applicants',
    directory: '/applicants',
    description: 'Create and publish your job oppurtunities here.',
    isAuth: true,
  },
  application: {
    key: 'application',
    name: 'Application',
    directory: '/application',
    description: 'Create and publish your job oppurtunities here.',
    isAuth: true,
  },
  manage_profile: {
    key: 'manage_profile',
    name: 'Manage Profile',
    directory: '/manageProfile',
    description: 'Manage your profile details here.',
    isAuth: true,
  },
  company_profile: {
    key: 'company_profile',
    name: 'Company Profile',
    directory: '/companyProfile',
    description: 'Update your company details here.',
    isAuth: true,
  },
  channel: {
    key: 'channel',
    name: 'Channel',
    directory: '/channel',
    description: 'Create and publish your channels here.',
    isAuth: true,
  },
  topic: {
    key: 'topic',
    name: 'Topic',
    directory: '/topic',
    description: 'Create and publish your job oppurtunities here.',
    isAuth: true,
  },
  settings: {
    key: 'settings',
    name: 'Settings',
    directory: '/settings',
    description: 'Create and publish your job oppurtunities here.',
    isAuth: true,
  },
  profile: {
    key: 'profile',
    name: 'Profile',
    directory: '/profile',
    description: 'Create and publish your job oppurtunities here.',
    isAuth: false,
  },
  admin: {
    key: 'admin',
    name: 'Admin',
    directory: '/admin',
    description: 'Create and publish your job oppurtunities here.',
    isAuth: true,
  },
};

export const IMAGES = {
  applicant_placeholder: {
    url: 'https://static.thenounproject.com/png/4771394-200.png',
  },
};

export const SALARY_TYPES = [
  { name: 'monthly', value: 'monthly' },
  { name: 'weekly', value: 'weekly' },
  { name: 'hourly', value: 'hourly' },
  { name: 'daily', value: 'daily' },
  { name: 'annually', value: 'annually' },
];

export const EMPLOYMENT_TYPES = [
  { name: 'Full-time', value: 'full_time' },
  { name: 'Part-time', value: 'part_time' },
  { name: 'Contract', value: 'contract' },
  { name: 'Freelance', value: 'freelance' },
  { name: 'Internship', value: 'internship' },
  { name: 'Entry-level', value: 'entry_level' },
  { name: 'Volunteer', value: 'volunteer' },
  { name: 'Others', value: 'others' },
];

export const INDUSTRIES = [
  { name: 'Accounting', value: 'accounting' },
  { name: 'Finance', value: 'finance' },
  { name: 'Advertising', value: 'advertising' },
  { name: 'Marketing', value: 'marketing' },
  { name: 'Aerospace', value: 'aerospace' },
  { name: 'Defense', value: 'defense' },
  { name: 'Agriculture', value: 'agriculture' },
  { name: 'Farming', value: 'farming' },
  { name: 'Automotive', value: 'automotive' },
  { name: 'Transportation', value: 'transportation' },
  { name: 'Banking', value: 'banking' },
  { name: 'Financial Services', value: 'financial_services' },
  { name: 'Biotechnology', value: 'biotechnology' },
  { name: 'Pharmaceuticals', value: 'pharmaceuticals' },
  { name: 'Business Services', value: 'business_services' },
  { name: 'Construction', value: 'construction' },
  { name: 'Building', value: 'building' },
  { name: 'Consumer Goods', value: 'consumer_goods' },
  { name: 'Services', value: 'services' },
  { name: 'Education', value: 'education' },
  { name: 'Training ', value: 'training' },
  { name: 'Energy ', value: 'energy' },
  { name: 'Utilities ', value: 'utilities' },
  { name: 'Food ', value: 'food' },
  { name: 'Beverage ', value: 'beverage' },
  { name: 'Government ', value: 'government' },
  { name: 'Public Administration ', value: 'public_administration' },
  { name: 'Healthcare ', value: 'healthcare' },
  { name: 'Medical ', value: 'medical' },
  { name: 'Hospitality ', value: 'hospitality' },
  { name: 'Tourism ', value: 'tourism' },
  { name: 'Human Resources ', value: 'human_resources' },
  { name: 'Staffing', value: 'staffing' },
  { name: 'Information Technology', value: 'information_technology' },
  { name: 'Insurance', value: 'insurance' },
  { name: 'Legal Services ', value: 'legal_services' },
  { name: 'Manufacturing ', value: 'manufacturing' },
  { name: 'Mining ', value: 'mining' },
  { name: 'Metals ', value: 'metals' },
  { name: 'Non-profit ', value: 'non_profit' },
  { name: 'Social Services ', value: 'social_services' },
  { name: 'Real Estate ', value: 'real_estate' },
  { name: 'Retail ', value: 'retail' },
  { name: 'Telecommunications ', value: 'telecommunications' },
  { name: 'Textiles ', value: 'textiles' },
  { name: 'Apparel ', value: 'apparel' },
  { name: 'Others ', value: 'others' },
];

export const COMPANY_SIZES = [
  { name: '1-10 Employees', value: '1_10_employees' },
  { name: '11-50 Employees', value: '11_50_employees' },
  { name: '51-200 Employees', value: '51_200_employees' },
  { name: '201-500 Employees', value: '201_500_employees' },
  { name: '501-1000 Employees', value: '501_1000_employees' },
  { name: '1001+ Employees', value: 'more_1001_employees' },
];

export const JOB_POST_STATUS = [
  { name: 'Published', value: 'published' },
  { name: 'Unpublished', value: 'unpublished' },
];

export const GENDERS = [
  { name: 'Male', value: 'male' },
  { name: 'Female', value: 'female' },
];

export const COUNTRIES = [{ name: 'Malaysia', value: 'malaysia' }];

export const CURRENT_JOB_STATUS = [
  {
    name: 'Looking for work',
    value: 'looking_for_work',
  },
  {
    name: 'Open to new opportunities',
    value: 'open_to_new_opportunities',
  },
  {
    name: 'Not currently looking',
    value: 'not_currently_looking',
  },
  {
    name: 'Employed and open to opportunities',
    value: 'employed_and_open_to_opportunities',
  },
  {
    name: 'Not employed - seeking work',
    value: 'not_employed_seeking_work',
  },
  {
    name: 'Not employed - not seeking work',
    value: 'not_employed_not_seeking_work',
  },
];

export const APPLICATION_STATUS = [
  { name: 'Pending', value: 'pending' },
  { name: 'Selected for interview', value: 'selected_for_interview' },
  { name: 'Offered', value: 'offered' },
  { name: 'Not selected', value: 'not_selected' },
];

export const APPLICATION_ACTION_STATUS = [
  { name: 'Applied', value: 'applied' },
  { name: 'Withdraw', value: 'withdraw' },
];

export const SKILL_LEVELS = [
  {
    name: 'Beginner',
    value: 'beginner',
    description:
      'Basic understanding or introduction to the skill, limited practical experience.',
  },
  {
    name: 'Intermediate',
    value: 'intermediate',
    description:
      'Competent in the skill with some experience, able to work independently in most situations.',
  },
  {
    name: 'Advanced',
    value: 'advanced',
    description:
      'Highly skilled in the skill, extensive experience, capable of handling complex tasks proficiently.',
  },
  {
    name: 'Expert',
    value: 'expert',
    description:
      'Mastery of the skill, considered an authority, able to innovate and solve intricate problems.',
  },
];

export const LANGUAGE_LEVELS = [
  {
    name: 'Elementary',
    value: 'elementary',
    description:
      'Basic understanding of the language, limited vocabulary and simple phrases.',
  },
  {
    name: 'Intermediate',
    value: 'intermediate',
    description:
      'Able to hold conversations and understand more complex language structures.',
  },
  {
    name: 'Advanced',
    value: 'advanced',
    description:
      'Proficient in the language, can communicate fluently in various contexts.',
  },
  {
    name: 'Fluent',
    value: 'fluent',
    description:
      'Native or near-native proficiency, able to express ideas clearly and accurately.',
  },
];

export const MIN_SALARY = [
  { name: '0', value: 0 },
  { name: '1k', value: 1000 },
  { name: '2k', value: 2000 },
  { name: '3k', value: 3000 },
  { name: '4k', value: 4000 },
  { name: '5k', value: 5000 },
  { name: '6k', value: 6000 },
  { name: '7k', value: 7000 },
  { name: '8k', value: 8000 },
  { name: '9k', value: 9000 },
  { name: '10k', value: 10000 },
  { name: '11k', value: 11000 },
  { name: '12k', value: 12000 },
  { name: '13k', value: 13000 },
  { name: '14k', value: 14000 },
  { name: '15k', value: 15000 },
  { name: '20k', value: 20000 },
  { name: '30k', value: 30000 },
  { name: '40k', value: 40000 },
  { name: '50k', value: 50000 },
];

export const MAX_SALARY = [
  { name: '0', value: 0 },
  { name: '1k', value: 1000 },
  { name: '2k', value: 2000 },
  { name: '3k', value: 3000 },
  { name: '4k', value: 4000 },
  { name: '5k', value: 5000 },
  { name: '6k', value: 6000 },
  { name: '7k', value: 7000 },
  { name: '8k', value: 8000 },
  { name: '9k', value: 9000 },
  { name: '10k', value: 10000 },
  { name: '11k', value: 11000 },
  { name: '12k', value: 12000 },
  { name: '13k', value: 13000 },
  { name: '14k', value: 14000 },
  { name: '15k', value: 15000 },
  { name: '20k', value: 20000 },
  { name: '30k', value: 30000 },
  { name: '40k', value: 40000 },
  { name: '50k', value: 50000 },
];

export const STAGGER_CHILD_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, type: 'spring' } },
};

export const ACCOUNT_TYPES = [
  { name: 'Job Seeker', value: 'job_seeker' },
  { name: 'Employer', value: 'employer' },
];

export const SHARE_CHANNEL = [
  {
    title: 'Telegram',
    platform: 'telegram',
    icon: (
      <svg
        width="34"
        height="34"
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        <linearGradient id="a" x1="66.67%" x2="41.67%" y1="16.67%" y2="75%">
          <stop offset="0" stop-color="#37aee2" />
          <stop offset="1" stop-color="#1e96c8" />
        </linearGradient>
        <linearGradient id="b" x1="65.97%" x2="85.12%" y1="43.69%" y2="80.24%">
          <stop offset="0" stop-color="#eff7fc" />
          <stop offset="1" stop-color="#fff" />
        </linearGradient>
        <circle cx="8" cy="8" fill="url(#a)" r="8" />
        <path
          d="m6.53333333 11.6666667c-.25917333 0-.21513333-.09786-.30452-.3446334l-.76214666-2.50830663 5.86666663-3.48039334"
          fill="#c8daea"
        />
        <path
          d="m6.53333333 11.6666667c.2 0 .28836667-.0914667.4-.2l1.06666667-1.0372-1.33053333-.80233337"
          fill="#a9c9dd"
        />
        <path
          d="m6.66933333 9.62733333 3.224 2.38193337c.36789997.2029933.63342667.0978933.72506667-.3415667l1.3123333-6.1842c.13436-.53868-.20534-.783-.5572933-.62321333l-7.706 2.9714c-.52600667.21098-.52294.50444-.09588.6352l1.97753333.61722 4.57819997-2.88833334c.2161267-.13106.4144867-.06059933.25168.08389334"
          fill="url(#b)"
        />
      </svg>
    ),
  },
];
