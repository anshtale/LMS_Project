import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
    req:Request,
    { params }:{params : {courseId:string,chapterId:string}}
){
    try{
        const {userId} = auth();
        const {courseId} = params;
        const { isPublished,...values } = await req.json();

        if(!userId) return new NextResponse("Unauthorized user",{status : 401});

        const owner = await db.course.findUnique({
            where:{
                id:params.courseId,
                userId: userId
            }
        })
        if(!owner){
            return new NextResponse("Unauthorized",{status : 500});
        }

        const chapter = await db.chapter.update({
            where:{
                id:courseId,
                courseId:params.courseId

            },
            data:{
                ...values,
            }
        })
        //handle video upload
        return NextResponse.json(chapter);
    }catch(error){
        console.log("[CHAPTER_ID]",error);
        return new NextResponse("Internal Server Error",{status : 500})
    }
}