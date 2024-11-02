"use client"
import { useEffect } from "react"
import { useParams } from "next/navigation"
import { useOrganizationList } from "@clerk/nextjs"

function OrgControl() {
    const params = useParams();
    const { setActive} = useOrganizationList();

    useEffect(()=>{
        if (!setActive) return;
        setActive({
            organization: params.organizationid as string
        })
    },[setActive, params.organizationid])

    return null
}

export default OrgControl