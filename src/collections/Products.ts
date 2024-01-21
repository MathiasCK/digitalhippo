import { BeforeChangeHook } from "payload/dist/globals/config/types";
import { PRODUCT_CATEGORIES } from "../config";
import { Product, User } from "../payload-types";
import { Access, CollectionConfig, PayloadRequest } from "payload/types";
import { stripe } from "../lib/stripe";

const addUser = async ({
  req,
  data,
}: {
  req: PayloadRequest;
  data: Partial<any>;
}) => {
  const user = req.user;

  return {
    ...data,
    user: user.id,
  };
};

const syncUser = async ({
  req,
  doc,
}: {
  req: PayloadRequest;
  doc: Partial<any>;
}) => {
  const fullUser = await req.payload.findByID({
    collection: "users",
    id: req.user.id,
  });

  if (fullUser && typeof fullUser === "object") {
    const { products } = fullUser;

    const allProductIds = [
      ...(products?.map(product =>
        typeof product === "object" ? product.id : product,
      ) || []),
    ];

    const createdProductIds = allProductIds.filter(
      (id, idx) => allProductIds.indexOf(id) === idx,
    );

    const dataToUpdate = [...createdProductIds, doc.id];

    await req.payload.update({
      collection: "users",
      id: req.user.id,
      data: {
        products: dataToUpdate,
      },
    });
  }
};

// @ts-ignore
const handleStripeProduct = async args => {
  if (args.operation === "create") {
    const data = args.data as Product;
    const createdProduct = await stripe.products.create({
      name: data.name,
      default_price_data: {
        currency: "usd",
        unit_amount: Math.round(data.price * 100),
      },
    });

    const updated: Product = {
      ...data,
      stripeId: createdProduct.id,
      priceId: createdProduct.default_price as string,
    };

    return updated;
  } else if (args.operation === "update") {
    const data = args.data as Product;
    const updatedProduct = await stripe.products.update(
      data.stripeId as string,
      {
        name: data.name,
        default_price: data.priceId as string,
      },
    );

    const updated: Product = {
      ...data,
      stripeId: updatedProduct.id,
      priceId: updatedProduct.default_price as string,
    };

    return updated;
  }
};

const isAdminOrHasAccess =
  (): Access =>
  ({ req: { user: _user } }) => {
    const user = _user as User | undefined;

    if (!user) return false;
    if (user.role === "admin") return true;

    const userProductIds = (user.products || []).reduce<string[]>(
      (acc, product) => {
        if (!product) return acc;
        if (typeof product === "string") {
          acc.push(product);
        } else {
          acc.push(product.id);
        }
        return acc;
      },
      [],
    );

    return {
      id: {
        in: userProductIds,
      },
    };
  };

const Products: CollectionConfig = {
  slug: "products",
  admin: {
    useAsTitle: "name",
  },
  access: {
    read: isAdminOrHasAccess(),
    update: isAdminOrHasAccess(),
    delete: isAdminOrHasAccess(),
  },
  hooks: {
    afterChange: [syncUser],
    beforeChange: [addUser, handleStripeProduct],
  },
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
      hasMany: false,
      admin: {
        condition: () => false,
      },
    },
    {
      name: "name",
      label: "Name",
      type: "text",
      required: true,
    },
    {
      name: "description",
      type: "textarea",
      label: "Product details",
    },
    {
      name: "price",
      type: "number",
      label: "Price in USD",
      min: 0,
      max: 1000,
      required: true,
    },
    {
      name: "category",
      label: "Category",
      type: "select",
      options: PRODUCT_CATEGORIES.map(({ label, value }) => ({ label, value })),
      required: true,
    },
    {
      name: "product_files",
      label: "Product File(s)",
      type: "relationship",
      required: true,
      relationTo: "product_files",
      hasMany: false,
    },
    {
      name: "approvedForSale",
      label: "Product Status",
      type: "select",
      access: {
        create: ({ req }) => req.user.role === "admin",
        read: ({ req }) => req.user.role === "admin",
        update: ({ req }) => req.user.role === "admin",
      },
      defaultValue: "pending",
      options: [
        { label: "Pending", value: "pending" },
        { label: "Approved", value: "approved" },
        { label: "Rejected", value: "rejected" },
      ],
    },
    {
      name: "priceId",
      access: {
        create: () => false,
        read: () => false,
        update: () => false,
      },
      type: "text",
      admin: {
        hidden: true,
      },
    },
    {
      name: "stripeId",
      access: {
        create: () => false,
        read: () => false,
        update: () => false,
      },
      type: "text",
      admin: {
        hidden: true,
      },
    },
    {
      name: "images",
      label: "Product Images",
      type: "array",
      minRows: 1,
      maxRows: 4,
      required: true,
      labels: {
        singular: "Image",
        plural: "Images",
      },
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true,
        },
      ],
    },
  ],
};

export default Products;
