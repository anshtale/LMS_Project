"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { Pencil } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { z } from "zod"

interface DescriptionFormProps{
    intialData:{
        description:string;
    },
    courseId:string
}

const formSchema = z.object({
    description:z.string().min(1,
    {
        message:"Title is Required"
    })
})
const DescriptionForm = ({
    intialData,
    courseId
}:DescriptionFormProps) => {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: intialData
    });
    
    const [isEditing,setIsEditing] = useState(false);
    const toggleEdit = ()=>setIsEditing((current)=>(!current));
    const { isSubmitting, isValid } = form.formState;
    const onSubmit = async (values : z.infer<typeof formSchema>)=>{
        try{
            const response = await axios.post(`/api/courses/${courseId}`,values);
            toggleEdit();
            useRouter().refresh();

        }catch{
            toast.error("Something went wrong!");
        }
    }

    return (
        <div className="mt-6 bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course Description
            
                <Button onClick={toggleEdit} value={"ghost"}>
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
                <p className={cn("text-sm mt-2",
                    !intialData.description && "text-slate-500 italic"
                )}>
                    {intialData.description || "No description"}
                </p>
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
                                        <Textarea 
                                            disabled = {isSubmitting}
                                            placeholder="e.g.'This course is about...' " 
                                            {...field}/>
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

export default DescriptionForm;