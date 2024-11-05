import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import LoginPage from '../views/LoginPage.vue';
import Registration from '../views/SignUp.vue';
import UserProfile from '../views/ProfilePage.vue';
import EditUserProfile from '../components/User/EditProfile.vue';
import PasswordReset from '../components/Auth/ResetPassword.vue';
import CreateEvent from '@/components/Discussion/CreateEvent.vue';
// Function to create route configuration
const createRoute = (path, name, component, props = false) => ({
  path,
  name,
  component,
  props,
});

const appRoutes = [
  createRoute('/', 'HomePage', HomePage),
  createRoute('/login', 'LoginPage', LoginPage),
  createRoute('/register', 'Registration', Registration),
  createRoute('/user-profile', 'UserProfile', UserProfile),
  createRoute('/edit-user', 'EditUserProfile', EditUserProfile),
  createRoute('/new-discussion', 'NewDiscussion', CreateEvent),
  createRoute('/password-reset', 'PasswordReset', PasswordReset),
];

// Create a new router instance
const routerInstance = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: appRoutes,
});

// Export the router instance
export default routerInstance;
