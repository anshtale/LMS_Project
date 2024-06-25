"use client"

import { Button } from "@/components/ui/button"


import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Combobox } from "@/components/ui/combobox"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { Course } from "@prisma/client"
import axios from "axios"
import { Pencil } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { z } from "zod"

interface CategoryFormProps{
    intialData:Course
    courseId:string
    categoryOptions: { label:string; value:string; }[]
}

const formSchema = z.object({
    categoryId:z.string().min(1),
})
const CategoryForm = ({
    intialData,
    courseId,
    categoryOptions
}:CategoryFormProps) => {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            categoryId: intialData?.categoryId || ""
        },
    });
    const router = useRouter();
    const [isEditing,setIsEditing] = useState(false);
    const toggleEdit = ()=>setIsEditing((current)=>(!current));
    const { isSubmitting, isValid } = form.formState;
    const onSubmit = async (values : z.infer<typeof formSchema>)=>{
        try{
            await axios.patch(`/api/courses/${courseId}`,values);
            toast.success("Description Updated!")
            toggleEdit();
            router.refresh();

        }catch{
            toast.error("Something went wrong!");
        }
    }
    const selectedOption = categoryOptions.find((option)=> option.value === intialData.categoryId)

    return (
        <div className="mt-6 bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course Category
            
                <Button onClick={toggleEdit} value="ghost">
                    {isEditing ? (
                        <>Cancel</>
                    ):( <>
                        <Pencil className="h-4 w-4 mr-2"/>
                        Edit Category
                        </>
                    )}
                    
                </Button>
            </div>
            {!isEditing && (
                <p className={cn("text-sm mt-2",
                    !intialData.categoryId && "text-slate-500 italic"
                )}>
                    {selectedOption?.label || "No category"}
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
                            name = "categoryId"
                            render={({field}) =>(
                                <FormItem>
                                    <FormControl>
                                        <Combobox
                                            options={categoryOptions}
                                            {...field}
                                        />
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

export default CategoryForm;