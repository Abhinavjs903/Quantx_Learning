import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import SubjectAdminClient from "./SubjectAdminClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Subject Topics & PYQ Admin | IPU Student Portal",
  description: "Manage subject topics and tag PYQ questions.",
};

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SubjectAdminPage({ params }: PageProps) {
  const { id } = await params;

  let subject = null;
  try {
    subject = await prisma.subject.findUnique({
      where: { id },
      include: {
        semester: {
          include: {
            course: true,
          },
        },
        topics: {
          include: {
            _count: {
              select: { questions: true },
            },
          },
          orderBy: { name: "asc" },
        },
        pyqs: {
          include: {
            topics: {
              include: {
                topic: true,
              },
            },
          },
          orderBy: { year: "desc" },
        },
      },
    });
  } catch (error) {
    console.error("Failed to load subject from database:", error);
  }

  if (!subject) {
    notFound();
  }

  return <SubjectAdminClient subject={subject} />;
}
