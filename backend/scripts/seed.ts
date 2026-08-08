import 'dotenv/config';
import mongoose from 'mongoose';

const mongoUri = process.env.MONGO_URI || 'mongodb+srv://manjeetkumar62054_db_user:IEHBG289dVAaSYEI@cluster0.c79507b.mongodb.net/taskmanager';

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  priority: { type: String, default: 'MEDIUM' },
  leadName: { type: String, default: '' },
  leadAvatar: { type: String, default: '' },
  status: { type: String, default: 'IN_PROGRESS' },
  tasksCount: { type: Number, default: 0 },
  userId: { type: String, default: '' },
}, { timestamps: true });

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  status: { type: String, required: true },
  priority: { type: String, required: true },
  members: { type: Array, default: [] },
  dueDate: { type: String },
  labels: { type: [String], default: [] },
  teams: { type: [String], default: [] },
  reporter: { type: String, default: '' },
  project: { type: String, default: '' },
  resources: { type: Array, default: [] },
  subtasks: { type: Array, default: [] },
  comments: { type: Array, default: [] },
  activityLogs: { type: Array, default: [] },
  userId: { type: String, default: '' },
}, { timestamps: true });

const ProjectModel = mongoose.model('Project', ProjectSchema);
const TaskModel = mongoose.model('Task', TaskSchema);

