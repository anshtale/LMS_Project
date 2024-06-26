import { IconBadge } from "@/components/icon-badge"
import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { CircleDollarSign, DollarSign, File, Icon, LayoutDashboard, ListChecks } from "lucide-react"
import { redirect } from "next/navigation"
import TitleForm from "./_components/title-form"
import DescriptionForm from "./_components/description-form"
import ImageForm from "./_components/image-form"
import CategoryForm from "./_components/category-form"
import PriceForm from "./_components/price-form"
import AttachmentForm from "./_components/attachment-form"
import ChaptersForm from "./_components/chapters-form"



const CourseIdPage = async ({ params }:{
    params:{ 
        courseId:string 
    }
})=>{
    const { userId } = auth()

    if(!userId){
        return redirect("/");
    }
    const course = await db.course.findUnique({
        where:{
            userId,
            id:params.courseId
        },
        include:{
            attachments:{
                orderBy:{
                    createdAt:"desc",
                }
            },
            chapters:{
                orderBy:{
                  position:"asc"
                }
            }
        }
    })

    const categories = await db.category.findMany({
        orderBy: {
            name: "asc"
        },
    });

    if(!course) return redirect("/");

    const requiredFields = [
        course.title,
        course.description,
        course.imageUrl,
        course.price,
        course.categoryId,
        course.chapters.some(chapter=> chapter.isPublished),
    ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;

    const completionText = `(${completedFields}/${totalFields})`;


    return(
        <div className="p-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-y-2">
                    <h1 className="text-2xl font-medium">
                        Course Setup
                    </h1>
                    <span className="text-sm text-slate-700 ">
                        Complete all fields {completionText}
                    </span>
                </div>

            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                <div>
                    <div className="flex items-center gap-x-2">
                        <IconBadge icon={LayoutDashboard} size={"sm"} variant="default"/>
                        <h2 className="text-xl">
                            Customize your course
                        </h2>
                    </div>
                    <TitleForm
                        intialData = {course}
                        courseId = {course.id}/>
                    <DescriptionForm
                        intialData = {course}
                        courseId = {course.id}
                    />
                    <ImageForm
                        intialData={course}
                        courseId={course.id}
                    />
                    <CategoryForm
                        intialData = {course}
                        courseId = {course.id}
                        categoryOptions={categories.map((category)=>({
                            label : category.name,
                            value : category.id,
                        }))}
                    />
                </div>
                <div className="space-y-6">
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={ListChecks}/>
                            <h2 className="text-xl">
                                Course Chapters
                            </h2>
                        </div>
                    </div>
                    <ChaptersForm
                        intialData = {course}
                        courseId = {course.id}
                    />
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={CircleDollarSign}/>
                            <h2 className="text-xl">
                                Sell your course
                            </h2>
                        </div>
                        <PriceForm
                            intialData = {course}
                            courseId = {course.id}
                        />
                    </div>
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={File}/>
                            <h2 className="text-xl">
                                Resources & Attachments
                            </h2>
                        </div>
                        <AttachmentForm
                            intialData={course}
                            courseId={course.id}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CourseIdPage;