import {NextRequest} from "next/server";
import {getSession} from "@/app/actions/auth.actions";
import {and, eq, jsonify, or, RecordId} from "surrealdb";
import {DBTables, getDBWebSocket} from "@/lib/db/surrealdb";
import {convertMessageDB, MessageDB} from "@/lib/types/discussion";

export async function GET(
    request: NextRequest,
    {params}: { params: Promise<{ discussionId: string }> }
) {
    const session = await getSession();
    if (!session.success) return new Response('Unauthorized', {status: 401});

    const encoder = new TextEncoder();

    const userId = new RecordId(DBTables.user, session.value.user.id);

    const discussionId = new RecordId(DBTables.discussion, (await params).discussionId);

    const stream = new ReadableStream({
        async start(controller) {
            const db = await getDBWebSocket();

            const live = await db
                .live(DBTables.message)
                .where(eq("discussion", discussionId));

            request.signal.addEventListener("abort", () => {
                live.kill();
                db.close();
            });

            try {
                for await (const update of live) {
                    const message = convertMessageDB(update.value as unknown as MessageDB)[0];

                    const data = encoder.encode(`data: ${JSON.stringify({
                        action: update.action,
                        result: message,
                    })}\n\n`);
                    controller.enqueue(data);
                }
            } catch (error) {
                await live.kill();
                await db.close();
                controller.close();
                console.error(error);
            }
        }
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        }
    });
}