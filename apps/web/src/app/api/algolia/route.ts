import { NextResponse } from "next/server";
import { adminClient as client } from "@/lib/search/algoliaConfig";

export async function POST(req: Request) {
  try {
    let body;
    // what: Parse JSON body from request
    // why: To handle incoming data from webhooks or API calls
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    if (!body || !body._id) {
      return NextResponse.json(
        { error: "Missing required field: _id" },
        { status: 400 }
      );
    }

    console.log("Received body:", body);

    // what: Use the operation field from Sanity
    // why: To reliably determine whether this is a create, update, or delete event
    const operation = body.operation;

    // what: Handle delete operation
    // why: To remove the document from Algolia if it has been deleted in Sanity
    if (operation === "delete") {
      try {
        await client.deleteObject({
          indexName: process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || "blogs",
          objectID: body._id,
        });
        console.log(`Deleted ${body._id} from Algolia`);
        return NextResponse.json({
          message: "Deleted from Algolia",
          id: body._id,
        });
      } catch (err: any) {
        console.error("Algolia delete error:", err);
        return NextResponse.json(
          { error: err.message || "Failed to delete from Algolia" },
          { status: 500 }
        );
      }
    }

    // what: Handle create or update operation
    // why: To ensure the latest data is indexed for search
    try {
      const record = {
        objectID: body._id,
        title: body.title,
        description: body.description,
        slug: body.slug,
        categories: body.categories,
        authors: body.authors,
        publishedAt: body.publishedAt,
        image: body.image,
      };

      await client.saveObject({
        indexName: process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || "blogs",
        body: record,
      });

      console.log(`Saved ${body._id} to Algolia`);
      return NextResponse.json({
        message: "Saved to Algolia",
        id: body._id,
      });
    } catch (err: any) {
      console.error("Algolia save error:", err);
      return NextResponse.json(
        { error: err.message || "Failed to save to Algolia" },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Unexpected webhook error:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}

// what: Handle GET request to verify webhook is working
// why: To provide a simple health check for the webhook endpoint
export async function GET() {
  return NextResponse.json({ message: "Algolia webhook is ready" });
}
