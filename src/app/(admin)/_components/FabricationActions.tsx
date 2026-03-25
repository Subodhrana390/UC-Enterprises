"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { updateFabricationStatus, deleteFabricationRequest } from "@/lib/actions/fabrication";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function FabricationActions({ request }: { request: any }) {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"status" | "delete">("status");
  const [selectedStatus, setSelectedStatus] = useState(request.status);
  const [adminNotes, setAdminNotes] = useState(request.admin_notes || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusUpdate = async () => {
    setIsLoading(true);
    const result = await updateFabricationStatus(request.id, selectedStatus, adminNotes);
    setIsLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Status updated successfully");
      setIsDialogOpen(false);
      router.refresh();
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    const result = await deleteFabricationRequest(request.id);
    setIsLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Request deleted successfully");
      setIsDialogOpen(false);
      router.refresh();
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <span className="material-symbols-outlined text-lg">more_vert</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => {
              setDialogType("status");
              setIsDialogOpen(true);
            }}
          >
            Update Status
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setDialogType("delete");
              setIsDialogOpen(true);
            }}
            className="text-red-600"
          >
            Delete Request
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogType === "status" ? "Update Request Status" : "Delete Request"}
            </DialogTitle>
            <DialogDescription>
              {dialogType === "status"
                ? "Update the status and add notes for this fabrication request."
                : "Are you sure you want to delete this request? This action cannot be undone."}
            </DialogDescription>
          </DialogHeader>

          {dialogType === "status" && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Admin Notes</label>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add notes about this request..."
                  rows={4}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={dialogType === "status" ? handleStatusUpdate : handleDelete}
              disabled={isLoading}
              className={dialogType === "delete" ? "bg-red-600 hover:bg-red-700" : ""}
            >
              {isLoading ? "Processing..." : dialogType === "status" ? "Update" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
