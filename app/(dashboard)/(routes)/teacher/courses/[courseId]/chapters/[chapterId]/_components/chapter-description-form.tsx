"use client"

import { Editor } from "@/components/editor"
import { Preview } from "@/components/preview"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { Chapter } from "@prisma/client"
import axios from "axios"
import { Pencil } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { z } from "zod"

interface ChapterDescriptionFormProps{
    intialData:Chapter
    courseId:string
    chapterId:string
}

const formSchema = z.object({
    description:z.string().min(1)
})
const ChapterDescriptionForm = ({
    intialData,
    courseId,
    chapterId
}:ChapterDescriptionFormProps) => {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: intialData?.description || ""
        }
    });
    const router = useRouter();
    const [isEditing,setIsEditing] = useState(false);
    const toggleEdit = ()=>setIsEditing((current)=>(!current));
    const { isSubmitting, isValid } = form.formState;
    const onSubmit = async (values : z.infer<typeof formSchema>)=>{
        try{
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`,values);
            toast.success("Chapter Updated!")
            toggleEdit();
            router.refresh();

        }catch{
            toast.error("Something went wrong!");
        }
    }

    return (
        <div className="mt-6 bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Chapter Description
            
                <Button onClick={toggleEdit} value="ghost">
                    {isEditing ? (
                        <>Cancel</>
                    ):( <>
                        <Pencil className="h-4 w-4 mr-2"/>
                        Edit description
                        </>
                    )}
                    
                </Button>
            </div>
            {!isEditing && (
                <div className={cn("text-sm mt-2",
                    !intialData.description && "text-slate-500 italic"
                )}>
                    {!intialData.description && "No description"}
                    {intialData.description && (
                        <Preview value={intialData.description}/>
                    )}
                </div>
            )}
            {isEditing && (
                <Form {...form}>
                    <form 
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                    >
                        <FormField
                            control={form.control}
                            name = "description"
                            render={({field}) =>(
                                <FormItem>
                                    <FormControl>
                                        <Editor {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}>

                        </FormField>
                        <div className="flex items-center gap-x-2">
                            <Button
                                disabled = {isSubmitting || !isValid}
                                type="submit">
                                Save
                            </Button>
                        </div>

                    </form>
                </Form>
            )}
        </div>
    )
}

export default ChapterDescriptionForm;