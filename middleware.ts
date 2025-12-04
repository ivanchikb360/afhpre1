import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Protect admin routes - require Supabase to be configured
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    // If Supabase not configured, block admin access in production
    if (request.nextUrl.pathname.startsWith("/admin")) {
      if (process.env.NODE_ENV === "production") {
        // In production, block access if Supabase not configured
        return NextResponse.json(
          { error: "Admin access requires Supabase configuration" },
          { status: 503 }
        );
      }
      // In development, allow access
      return NextResponse.next();
    }
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Protect admin routes
  if (
    request.nextUrl.pathname.startsWith("/admin") &&
    request.nextUrl.pathname !== "/admin/login"
  ) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // Redirect to admin if already logged in and trying to access login
  if (request.nextUrl.pathname === "/admin/login") {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
