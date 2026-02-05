// export { auth as middleware } from "@/app/auth"
import { auth, signIn } from "@/app/auth";
export default auth((req) => {  
  if (!req.auth && req.nextUrl.pathname !== "/auth/signin") {
    const newUrl = new URL("api/auth/signin", req.nextUrl.origin)
    return Response.redirect(newUrl)
  }
  // if (req.auth && req.nextUrl.pathname === "/auth/signin") {
  //   const newUrl = new URL("/", req.nextUrl.origin)
  //   return Response.redirect(newUrl)
  // }
})
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}