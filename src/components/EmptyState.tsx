"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Home, Search, Plus } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  actionHref?: string;
  variant?: "default" | "property" | "favorites";
}

export function EmptyState({
  title,
  description,
  icon,
  actionLabel,
  actionHref,
  variant = "default",
}: EmptyStateProps) {
  const defaultContent = {
    property: {
      title: "No Properties Found",
      description: "We couldn't find any properties matching your criteria. Try adjusting your search filters.",
      icon: <Home className="h-16 w-16 text-gray-400" />,
      actionLabel: "Browse All Properties",
      actionHref: "/properties",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
    },
    favorites: {
      title: "No Favorites Yet",
      description: "Start exploring properties and save your favorites to see them here.",
      icon: <Search className="h-16 w-16 text-gray-400" />,
      actionLabel: "Browse Properties",
      actionHref: "/properties",
      image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
    },
    default: {
      title: title || "Nothing Here Yet",
      description: description || "Check back later for new content.",
      icon: icon || <Home className="h-16 w-16 text-gray-400" />,
      actionLabel: actionLabel || "Go Home",
      actionHref: actionHref || "/",
      image: "https://images.unsplash.com/photo-1540541011368-8fc88765bbab?w=800&q=80",
    },
  };

  const content = defaultContent[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-20 px-4"
    >
      <div className="max-w-md mx-auto">
        {/* Background Image with Overlay */}
        <div className="relative h-64 rounded-2xl overflow-hidden mb-8 opacity-30">
          <Image
            src={content.image}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 400px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl" />
            <div className="relative bg-dark-200 rounded-full p-6">
              {content.icon}
            </div>
          </div>
        </div>

        {/* Text */}
        <h3 className="text-2xl font-bold mb-3">{content.title}</h3>
        <p className="text-gray-400 mb-8 max-w-sm mx-auto">{content.description}</p>

        {/* Action Button */}
        {actionHref && (
          <Link href={content.actionHref} className="btn-primary inline-flex items-center gap-2">
            {variant === "favorites" ? (
              <>
                <Search className="h-4 w-4" />
                {content.actionLabel}
              </>
            ) : variant === "property" ? (
              <>
                <Home className="h-4 w-4" />
                {content.actionLabel}
              </>
            ) : (
              content.actionLabel
            )}
          </Link>
        )}
      </div>
    </motion.div>
  );
}

