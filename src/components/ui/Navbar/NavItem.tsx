"use client";

import { FC } from "react";
import { Button } from "../Button";
import { PRODUCT_CATEGORIES } from "@/config";
import { ChevronDown, Link } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

type Category = (typeof PRODUCT_CATEGORIES)[number];

interface Props {
  category: Category;
  handleOpen: () => void;
  isOpen: boolean;
  isAnyOpen: boolean;
}

const NavItem: FC<Props> = ({ category, handleOpen, isOpen, isAnyOpen }) => {
  return (
    <div className="flex">
      <div className="relative flex items-center">
        <Button
          className="gap-1.5"
          onClick={handleOpen}
          variant={isOpen ? "secondary" : "ghost"}
        >
          {category.label}
          <ChevronDown
            className={cn("h-4 w-4 transition-all text-muted-foreground", {
              "-rotate-180": isOpen,
            })}
          />
        </Button>
      </div>
      {isOpen ? (
        <div
          className={cn(
            "absolute inset-x-0 top-full text-small text-muted-foreground",
            {
              "animate-in fade-in-10 slide-in-from-top-5": !isAnyOpen,
            },
          )}
        >
          <div
            className="absolute inset-0 top-1/2 bg-white shadow"
            aria-hidden="true"
          />
          <div className="relative bg-white">
            <div className="mx-auto max-w-7xl px-8">
              <div className="grid grid-cols-4 gap-x-8 gap-y-10 py-16">
                <div className="col-span-4 col-start-1 grid grid-cols-3 gap-x-8">
                  {category.fatured.map(item => (
                    <div
                      key={item.name}
                      className="group relative text-base sm:text-sm"
                    >
                      <div className="relative aspect-video overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
                        {/* TODO: skeleton loading */}
                        <Image
                          src={item.imageSrc}
                          fill
                          alt="Product category image"
                          className="object-cover object-center"
                        />
                      </div>
                      <Link
                        href={item.href}
                        className="mt-6 font-medium text-gray-900"
                      >
                        {item.name}
                      </Link>
                      <p className="mt-1" aria-hidden="true">
                        Shop now
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default NavItem;
