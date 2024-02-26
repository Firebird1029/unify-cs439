import React from "react";
import TestImg from "@/components/svg-art/test"

function Index(){
    return(
        <div>
            <h1 className="font-koulen">Welcome to Uni.fy!</h1>
            <button className="border rounded-full px-6 py-2 text-lg font-koulen">Log In</button>
            <button className="border rounded-full px-6 py-2 text-lg font-koulen">Enter Code</button>
            <TestImg/>
        </div>
    )
}

export default Index;