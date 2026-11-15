import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import PYQDetailClient from "./PYQDetailClient";
import type { Metadata } from "next";

import type { Topic } from "@/types";

export const metadata: Metadata = {
  title: "Tag PYQ Questions | Admin Portal",
  description: "Tag PYQ questions with subject topics.",
};

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PYQAdminDetailPage({ params }: PageProps) {
  const { id } = await params;

  let pyq = null;
  let subjectTopics: Topic[] = [];

  try {
    pyq = await prisma.pYQ.findUnique({
      where: { id },
      include: {
        subject: {
          include: {
            semester: {
              include: {
                course: true,
              },
            },
          },
        },
        topics: {
          include: {
            topic: true,
          },
        },
      },
    });

    if (pyq?.subjectId) {
      subjectTopics = await prisma.topic.findMany({
        where: { subjectId: pyq.subjectId },
        orderBy: { name: "asc" },
      });
    }
  } catch (error) {
    console.error("Failed to load PYQ from database:", error);
  }

  if (!pyq) {
    notFound();
  }

  return <PYQDetailClient pyq={pyq} availableTopics={subjectTopics} />;
}
