"use client"

import { Editor } from "@/components/editor"
import { Preview } from "@/components/preview"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from "@/components/ui/form"
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

interface ChapterAccessFormProps{
    intialData:Chapter
    courseId:string
    chapterId:string
}

const formSchema = z.object({
    isFree:z.boolean().default(false)
})
const ChapterAccessForm = ({
    intialData,
    courseId,
    chapterId
}:ChapterAccessFormProps) => {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            isFree: !!intialData.isFree
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
                Chapter Access Settings
            
                <Button onClick={toggleEdit} value="ghost">
                    {isEditing ? (
                        <>Cancel</>
                    ):( <>
                        <Pencil className="h-4 w-4 mr-2"/>
                        Chapter Access
                        </>
                    )}
                    
                </Button>
            </div>
            {!isEditing && (
                <div className={cn("text-sm mt-2",
                    !intialData.isFree && "text-slate-500 italic"
                )}>
                    {intialData.isFree ? (
                        <>This Chapter is free for preview</>
                    ):(
                        <>This Chapter is not free</>
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
                            name = "isFree"
                            render={({field}) =>(
                                <FormItem className="flex flex-row items-start space-x-3
                                space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange}/>
                                    </FormControl>
                                    <div className="space-y-1 leading-none ">
                                        <FormDescription>
                                            Check this box if you want to make this chapter free for preview
                                        </FormDescription>

                                    </div>
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

export default ChapterAccessForm;