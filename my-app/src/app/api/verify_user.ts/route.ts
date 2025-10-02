import dbConnect from "@/lib/dbConnect";


export async function POST(request: Request) {
    await dbConnect()

    try {
        const { username, code } = await request.json()
        
        const decodedUsername = 

    } catch (error) {

    }
}