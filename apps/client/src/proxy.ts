import { NextRequest, NextResponse } from "next/server";

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get("access_token");

  const authenticated = token
    ? (
        await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/me`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token.value}` },
        })
      ).ok
    : false;

  console.log(authenticated);
  if (!authenticated) {
    if (pathname === "/login") {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname === "/" || pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
}

// Alternatively, you can use a default export:
// export default function proxy(request: NextRequest) { ... }

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
