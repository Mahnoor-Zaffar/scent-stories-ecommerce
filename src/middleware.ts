import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const mockRegion =
    request.headers.get("x-mock-region") ??
    request.nextUrl.searchParams.get("region");

  if (mockRegion) {
    response.headers.set("x-detected-region", mockRegion);
  } else {
    const acceptLanguage = request.headers.get("accept-language") ?? "en-US";
    let region = "US";
    if (acceptLanguage.includes("ja")) region = "JP";
    else if (acceptLanguage.includes("ar")) region = "AE";
    else if (acceptLanguage.includes("de") || acceptLanguage.includes("fr"))
      region = "EU";
    else if (acceptLanguage.includes("en-GB")) region = "GB";
    response.headers.set("x-detected-region", region);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
