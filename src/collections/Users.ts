import { CollectionConfig } from "payload/types";

const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  access: {
    read: () => true,
    create: () => true,
  },
  fields: [
    {
      name: "role",
      required: true,
      defaultValue: "user",
      admin: {
        condition: (_, siblingData) => siblingData.role === "admin",
      },
      type: "select",
      options: [
        {
          label: "Admin",
          value: "admin",
        },
        {
          label: "User",
          value: "user",
        },
      ],
    },
  ],
};

export default Users;
