import { User } from "../payload-types";
import { Access, CollectionConfig, PayloadRequest } from "payload/types";

const isAdminOrHasAccessToImages =
  (): Access =>
  async ({ req }) => {
    const user = req.user as User | undefined;

    if (!user) return false;
    if (user.role === "admin") return true;

    return {
      // User field from Media collection
      user: {
        // User owns image
        equals: req.user.id,
      },
    };
  };
const assosiateImageToUser = ({
  req,
  data,
}: {
  req: PayloadRequest;
  data: Partial<any>;
}) => ({
  ...data,
  user: req.user.id,
});

const Media: CollectionConfig = {
  slug: "media",
  hooks: {
    beforeChange: [assosiateImageToUser],
  },
  admin: {
    hidden: ({ user }) => user.role !== "admin",
  },
  access: {
    read: async ({ req }) => {
      const { referer } = req.headers;

      // Users who are not logged in or not viewing via dashboard (not in the backend) can see all the images
      if (!req.user || !referer?.includes("dashboard")) {
        return true;
      }

      return await isAdminOrHasAccessToImages()({ req });
    },
    delete: ({ req }) => isAdminOrHasAccessToImages()({ req }),
    update: ({ req }) => isAdminOrHasAccessToImages()({ req }),
  },
  upload: {
    staticURL: "/media",
    staticDir: "media",
    imageSizes: [
      {
        name: "thumbnail",
        width: 400,
        height: 300,
        position: "centre",
      },
      {
        name: "card",
        width: 768,
        height: 1024,
        position: "centre",
      },
      {
        name: "tabled",
        width: 1024,
        height: undefined,
        position: "centre",
      },
    ],
    mimeTypes: ["image/*"],
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
  ],
};

export default Media;
