import { auth } from "@/auth";
import {
    DEFAULT_LOGIN_REDIRECT,
    apiAuthPrefix,
    authRoutes,
    publicRoutes,
} from "@/routes";

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.some((route) => {
        // Convert the route pattern to a regex
        const pattern = new RegExp(`^${route.replace(/:\w+/g, "([^/]+)")}$`);
        return pattern.test(nextUrl.pathname);
    });
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);
    const isHomePage = nextUrl.pathname === "/";

    if (isPublicRoute) {
        return null;
    }

    if (isApiAuthRoute) {
        return null;
    }

    if (isAuthRoute) {
        if (isLoggedIn) {
            return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
        }
        return null;
    }

    if (!isLoggedIn) {
        return Response.redirect(new URL("/auth", nextUrl));
    }

    if (isHomePage) {
        return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }

    return null;
});

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
