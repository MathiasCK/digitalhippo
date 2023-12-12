"use client";

import { Button, buttonVariants } from "@/components/ui/Button";
import Icons from "@/components/ui/Icons";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { ArrowRight } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Fragment } from "react";
import { cn } from "@/lib/utils";
import {
  AuthCredentials,
  AuthCredentialsValidator,
} from "@/lib/validators/account-credentials";
import { trpc } from "@/trpc/client";

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthCredentials>({
    resolver: zodResolver(AuthCredentialsValidator),
  });

  const { mutate } = trpc.auth.createPayloadUser.useMutation({});

  const onSubmit = ({
    email,
    password,
    passwordConfirmation,
  }: AuthCredentials) => {
    mutate({ email, password, passwordConfirmation });
  };

  return (
    <Fragment>
      <div className="container relative flex pt-20 flex-col items-center justify-center lg:px-0">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col items-center space-y-2 text-center">
            <Icons.logo className="w-20 h-20" />
            <h1 className="text-2xl font-bold">Create an account</h1>
            <Link
              className={buttonVariants({
                variant: "link",
                className: "gap-1.5",
              })}
              href="/sign-in"
            >
              Already have an account? Sign in
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-6">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-2">
                <div className="grid gap-1 py-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    {...register("email")}
                    className={cn({
                      "focus-visible:ring-red-500": errors.email,
                    })}
                    placeholder="you@example.com"
                  />
                  {errors.email && (
                    <p className="max-w-prose text-muted-foreground text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-1 py-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    type="password"
                    {...register("password")}
                    className={cn({
                      "focus-visible:ring-red-500": errors.password,
                    })}
                    placeholder="Password"
                  />
                  {errors.password && (
                    <p className="max-w-prose text-muted-foreground text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-1 py-2">
                  <Label htmlFor="passwordConfirmation">Repeat password</Label>
                  <Input
                    type="password"
                    {...register("passwordConfirmation")}
                    className={cn({
                      "focus-visible:ring-red-500": errors.passwordConfirmation,
                    })}
                    placeholder="Password"
                  />
                  {errors.passwordConfirmation && (
                    <p className="max-w-prose text-muted-foreground text-red-500">
                      {errors.passwordConfirmation.message}
                    </p>
                  )}
                </div>
                <Button>Sign up</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default SignUp;
