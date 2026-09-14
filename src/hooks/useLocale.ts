import { useLocation } from "@tanstack/react-router";

export function useIsArabic(): boolean {
  const location = useLocation();
  return location.pathname === "/ar" || location.pathname.startsWith("/ar/");
}
