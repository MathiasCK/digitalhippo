import { ProductReel } from "@/components/Products";
import { MaxWidthWrapper } from "@/components/ui";
import { Button, buttonVariants } from "@/components/ui/Button";
import { ArrowDownToLine, CheckCircle, Leaf } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";

const perks = [
  {
    name: "Instant Delivery",
    Icon: <ArrowDownToLine />,
    desription:
      "Get your assets delivered to your email in seconds and download them right away.",
  },
  {
    name: "Guaranteed Quality",
    Icon: <CheckCircle />,
    desription:
      "Every asset on our platform is verified by our team to ensure our highest quality standards. Not happy? We offer a 30-day money-back guarantee.",
  },
  {
    name: "For the Planet",
    Icon: <Leaf />,
    desription:
      "We've pledged 1% of sales to the preservation and restoration of the natural enviroment.",
  },
];

const Home = () => {
  return (
    <Fragment>
      <MaxWidthWrapper>
        <div className="py-20 mx-auto text-center flex flex-col items-center max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6-xl">
            Your marketprace for high-quality{" "}
            <span className="text-blue-600">digital assets</span>.
          </h1>
          <p className="mt-6 text-lg max-w-prose text-muted-foreground">
            Welcome to DigitalHippo. Every asset on our platform is verified by
            our team to ensure our highest quality standards.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Link href="/products" className={buttonVariants()}>
              Browse Trending
            </Link>
            <Button variant="ghost">Our quality promise &rarr;</Button>
          </div>
        </div>
        <ProductReel
          title="Brand new"
          href="/products"
          query={{
            sort: "desc",
            limit: 4,
          }}
        />
      </MaxWidthWrapper>
      <section className="border-t border-gray-200 bg-gray-50">
        <MaxWidthWrapper className="py-20">
          <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-0">
            {perks.map(perk => (
              <div
                key={perk.name}
                className="text-center md:flex md:items-start md:text-left lg:block lg:text-center"
              >
                <div className="md:flex-shrink-0 flex justify-center">
                  <div className="h-16 w-16 flex items-center justify-center rounded-full bg-blue-100 text-blue-900">
                    <div className="w-1/3 h-1/3">{perk.Icon}</div>
                  </div>
                </div>
                <div className="mt-6 md:ml-4 md:mt-0 lg:ml-0 lg:mt-6">
                  <h3 className="text-base font-medium text-gray-900">
                    {perk.name}
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {perk.desription}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </MaxWidthWrapper>
      </section>
    </Fragment>
  );
};

export default Home;
