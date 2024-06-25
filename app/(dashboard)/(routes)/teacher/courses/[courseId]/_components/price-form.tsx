"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { formatPrice } from "@/lib/format"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { Course } from "@prisma/client"
import axios from "axios"
import { Pencil } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { number, z } from "zod"

interface PriceFormProps{
    intialData:Course
    courseId:string
}

const formSchema = z.object({
    price: z.coerce.number(),
})
const PriceForm = ({
    intialData,
    courseId
}:PriceFormProps) => {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            price: intialData?.price || undefined,
        }
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

    return (
        <div className="mt-6 bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course Price
            
                <Button onClick={toggleEdit} value="ghost">
                    {isEditing ? (
                        <>Cancel</>
                    ):( <>
                        <Pencil className="h-4 w-4 mr-2"/>
                        Edit Price
                        </>
                    )}
                    
                </Button>
            </div>
            {!isEditing && (
                <p className={cn("text-sm mt-2",
                    !intialData.price && "text-slate-500 italic"
                )}>
                    {intialData.price ? 
                    formatPrice(intialData.price) : "No price" }
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
                            name = "price"
                            render={({field}) =>(
                                <FormItem>
                                    <FormControl>
                                        <Input 
                                            type="number"
                                            step="0,01"
                                            disabled = {isSubmitting}
                                            placeholder="Set a price for your course " 
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

export default PriceForm;