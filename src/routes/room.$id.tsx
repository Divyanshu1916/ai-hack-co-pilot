import { createFileRoute, Outlet } from "@tanstack/react-router";
import { RoomShell } from "@/components/RoomShell";

export const Route = createFileRoute("/room/$id")({
  component: () => (
    <RoomShell>
      <Outlet />
    </RoomShell>
  ),
});
