import { toast } from "sonner";

export function fireOneTimeToast(key, message) {
  const value =
    localStorage.getItem(key) || sessionStorage.getItem(key);

  if (value) {
    toast.success(message);
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  }
}