async function seedDatabase() {
  try {
    console.log('🔄 Connecting to MongoDB at:', mongoUri.replace(/:([^:@]+)@/, ':****@'));
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB.');

    // Clear existing projects and tasks
    await ProjectModel.deleteMany({});
    await TaskModel.deleteMany({});
    console.log('🧹 Cleared existing Projects and Tasks collections.');

    // 1. Create Projects
    const projectsData = [
      {
        name: 'Pyramid Task App',
        priority: 'HIGH',
        status: 'IN_PROGRESS',
        leadName: 'Manjeet Mathur',
        leadAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Manjeet',
        tasksCount: 4,
      },
      {
        name: 'Design System',
        priority: 'URGENT',
        status: 'IN_PROGRESS',
        leadName: 'Sarah Chen',
        leadAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        tasksCount: 2,
      },
      {
        name: 'Mobile App Native',
        priority: 'MEDIUM',
        status: 'ON_HOLD',
        leadName: 'Alex Rivera',
        leadAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
        tasksCount: 1,
      },
      {
        name: 'Backend API Migration',
        priority: 'HIGH',
        status: 'COMPLETED',
        leadName: 'David Kim',
        leadAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
        tasksCount: 1,
      },
    ];

    const createdProjects = await ProjectModel.insertMany(projectsData);
    console.log(`🚀 Created ${createdProjects.length} Projects.`);

    const pyramidProject = createdProjects.find(p => p.name === 'Pyramid Task App')!;
    const designProject = createdProjects.find(p => p.name === 'Design System')!;
    const backendProject = createdProjects.find(p => p.name === 'Backend API Migration')!;

    // 2. Create Tasks
    const tasksData = [
      {
        title: 'Implement Google OAuth & Authentication',
        description: 'Configure NestJS backend with Passport Google OAuth strategy and JWT verification.',
        status: 'COMPLETED',
        priority: 'URGENT',
        project: pyramidProject.name,
        reporter: 'Manjeet Mathur',
        labels: ['Auth', 'Security', 'NestJS'],
        teams: ['Engineering'],
        members: [
          { name: 'Manjeet Mathur', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Manjeet', role: 'Lead Developer' },
          { name: 'Sarah Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', role: 'Security Reviewer' },
        ],
        dueDate: '2026-08-10',
        subtasks: [
          { id: 'sub-1', title: 'Setup Google Identity Services SDK in Next.js', priority: 'HIGH', completed: true },
          { id: 'sub-2', title: 'Implement Auth Guard in NestJS Controllers', priority: 'URGENT', completed: true },
        ],
        comments: [
          {
            id: 'c-1',
            authorName: 'Sarah Chen',
            authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
            content: 'Google OAuth token verification looks rock solid!',
            createdAt: new Date().toISOString(),
          },
        ],
      },
      {
        title: 'Build Interactive Task Kanban Board',
        description: 'Drag and drop interface with column status grouping and optimistic UI updates.',
        status: 'DOING',
        priority: 'HIGH',
        project: pyramidProject.name,
        reporter: 'Manjeet Mathur',
        labels: ['Frontend', 'UI/UX', 'React'],
        teams: ['Frontend Team'],
        members: [
          { name: 'Manjeet Mathur', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Manjeet', role: 'Lead Developer' },
        ],
        dueDate: '2026-08-12',
        subtasks: [
          { id: 'sub-3', title: 'Add drag and drop handlers for status changes', priority: 'HIGH', completed: true },
          { id: 'sub-4', title: 'Wire fields popover and sorting filters', priority: 'MEDIUM', completed: false },
        ],
        comments: [],
      },
      {
        title: 'Add Subtasks & Activity Logs',
        description: 'Enable creating, updating, and deleting subtasks directly inside task detail modal.',
        status: 'TODO',
        priority: 'MEDIUM',
        project: pyramidProject.name,
        reporter: 'Sarah Chen',
        labels: ['Feature', 'Fullstack'],
        teams: ['Product'],
        members: [
          { name: 'Sarah Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', role: 'Product Manager' },
        ],
        dueDate: '2026-08-15',
        subtasks: [
          { id: 'sub-5', title: 'Expose NestJS DELETE /tasks/:id/subtasks/:subtaskId endpoint', priority: 'HIGH', completed: true },
          { id: 'sub-6', title: 'Build EditSubtaskDialog modal component', priority: 'MEDIUM', completed: false },
        ],
        comments: [],
      },
      {
        title: 'Design System & Glassmorphism UI',
        description: 'Dark mode theme token configuration and custom Shadcn UI primitives.',
        status: 'DOING',
        priority: 'URGENT',
        project: designProject.name,
        reporter: 'Sarah Chen',
        labels: ['Design', 'Tailwind'],
        teams: ['Designers'],
        members: [
          { name: 'Sarah Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', role: 'UI Lead' },
        ],
        dueDate: '2026-08-11',
        subtasks: [],
        comments: [],
      },
      {
        title: 'Setup MongoDB Atlas Schema & Indexes',
        description: 'Define Mongoose schemas for User, Task, and Project models.',
        status: 'COMPLETED',
        priority: 'HIGH',
        project: backendProject.name,
        reporter: 'David Kim',
        labels: ['Database', 'MongoDB'],
        teams: ['Backend Team'],
        members: [
          { name: 'David Kim', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David', role: 'Backend Lead' },
        ],
        dueDate: '2026-08-05',
        subtasks: [],
        comments: [],
      },
      {
        title: 'Integrate Real-time Sorting & Filtering',
        description: 'Sort task board and project list dynamically by priority, status, and members.',
        status: 'TODO',
        priority: 'LOW',
        project: pyramidProject.name,
        reporter: 'Manjeet Mathur',
        labels: ['Enhancement'],
        teams: ['Engineering'],
        members: [
          { name: 'Manjeet Mathur', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Manjeet', role: 'Lead Developer' },
        ],
        dueDate: '2026-08-18',
        subtasks: [],
        comments: [],
      },
    ];

    const createdTasks = await TaskModel.insertMany(tasksData);
    console.log(`📋 Created ${createdTasks.length} Tasks.`);

    // 3. Sync project tasks counts
    for (const proj of createdProjects) {
      const count = await TaskModel.countDocuments({ project: proj.name });
      await ProjectModel.findByIdAndUpdate(proj._id, { tasksCount: count });
    }

    console.log('✅ MongoDB database successfully seeded with realistic Projects, Tasks, and Subtasks!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB.');
    process.exit(0);
  }
}

seedDatabase();
