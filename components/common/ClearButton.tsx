'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  label: string;
  endpoint: string;
  onCleared?: () => void;
};

export function ClearButton({
  label,
  endpoint,
  onCleared,
}: Props) {

  const [loading, setLoading] = useState(false);
  async function clear() {
    await fetch(endpoint, { method: "POST" });
    toast("Cleared data");
    onCleared?.();
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash/>
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {label}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete all data in this mode.
            <br />
            <b>This action cannot be undone.</b>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={clear}>
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
