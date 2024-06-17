"use client"

import * as z from "zod";
import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form"
import {useRouter} from "next/navigation"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormLabel,
    FormMessage,
    FormItem
} from "@/components/ui/form"

import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import Link from "next/link";
import { Ghost } from "lucide-react";
import toast from "react-hot-toast";

const formSchema = z.object({
    title:z.string().min(1,{
        message:"Title is Required",
    }),


})

const CreateCoursePage = () => {
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver:zodResolver(formSchema),
        defaultValues:{
            title:""
        }
    })

    const {isSubmitting,isValid} = form.formState;
    const onSubmit = async(values : z.infer<typeof formSchema>)=>{
        try{
            const response = await axios.post("/api/courses",values);
            router.push(`/teacher/courses/${response.data.id}`);

        }catch{
            toast.error("Something went wrong!");
        }
    }

    return (
        <div className="max-w-5xl mx-auto flex
        justify-center items-center
        h-full p-6">
            <div>
                <h1 className="text-2xl">
                    Name your Course!
                </h1>
                <p className="text-slate-600 text-sm">
                    What would you like to name your
                    course?
                </p>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8 mt-8">
                        <FormField
                        control={form.control}
                        name="title"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>
                                    Course Title
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={isSubmitting}
                                        placeholder="e.g. Python Course"
                                        {...field}/>
                                </FormControl>
                                <FormDescription>
                                    What will you teach in this course?
                                </FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                        />
                        <div className=" flex gap-x-2">
                            <Link href={'/'}>
                                <Button type="button" variant="ghost">
                                    Cancel
                                </Button>
                            </Link>
                            <Button
                                variant={"ghost"}
                                type="submit"
                                disabled={isSubmitting || !isValid}
                            >
                                Continue
                            </Button>

                        </div>
                    </form>

                </Form>
            </div>

        </div>
    )
}

export default CreateCoursePage;