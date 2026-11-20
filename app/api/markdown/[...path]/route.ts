import { NextRequest, NextResponse } from "next/server";
import TurndownService from "turndown";

// turndown corre sobre @mixmark-io/domino (HTML parser propio, no DOM real),
// así que funciona en runtime Node sin jsdom. No funciona en Edge.
export const runtime = "nodejs";

const turndownService = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
});
// The shell is not content: drop the nav, the menu sheet and the footer.
turndownService.remove(["script", "style", "noscript", "nav", "header", "dialog", "footer"]);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const targetPath = `/${path.join("/")}${request.nextUrl.search}`;

  const upstream = await fetch(new URL(targetPath, request.nextUrl.origin), {
    headers: {
      accept: "text/html",
      // Marca el pedido como interno para que proxy.ts no lo vuelva a
      // interceptar y reescriba hacia sí mismo en loop.
      "x-markdown-internal": "1",
    },
  });

  if (!upstream.ok) {
    return new NextResponse("Not found", { status: upstream.status });
  }

  const html = await upstream.text();
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  // The skip link only makes sense on the rendered page.
  const body = (bodyMatch ? bodyMatch[1] : html).replace(/<a\b[^>]*\bskip-link\b[^>]*>[\s\S]*?<\/a>/i, "");
  const markdown = turndownService.turndown(body).trim();

  return new NextResponse(markdown, {
    status: 200,
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      vary: "Accept",
      "x-markdown-tokens": String(Math.ceil(markdown.length / 4)),
    },
  });
}
