
import React from "react";

import {
  FileText,
  Clock,
  CheckCircle2,
  Store,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { ShopStatus } from "../../types";
import { STATUS_META } from "@/data/mockdata";

interface ShopStatusBadgeProps {
  status?: ShopStatus;
  size?: "sm" | "md" | "lg";

  showIcon?: boolean;
}

export const ShopStatusBadge: React.FC<ShopStatusBadgeProps> = ({
  status,

  size = "md",
  showIcon = true,
}) => {
  const meta = (status && STATUS_META[status]) ? STATUS_META[status] : STATUS_META.Draft;

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5 gap-1",
    md: "text-xs px-2.5 py-1 gap-1.5 font-medium",
    lg: "text-sm px-3.5 py-1.5 gap-2 font-semibold",
  }[size];

  const getIcon = () => {
    const iconSize = size === "lg" ? 16 : 14;
    switch (status) {
      case "Draft":
        return <FileText size={iconSize} />;
      case "Pending":
        return <Clock size={iconSize} />;
      case "Approved":
        return <CheckCircle2 size={iconSize} />;
      case "Active":
        return <Store size={iconSize} />;
      case "Rejected":
        return <XCircle size={iconSize} />;
      case "Suspended":
        return <AlertTriangle size={iconSize} />;
    }
  };

  return (
    <span

      id={`shop-status-badge-${(status || "Draft").toLowerCase()}`}

      className={`inline-flex items-center rounded-full border shadow-xs transition-colors duration-150 ${meta.badgeClass} ${sizeClasses}`}
    >
      {showIcon && getIcon()}
      <span>{meta.label}</span>
    </span>
  );
};

