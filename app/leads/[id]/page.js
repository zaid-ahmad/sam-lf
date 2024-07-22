import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

async function getLeadDetails(id) {
    const lead = await prisma.lead.findUnique({
        where: { id },
        include: {
            canvasser: {
                select: { firstName: true, lastName: true },
            },
            salesRep: {
                select: { firstName: true, lastName: true },
            },
        },
    });

    if (!lead) {
        notFound();
    }

    return lead;
}

const colorMap = {
    APPOINTMENT: "blue",
    ASSIGNED: "yellow",
    DEMO: "purple",
    SALE: "green",
    DEAD: "red",
    UNASSIGNED: "gray",
};

function formatAgeRange(ageRange) {
    switch (ageRange) {
        case "THIRTY_TO_FORTY":
            return "30-40";
        case "FORTY_TO_FIFTY":
            return "40-50";
        case "FIFTY_TO_SIXTY":
            return "50-60";
        case "SIXTY_TO_SEVENTY":
            return "60-70";
        case "SEVENTY_PLUS":
            return "70+";
        default:
            return ageRange;
    }
}

function formatService(service) {
    switch (service) {
        case "REPAIRS":
            return "Repairs";

        case "GUTTERS":
            return "Gutters";

        case "LF":
            return "Leaf Filter";

        case "FI":
            return "Free Inspection";

        default:
            return service;
    }
}

function formatConcerns(concern) {
    switch (concern) {
        case "inspection-estimate":
            return "Inspection / Estimate";

        case "clogging-damages":
            return "Cloging / Damages";

        case "new-gutters":
            return "New Gutters";

        case "downspout-roof-extensions":
            return "Downspout / Roof Extensions Needed";

        default:
            return concern;
    }
}

function formatSurroundingAwareness(surrounding_awareness) {
    switch (surrounding_awareness) {
        case "lotsoftrees":
            return "Lots of trees";

        case "wildlife":
            return "Wildlife";

        case "roofingOrShingleGrit":
            return "Roofing / Shingle Grit";

        default:
            return surrounding_awareness;
    }
}

export default async function LeadDetailsPage({ params }) {
    const lead = await getLeadDetails(params.id);

    return (
        <div className='container mx-auto py-10'>
            <Breadcrumb className='mb-10 max-w-3xl mx-auto '>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href='/dashboard'>
                            Dashboard
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>
                            Lead Details for {lead.firstName}
                        </BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <Card className='w-full max-w-3xl mx-auto'>
                <CardHeader>
                    <CardTitle className='text-2xl font-bold'>
                        Lead Details
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <h3 className='font-semibold'>Name</h3>
                            <p>
                                {lead.firstName} {lead.lastName}
                            </p>
                        </div>
                        <div>
                            <h3 className='font-semibold'>Contact</h3>
                            <p>Phone: {lead.phone1}</p>
                            {lead.phone2 && <p>Alt Phone: {lead.phone2}</p>}
                            {lead.email && <p>Email: {lead.email}</p>}
                        </div>
                    </div>

                    <Separator className='my-4' />

                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <h3 className='font-semibold'>Address</h3>
                            <p>{lead.address}</p>
                            <p>{lead.postalCode}</p>
                            <p>Quadrant: {lead.quadrant}</p>
                        </div>
                        <div>
                            <h3 className='font-semibold'>Appointment</h3>
                            <p>{lead.appointmentDateTime}</p>
                        </div>
                    </div>

                    <Separator className='my-4' />

                    <div>
                        <h3 className='font-semibold'>Home Owner Type</h3>
                        <p>{lead.homeOwnerType}</p>
                    </div>

                    <Separator className='my-4' />

                    <div>
                        <h3 className='font-semibold'>Age Range</h3>
                        <p>{formatAgeRange(lead.age)}</p>
                    </div>

                    <Separator className='my-4' />

                    <div>
                        <h3 className='font-semibold'>Service Details</h3>
                        <div className='flex flex-wrap gap-2 mt-2'>
                            {lead.serviceNeeded.map((service, index) => (
                                <Badge key={index} variant='secondary'>
                                    {formatService(service)}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <Separator className='my-4' />

                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <h3 className='font-semibold'>Status</h3>
                            <Badge
                                variant='outline'
                                className={`bg-${
                                    colorMap[lead.status]
                                }-100 text-${
                                    colorMap[lead.status]
                                }-800 border-${colorMap[lead.status]}-300 mt-1`}
                            >
                                {lead.status}
                            </Badge>
                        </div>
                        <div>
                            <h3 className='font-semibold'>Amount</h3>
                            <p>
                                {lead.amount
                                    ? `$${lead.amount.toFixed(2)}`
                                    : "N/A"}
                            </p>
                        </div>
                    </div>

                    {lead.jobNumber && (
                        <>
                            <Separator className='my-4' />
                            <div>
                                <h3 className='font-semibold'>Job Number</h3>
                                <p>{lead.jobNumber}</p>
                            </div>
                        </>
                    )}

                    {lead.installationDate && (
                        <>
                            <Separator className='my-4' />
                            <div>
                                <h3 className='font-semibold'>
                                    Installation Date
                                </h3>
                                <p>{lead.installationDate}</p>
                            </div>
                        </>
                    )}

                    <Separator className='my-4' />

                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <h3 className='font-semibold'>Canvasser</h3>
                            <p>
                                {lead.canvasser.firstName}{" "}
                                {lead.canvasser.lastName}
                            </p>
                        </div>
                        <div>
                            <h3 className='font-semibold'>Sales Rep</h3>
                            {lead.salesRep ? (
                                <p>
                                    {lead.salesRep.firstName}{" "}
                                    {lead.salesRep.lastName}
                                </p>
                            ) : (
                                <p>Not assigned</p>
                            )}
                        </div>
                    </div>

                    {lead.concerns.length > 0 && (
                        <>
                            <Separator className='my-4' />
                            <div>
                                <h3 className='font-semibold'>Concerns</h3>
                                <ul className='list-disc pl-5 mt-2'>
                                    {lead.concerns.map((concern, index) => (
                                        <li key={index}>
                                            {formatConcerns(concern)}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </>
                    )}

                    {lead.surrounding.length > 0 && (
                        <>
                            <Separator className='my-4' />
                            <div>
                                <h3 className='font-semibold'>
                                    Surrounding Awareness
                                </h3>
                                <ul className='list-disc pl-5 mt-2'>
                                    {lead.surrounding.map((item, index) => (
                                        <li key={index}>
                                            {formatSurroundingAwareness(item)}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </>
                    )}

                    {lead.addressNotes && (
                        <>
                            <Separator className='my-4' />
                            <div>
                                <h3 className='font-semibold'>Address Notes</h3>
                                <p>{lead.addressNotes}</p>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
