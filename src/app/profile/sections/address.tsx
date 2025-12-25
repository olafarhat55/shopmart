"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AddressCard from "@/components/AddressCard";
import AddressDialog from "@/components/checkout/AddressDialog";
import type { IShippingAddress } from "@/interfaces";
import { apiService } from "@/service/apiService";

type Props = {
  addresses: IShippingAddress[];
  setAddresses: React.Dispatch<React.SetStateAction<IShippingAddress[]>>;
};

export default function AddressesSection({ addresses, setAddresses }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<IShippingAddress | null>(null);

  const openAdd = () => {
    setEditingAddress(null);
    setDialogOpen(true);
  };

  const openEdit = (addr: IShippingAddress) => {
    setEditingAddress(addr);
    setDialogOpen(true);
  };

  const handleRemove = async (id?: string) => {
    if (!id) return;
    const updated : IShippingAddress[] = addresses.filter((a) => a._id !== id) as IShippingAddress[];
    setAddresses(updated);
    try {
      const res = await apiService.deleteAddress(id);
      if (res?.status === "success" && Array.isArray(res.data)) {
        setAddresses(res.data);
      }
    } catch (err) {
      console.error("AddressesSection delete failed", err);
      // refetch fallback
      try {
        const r = await apiService.getAddresses();
        if (r?.data) setAddresses(r.data);
      } catch {}
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Addresses</h3>
        <div className="flex items-center gap-3">
          <Button onClick={openAdd} variant="default"><Plus className="h-4 w-4 mr-2" /> Add new address</Button>
        </div>
      </div>

      <Card className="rounded-xl border">
        <CardContent>
          <div className="space-y-3">
            {addresses.length === 0 ? (
              <div className="text-sm text-muted-foreground">No addresses yet.</div>
            ) : (
              addresses.map((a, idx) => (
                <div key={a._id ?? idx} onClick={() => {}}>
                  <AddressCard
                    address={a}
                    selected={false}
                    onEdit={() => openEdit(a)}
                    onRemove={() => handleRemove(a._id)}
                  />
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <AddressDialog
        editedAddress={editingAddress}
        open={dialogOpen}
        onOpenChange={(v) => {
          setDialogOpen(v);
          if (!v) setEditingAddress(null);
        }}
        setAddresses={setAddresses}
      />
    </div>
  );
}