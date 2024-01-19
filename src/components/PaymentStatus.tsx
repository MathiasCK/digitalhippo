"use client";

import { trpc } from "@/trpc/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface PaymentStatusProps {
  orderEmail: string;
  orderId: string;
  isPaid: boolean;
}

const PaymentStatus = ({ orderEmail, orderId, isPaid }: PaymentStatusProps) => {
  const router = useRouter();
  const { data: order } = trpc.payment.pullOrderStatus.useQuery(
    { orderId },
    {
      enabled: !isPaid,
      refetchInterval: data => (data?.isPaid ? false : 1000),
    },
  );

  useEffect(() => {
    if (order?.isPaid) {
      router.refresh();
    }
  }, [order?.isPaid, router]);

  return (
    <div className="mt-16 grid grid-cols-2 gap-x-4 text-small text-gray-600">
      <div>
        <p className="font-medium text-gray-900">Shipping to</p>
        <p>{orderEmail}</p>
      </div>
      <div>
        <p className="font-medium text-gray-900">Order status</p>
        <p>{isPaid ? "Payment successful" : "Pending payment"} </p>
      </div>
    </div>
  );
};

export default PaymentStatus;
