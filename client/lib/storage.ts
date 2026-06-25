export interface UserData {
  fullName: string;
  username: string;
  email: string;
  mobile: string;
  password?: string;
}

const USER_DATA_KEY = "superapp_user_data";
const CATEGORIES_KEY = "superapp_categories";

export function saveUserData(data: UserData): void {
  try {
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving user data to localStorage:", error);
  }
}

export function getUserData(): UserData | null {
  try {
    const data = localStorage.getItem(USER_DATA_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error getting user data from localStorage:", error);
    return null;
  }
}

export function saveCategories(categories: string[]): void {
  try {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  } catch (error) {
    console.error("Error saving categories to localStorage:", error);
  }
}

export function getCategories(): string[] {
  try {
    const data = localStorage.getItem(CATEGORIES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error getting categories from localStorage:", error);
    return [];
  }
}
