import { UserButton } from "@clerk/nextjs";

export default function Home(){
    return (
        <div>
            <div>
                hnlo!
            </div>
            <UserButton  afterSignOutUrl="/"/>
        </div>
    )
}