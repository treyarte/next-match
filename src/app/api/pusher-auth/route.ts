import { auth } from "@/auth";
import { pusherServer } from "@/libs/pusher";
import { NextResponse } from "next/server";

export async function POST(request:Request) {
    try {
        const session = await auth();
        if(!session?.user?.id) {
            return new Response('Unauthorized', {status: 401})
        }

        const body = await request.formData();

        const socketId = body.get('socket_id');
        const channel = body.get('channel_name');
        const data = {
            user_id: session.user.id
        }

        const authResponse = pusherServer.authorizeChannel(socketId as string, channel as string, data)
        return NextResponse.json(authResponse);
    } catch (error) {
        
    }
}