import { NextResponse } from "next/server";
import { client } from "@/lib/search/algoliaConfig";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const isDelete = body._deleted || body._type === "deleted";

    if (isDelete) {
      await client.deleteObject(body._id);
      return NextResponse.json({ message: "Deleted from Algolia", id: body._id });
    }

    await client.saveObject({
      indexName: process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || "blogs",
      objectID: body._id,
      ...body,
    });

    return NextResponse.json({ message: "Saved to Algolia", id: body._id });
  } catch (error: any) {
    console.error("Algolia webhook error:", error);
    return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 500 });
  }
}
export async function GET() {
  return NextResponse.json({ message: "Algolia webhook is ready" });
}
