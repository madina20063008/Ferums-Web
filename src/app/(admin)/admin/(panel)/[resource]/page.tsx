import { notFound } from "next/navigation";
import { RESOURCES } from "@/lib/admin/resources";
import { ResourceList } from "@/components/admin/ResourceList";

export default async function ResourceListPage({ params }: { params: Promise<{ resource: string }> }) {
  const { resource } = await params;
  if (!RESOURCES[resource]) notFound();
  return <ResourceList resourceKey={resource} />;
}
