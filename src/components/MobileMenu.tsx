import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useIsArabic } from "@/hooks/useLocale";

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const isArabic = useIsArabic();
  const labels = isArabic
    ? {
        menu: "القائمة",
        open: "فتح القائمة",
        close: "إغلاق القائمة",
        description: "روابط التنقل الرئيسية",
        home: "الرئيسية",
        shop: "المتجر",
        journal: "المجلة",
        language: "English",
      }
    : {
        menu: "Menu",
        open: "Open menu",
        close: "Close menu",
        description: "Main navigation links",
        home: "Home",
        shop: "Shop",
        journal: "Journal",
        language: "العربية",
      };

  const itemClass =
    "block border-b border-border px-6 py-5 text-xl font-medium text-foreground transition-colors hover:bg-secondary focus-visible:bg-secondary focus-visible:outline-none";

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 sm:hidden"
          aria-label={labels.open}
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        dir={isArabic ? "rtl" : "ltr"}
        closeLabel={labels.close}
        className={`w-[88%] max-w-sm p-0 sm:hidden ${isArabic ? "font-arabic" : ""}`}
      >
        <SheetHeader className={`border-b px-6 py-6 ${isArabic ? "text-right" : "text-left"}`}>
          <SheetTitle className="text-2xl font-medium">{labels.menu}</SheetTitle>
          <SheetDescription className="sr-only">{labels.description}</SheetDescription>
        </SheetHeader>
        <nav aria-label={labels.description}>
          <SheetClose asChild>
            <Link to={isArabic ? "/ar" : "/"} className={itemClass}>
              {labels.home}
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link
              to={isArabic ? "/ar" : "/"}
              hash={isArabic ? "collection-ar" : "collection"}
              className={itemClass}
            >
              {labels.shop}
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link to={isArabic ? "/ar/journal" : "/journal"} className={itemClass}>
              {labels.journal}
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link
              to={isArabic ? "/" : "/ar"}
              lang={isArabic ? "en" : "ar"}
              className={itemClass}
            >
              {labels.language}
            </Link>
          </SheetClose>
        </nav>
      </SheetContent>
    </Sheet>
  );
}