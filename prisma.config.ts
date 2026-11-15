const prismaConfig = {
  schema: "prisma/scheme.prisma",
  datasource: {
    url: process.env["DATABASE_URL"],
  },
};

export default prismaConfig;
