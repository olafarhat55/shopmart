"use client";

import React from "react";
import { MapPin, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { IShippingAddress } from "@/interfaces";
import { toast } from "sonner";

type Props = {
  address: IShippingAddress;
  selected?: boolean;
  compact?: boolean;
  showActions?: boolean;
  onEdit?: () => void;
  onRemove?: () => void;
  onClick?: () => void;
  className?: string;
};

export default function AddressCard({
  address,
  selected,
  compact = false,
  showActions = true,
  onEdit,
  onRemove,
  onClick,
  className,
}: Props) {
  return (
    <div
      onClick={onClick}
      className={`w-full ${compact ? "p-2" : "p-3"} rounded-lg border flex items-start justify-between gap-3 cursor-pointer bg-gradient-to-r from-white/2 to-background hover:shadow-md ${className ?? ""}`}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-11 h-11 rounded-lg flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 flex-shrink-0">
          <MapPin className="h-5 w-5 text-primary" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="font-medium truncate">{address?.name ?? "Address"}</div>
            {address?.city && <Badge className="bg-primary">{address.city}</Badge>}
          </div>
          {address?.details && <div className="text-xs text-muted-foreground truncate">{address.details}</div>}
          {address?.phone && <div className="text-xs text-muted-foreground mt-1">{address.phone}</div>}
        </div>
      </div>

      <div className="flex items-center gap-2 ml-3">
        {selected ? (
          <div className="flex items-center gap-2">
            <Badge variant={"outline"} className="text-sm text-emerald-700 font-medium">Selected</Badge>
          </div>
        ) : null}

        {showActions ? (
          <>
            <Button
              size="sm"
              variant="ghost"
              className="p-1 hover:bg-primary/5 bg-transparent"
              onClick={(e) => { e.stopPropagation(); onEdit?.(); }}
              title="Edit"
            >
              <Edit2 className="h-4 w-4 text-muted-foreground" />
            </Button>

            <Button
              size="sm"
              variant="ghost"
              className="p-1 hover:bg-primary/5 bg-transparent"
              onClick={(e) => { e.stopPropagation(); onRemove?.(); toast.info("Address removed successfully") }}
              title="Remove"
            >
              <Trash2 className="h-4 w-4 text-red-600" />
            </Button>
          </>
        ) : null}
      </div>
    </div>
  );
}