import { notFound } from "next/navigation";
import { RESOURCES } from "@/lib/admin/resources";
import { ResourceForm } from "@/components/admin/ResourceForm";

export default async function ResourceEditPage({ params }: { params: Promise<{ resource: string; id: string }> }) {
  const { resource, id } = await params;
  if (!RESOURCES[resource]) notFound();
  return <ResourceForm resourceKey={resource} id={id} />;
}
