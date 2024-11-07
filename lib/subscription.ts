import {auth} from "@clerk/nextjs/server";
import { db } from "./db";

const DAY_IN_MS = 86_400_000;

export const checkSubscription = async () => {
  const {orgId} = await auth();
  if (!orgId) {
    return false;
  }
  const orgSubscription = await db.orgSubscription.findUnique({
    where:{
      orgId,
    },
    select:{
      stripeCustomerId:true,
      stripeCurrentPeriodEnd:true,
      stripePriceId:true,
      stripeSubscriptionId:true
    }
  })

  if (!orgSubscription) {
    return false
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
  const isValid = orgSubscription.stripeCustomerId && orgSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now()
  return !!isValid
}