"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { Chapter, Course } from "@prisma/client"
import axios from "axios"
import { Loader, Loader2, Pencil, PlusCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { title } from "process"
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { z } from "zod"
import { ChaptersList } from "./chapters-list"

interface ChaptersFormProps{
    intialData: Course & {chapters : Chapter[]}
    courseId:string
}

const formSchema = z.object({
    title:z.string().min(1),
})
const ChaptersForm = ({
    intialData,
    courseId
}:ChaptersFormProps) => {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
        }
    });
    const router = useRouter();
    const [isUpdating,setIsUpdating] = useState(false);
    const [isCreating,setIsCreating] = useState(false);


    const toggleCreating= ()=> {
        setIsCreating((isCreating)=>(!isCreating));
    }

    const { isSubmitting, isValid } = form.formState;
    const onSubmit = async (values : z.infer<typeof formSchema>)=>{
        try{
            await axios.post(`/api/courses/${courseId}/chapters`,values);
            toast.success("Chapter Created!")
            toggleCreating();
            router.refresh();

        }catch{
            toast.error("Something went wrong!");
        }
    }
    const onReorder = async (updateData:{ id:string, position:number}[])=>{
        try{
            setIsUpdating(true);
            await axios.put(`/api/courses/${courseId}/chapters/reorder`,{
                list: updateData
            })
            toast.success("Chapter reordered!")
            router.refresh();
        }catch{
            toast.error("Something went wrong")
        }finally{
            setIsUpdating(false);
        }
    }
    const onEdit = (id:string)=>{
        router.push(`/teacher/courses/${courseId}/chapters/${id}`)
    }
    
    return (
        <div className="relative mt-6 bg-slate-100 rounded-md p-4">
            {isUpdating && (
                <div className="absolute h-full w-full bg-slate-500/20
                rounded-m flex items-center justify-center">
                    <Loader2 className="animate-spin h-6 w-6 text-sky-700"/>
                </div>
            )}
            <div className="font-medium flex items-center justify-between">
                Course Chapters
            
                <Button onClick={toggleCreating} value="ghost">
                    {isCreating ? (
                        <>Cancel</>
                    ):( <>
                        <PlusCircle className="h-4 w-4 mr-2"/>
                        Add a Chapter
                        </>
                    )}
                    
                </Button>
            </div>
    
            {isCreating && (
                <Form {...form}>
                    <form 
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                    >
                        <FormField
                            control={form.control}
                            name = "title"
                            render={({field}) =>(
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="e.g. 'Introduction to the course'"
                                            {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}>

                        </FormField>

                        <Button
                            disabled = {isSubmitting || !isValid}
                            type="submit">
                            Create
                        </Button>

                    </form>
                </Form>
            )}
            {!isCreating && (
                <div className={cn(
                    "text-sm mt-2",
                    !intialData.chapters.length && "text-slate-500 italic"
                )}>
                   {!intialData.chapters.length && "No chapters"}
                   <ChaptersList
                        items={intialData.chapters || []}
                        onEdit = {()=>{}}
                        onReorder = {onReorder}
                    />
                </div>
            )}
            {!isCreating && (
                <p>
                    Drag & Drop to reorder the chapters
                </p>
            )}
        </div>
    )
}

export default ChaptersForm;