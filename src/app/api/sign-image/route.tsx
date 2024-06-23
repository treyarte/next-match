import { cloudinary } from "@/libs/cloudinary";

export async function POST(req:Request) {
  const body = (await req.json()) as {paramsToSign: Record<string, string>};
  const {paramsToSign} = body;

  const signature = cloudinary.v2.utils.api_sign_request(paramsToSign, 
    process.env.CLOUDINARY_API_SECRET as string);

  return Response.json({signature});
}