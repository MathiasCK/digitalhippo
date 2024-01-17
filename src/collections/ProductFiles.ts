import { User } from "../payload-types";
import { Access, CollectionConfig, PayloadRequest } from "payload/types";

const addUserToProductFile = async ({
  req,
  data,
}: {
  req: PayloadRequest;
  data: Partial<any>;
}) => {
  const user = req.user as User | null;
  return { ...data, user: user?.id };
};

const yourOwnAndPurchasedFiles: Access = async ({ req }) => {
  const user = req.user as User | null;

  if (!user) return false;
  if (user.role === "admin") return true;

  const { docs: products } = await req.payload.find({
    collection: "products",
    depth: 0,
    where: {
      user: {
        equals: user.id,
      },
    },
  });

  const ownProductIds = products.map(product => product.product_files).flat();

  const { docs: orders } = await req.payload.find({
    collection: "orders",
    depth: 2,
    where: {
      user: {
        equals: user.id,
      },
    },
  });

  const purchasedProductIds = orders
    .map(order =>
      order.products.map(product => {
        if (typeof product === "string")
          return req.payload.logger.error(
            `Product ID is a string: ${product} - Search depth is too shallow`,
          );
        return typeof product.product_files === "string"
          ? product.product_files
          : product.product_files.id;
      }),
    )
    .filter(Boolean)
    .flat();

  return {
    id: {
      in: [...ownProductIds, ...purchasedProductIds],
    },
  };
};

const ProductFiles: CollectionConfig = {
  slug: "product_files",
  admin: {
    hidden: ({ user }) => user.role !== "admin",
  },
  hooks: {
    beforeChange: [addUserToProductFile],
  },
  access: {
    read: ({ req }) => yourOwnAndPurchasedFiles({ req }),
    update: ({ req }) => req.user.role === "admin",
    delete: ({ req }) => req.user.role === "admin",
  },
  upload: {
    staticURL: "/product_files",
    staticDir: "product_files",
    mimeTypes: ["image/*", "font/*", "application/postscript"],
  },
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      admin: { condition: () => false },
      hasMany: false,
      required: true,
    },
  ],
};

export default ProductFiles;
