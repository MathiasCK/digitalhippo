import { useRouter } from "next/navigation";
import { toast } from "sonner";

const useAuth = () => {
  const router = useRouter();

  const signOut = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_PAYLOAD_SERVER_URL}/api/users/logout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        },
      );
      if (!res.ok) {
        throw new Error();
      }

      toast.success("Logged out successfully.");

      router.push("/sign-in");
      router.refresh();
    } catch (error) {
      toast.error("Colud not log out. Please try again.");
    }
  };
  return { signOut };
};

export default useAuth;
