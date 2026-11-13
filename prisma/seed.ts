import {
  Difficulty,
  ExamType,
  NoticeCategory,
  PrismaClient,
  ResourceType,
  Role,
} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting IPU Student Portal database seeding...');

  const cseCourse = await prisma.course.upsert({
    where: { code: 'BTECH-CSE' },
    update: { name: 'B.Tech Computer Science & Engineering' },
    create: {
      id: 'seed-course-btech-cse',
      name: 'B.Tech Computer Science & Engineering',
      code: 'BTECH-CSE',
    },
  });

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@quantxlearning.edu.in' },
    update: { name: 'IPU Portal Admin', role: Role.ADMIN, courseId: cseCourse.id },
    create: {
      id: 'seed-user-admin',
      name: 'IPU Portal Admin',
      email: 'admin@quantxlearning.edu.in',
      role: Role.ADMIN,
      courseId: cseCourse.id,
    },
  });

  const moderatorUser = await prisma.user.upsert({
    where: { email: 'moderator@quantxlearning.edu.in' },
    update: { name: 'Academic Coordinator', role: Role.MODERATOR, courseId: cseCourse.id },
    create: {
      id: 'seed-user-moderator',
      name: 'Academic Coordinator',
      email: 'moderator@quantxlearning.edu.in',
      role: Role.MODERATOR,
      courseId: cseCourse.id,
    },
  });

  await prisma.user.upsert({
    where: { email: 'student@quantxlearning.edu.in' },
    update: { name: 'Aarav Sharma', role: Role.STUDENT, courseId: cseCourse.id, semester: 3 },
    create: {
      id: 'seed-user-student',
      name: 'Aarav Sharma',
      email: 'student@quantxlearning.edu.in',
      role: Role.STUDENT,
      courseId: cseCourse.id,
      semester: 3,
    },
  });

  const sem3 = await prisma.semester.upsert({
    where: { courseId_number: { courseId: cseCourse.id, number: 3 } },
    update: {},
    create: { id: 'seed-sem-3', number: 3, courseId: cseCourse.id },
  });

  const sem4 = await prisma.semester.upsert({
    where: { courseId_number: { courseId: cseCourse.id, number: 4 } },
    update: {},
    create: { id: 'seed-sem-4', number: 4, courseId: cseCourse.id },
  });

  const dsaSubject = await prisma.subject.upsert({
    where: { id: 'seed-sub-dsa' },
    update: { name: 'Data Structures & Algorithms', code: 'CIC-209', semesterId: sem3.id },
    create: { id: 'seed-sub-dsa', name: 'Data Structures & Algorithms', code: 'CIC-209', semesterId: sem3.id },
  });

  const dbmsSubject = await prisma.subject.upsert({
    where: { id: 'seed-sub-dbms' },
    update: { name: 'Database Management Systems', code: 'CIC-205', semesterId: sem3.id },
    create: { id: 'seed-sub-dbms', name: 'Database Management Systems', code: 'CIC-205', semesterId: sem3.id },
  });

  const osSubject = await prisma.subject.upsert({
    where: { id: 'seed-sub-os' },
    update: { name: 'Operating Systems', code: 'CIC-206', semesterId: sem4.id },
    create: { id: 'seed-sub-os', name: 'Operating Systems', code: 'CIC-206', semesterId: sem4.id },
  });
  const dsaUnit1 = await prisma.unit.upsert({
    where: { id: 'seed-unit-dsa-1' },
    update: { name: 'Arrays, Linked Lists & Asymptotic Analysis', number: 1, subjectId: dsaSubject.id },
    create: { id: 'seed-unit-dsa-1', name: 'Arrays, Linked Lists & Asymptotic Analysis', number: 1, subjectId: dsaSubject.id },
  });

  const dbmsUnit1 = await prisma.unit.upsert({
    where: { id: 'seed-unit-dbms-1' },
    update: { name: 'ER Modeling, Relational Algebra & SQL', number: 1, subjectId: dbmsSubject.id },
    create: { id: 'seed-unit-dbms-1', name: 'ER Modeling, Relational Algebra & SQL', number: 1, subjectId: dbmsSubject.id },
  });

  const osUnit1 = await prisma.unit.upsert({
    where: { id: 'seed-unit-os-1' },
    update: { name: 'Process Scheduling & Deadlocks', number: 1, subjectId: osSubject.id },
    create: { id: 'seed-unit-os-1', name: 'Process Scheduling & Deadlocks', number: 1, subjectId: osSubject.id },
  });

  await prisma.resource.upsert({
    where: { id: 'seed-res-dsa-notes' },
    update: {},
    create: {
      id: 'seed-res-dsa-notes',
      title: 'Complete Unit 1 Lecture Notes — Complexity & Linked Lists',
      description: 'Comprehensive notes covering Big-O notation and pointer operations.',
      type: ResourceType.NOTES,
      fileUrl: 'https://example.com/ipu/cse/sem3/dsa-unit1-notes.pdf',
      subjectId: dsaSubject.id,
      unitId: dsaUnit1.id,
      uploadedById: moderatorUser.id,
      views: 142,
      downloads: 89,
    },
  });

  await prisma.resource.upsert({
    where: { id: 'seed-res-dbms-lab' },
    update: {},
    create: {
      id: 'seed-res-dbms-lab',
      title: 'DBMS SQL & Normalization Lab Manual',
      description: 'Lab exercises covering joins, triggers, and 1NF–BCNF decomposition.',
      type: ResourceType.LAB_MANUAL,
      fileUrl: 'https://example.com/ipu/cse/sem3/dbms-lab-manual.pdf',
      subjectId: dbmsSubject.id,
      unitId: dbmsUnit1.id,
      uploadedById: adminUser.id,
      views: 210,
      downloads: 155,
    },
  });

  await prisma.resource.upsert({
    where: { id: 'seed-res-os-revision' },
    update: {},
    create: {
      id: 'seed-res-os-revision',
      title: 'CPU Scheduling & Banker’s Algorithm Revision Sheet',
      description: 'Quick formula and Gantt-chart guide for FCFS, SJF, and Round Robin.',
      type: ResourceType.REVISION_MATERIAL,
      fileUrl: 'https://example.com/ipu/cse/sem4/os-unit1-revision.pdf',
      subjectId: osSubject.id,
      unitId: osUnit1.id,
      uploadedById: moderatorUser.id,
      views: 176,
      downloads: 121,
    },
  });

  await prisma.pYQ.upsert({
    where: { id: 'seed-pyq-dsa-2025' },
    update: {},
    create: {
      id: 'seed-pyq-dsa-2025',
      subjectId: dsaSubject.id,
      year: 2025,
      examType: ExamType.END_SEM,
      fileUrl: 'https://example.com/ipu/pyqs/cic-209-endsem-2025.pdf',
    },
  });

  await prisma.question.upsert({
    where: { id: 'seed-q-dbms-1' },
    update: {},
    create: {
      id: 'seed-q-dbms-1',
      subjectId: dbmsSubject.id,
      unitId: dbmsUnit1.id,
      topic: 'Relational Algebra & Joins',
      difficulty: Difficulty.MEDIUM,
      text: 'Differentiate between Natural Join and Equi-Join with a relational schema example.',
      answer: 'An Equi-Join retains duplicate join columns, whereas Natural Join automatically projects out duplicate attributes.',
    },
  });

  await prisma.notice.upsert({
    where: { id: 'seed-notice-exam-schedule' },
    update: {},
    create: {
      id: 'seed-notice-exam-schedule',
      title: 'GGSIPU End-Semester Theory Examination Datesheet Released',
      description: 'Tentative datesheet for B.Tech Semester 3 and 4 theory examinations.',
      category: NoticeCategory.EXAMINATION,
      attachmentUrl: 'https://example.com/ipu/notices/endsem-datesheet.pdf',
      source: 'GGSIPU Examination Division',
      published: true,
      publishedById: adminUser.id,
    },
  });

  console.log('Database seeding completed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error('Database seeding failed:', error);
    await prisma.$disconnect();
    process.exit(1);
  });
