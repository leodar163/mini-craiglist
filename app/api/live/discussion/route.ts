import {NextRequest} from "next/server";
import {DBTables, getDBWebSocket} from "@/lib/db/surrealdb";
import {getSession} from "@/app/actions/auth.actions";
import {jsonify} from "surrealdb";
import {convertDiscussionDB, DiscussionDB} from "@/lib/types/discussion";

export async function GET(request: NextRequest) {
    const session = await getSession();
    if (!session.success) return new Response('Unauthorized', { status: 401 });

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
        async start(controller) {
            const db = await getDBWebSocket();

            const live = await db.live(DBTables.discussion).fetch("advertisement", "sender")

            request.signal.addEventListener("abort", () => {
                live.kill();
                db.close();
            });

            try {
                for await (const update of live) {
                    const discussion = (await convertDiscussionDB(update.value as unknown as DiscussionDB))[0];

                    const data = encoder.encode(
                        `data: ${JSON.stringify(jsonify({action: update.action, result: discussion}))}\n\n`
                    )
                    controller.enqueue(data);
                }
            }
            catch (e) {
                await live.kill();
                await db.close();
                controller.close();
                console.error(e)
            }

        }
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        }
    })
}