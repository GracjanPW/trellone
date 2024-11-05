import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)", "/"]);

export default clerkMiddleware(async (auth, request) => {
  const { userId, orgId, redirectToSignIn } = await auth();
  if (userId && isPublicRoute(request)) {
    let path = "/select-org";
    if (orgId) {
      path = `/organization/${orgId}`;
    }
    const orgSelect = new URL(path, request.url);
    return NextResponse.redirect(orgSelect);
  }
  if (userId && !orgId && request.nextUrl.pathname !== "/select-org") {
    const orgSelect = new URL(`/select-org`, request.url);
    return NextResponse.redirect(orgSelect);
  }
  if (!userId && !isPublicRoute(request)) {
    return redirectToSignIn()
  }
},{debug:false});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
