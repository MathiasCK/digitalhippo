import { Access, CollectionConfig } from "payload/types";

const yourOwnOrders: Access = ({ req: { user } }) => {
  if (!user) return false;
  if (user.role === "admin") return true;

  return {
    user: {
      equals: user.id,
    },
  };
};

const Orders: CollectionConfig = {
  slug: "orders",
  admin: {
    useAsTitle: "Your orders",
    description: "Orders placed by you",
  },
  access: {
    read: ({ req }) => yourOwnOrders({ req }),
    update: ({ req }) => req.user.role === "admin",
    delete: ({ req }) => req.user.role === "admin",
    create: ({ req }) => req.user.role === "admin",
  },
  fields: [
    {
      name: "_isPaid",
      type: "checkbox",
      access: {
        read: ({ req }) => req.user.role === "admin",
        create: () => false,
        update: () => false,
      },
      admin: {
        hidden: true,
      },
      required: true,
    },
    {
      name: "user",
      type: "relationship",
      required: true,
      admin: {
        hidden: true,
      },
      relationTo: "users",
    },
    {
      name: "products",
      type: "relationship",
      relationTo: "products",
      required: true,
      hasMany: true,
    },
  ],
};

export default Orders;
