"use client";

import { Home, Search, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface EmptyStateProps {
  icon?: "home" | "search" | "map";
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon = "home",
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  const iconMap = {
    home: Home,
    search: Search,
    map: MapPin,
  };

  const Icon = iconMap[icon];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-20 px-4"
    >
      <div className="max-w-md mx-auto">
        <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon className="h-12 w-12 text-primary/60" />
        </div>
        
        <h3 className="text-2xl font-bold mb-3">{title}</h3>
        <p className="text-gray-400 mb-8">{description}</p>
        
        {(actionLabel && actionHref) && (
          <Link href={actionHref} className="btn-primary inline-flex items-center gap-2">
            {actionLabel}
          </Link>
        )}
        
        {actionLabel && onAction && (
          <button onClick={onAction} className="btn-primary inline-flex items-center gap-2">
            {actionLabel}
          </button>
        )}
      </div>
    </motion.div>
  );
}

